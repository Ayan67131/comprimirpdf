import uuid
import os
from pathlib import Path
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from config import (
    UPLOADS_DIR,
    COMPRESSED_DIR,
    MAX_FILE_SIZE_BYTES,
    ALLOWED_PDF_TYPES,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_TYPES,
    ALLOWED_EXTENSIONS,
)
from services.compression  import compress_pdf, compress_image
from utils.dependencies    import get_current_user, get_optional_user

router = APIRouter()

# In-memory history per session (keyed by user email).
# For persistence across restarts, swap this for a JSON file.
_history: dict[str, list[dict]] = {}


def _add_history(email: str, entry: dict) -> None:
    _history.setdefault(email, []).insert(0, entry)
    _history[email] = _history[email][:20]   # keep last 20


def _size_label(bytes_: int) -> str:
    if bytes_ < 1024:
        return f"{bytes_} B"
    if bytes_ < 1024 ** 2:
        return f"{bytes_ / 1024:.1f} KB"
    return f"{bytes_ / 1024 ** 2:.2f} MB"


# ── Upload & Compress ─────────────────────────────────────

@router.post("/compress")
async def compress_file(
    file: UploadFile = File(...),
    current_user: dict | None = Depends(get_optional_user),
):
    """
    Upload a PDF or image, compress it, and return download info + stats.
    Public — no login required. When a Bearer token IS supplied, the
    compression is also recorded in that user's history.
    """
    # Validate extension
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{suffix}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Validate MIME
    mime = file.content_type or ""
    if mime not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported MIME type '{mime}'",
        )

    # Read & size-check
    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE_BYTES // (1024**2)} MB",
        )

    # Save upload
    upload_name = f"{uuid.uuid4().hex}{suffix}"
    upload_path = UPLOADS_DIR / upload_name
    upload_path.write_bytes(content)

    # Compress
    try:
        if mime in ALLOWED_PDF_TYPES:
            out_path, original, compressed = compress_pdf(upload_path)
        else:
            out_path, original, compressed = compress_image(upload_path, mime)
    except Exception as exc:
        upload_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compression failed: {exc}",
        )

    # Clean up upload
    upload_path.unlink(missing_ok=True)

    saving_pct = round((1 - compressed / original) * 100, 1) if original else 0
    download_id = out_path.name

    entry = {
        "id":             download_id,
        "original_name":  file.filename,
        "original_size":  _size_label(original),
        "compressed_size": _size_label(compressed),
        "saving_percent": saving_pct,
        "file_type":      "pdf" if mime in ALLOWED_PDF_TYPES else "image",
        "compressed_at":  datetime.now(timezone.utc).isoformat(),
        "download_url":   f"/files/download/{download_id}",
    }
    # Only logged-in users get history; anonymous users just download.
    if current_user:
        _add_history(current_user["email"], entry)

    return entry


# ── Download ──────────────────────────────────────────────

@router.get("/download/{file_id}")
def download_file(
    file_id: str,
    current_user: dict | None = Depends(get_optional_user),
):
    """Download a previously compressed file by its ID. Public — no login required."""
    # Basic path-traversal guard
    if "/" in file_id or "\\" in file_id or ".." in file_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file ID")

    file_path = COMPRESSED_DIR / file_id
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found or already deleted")

    return FileResponse(
        path=str(file_path),
        filename=file_id,
        media_type="application/octet-stream",
    )


# ── History ───────────────────────────────────────────────

@router.get("/history")
def get_history(current_user: dict = Depends(get_current_user)):
    """Return the last 20 compressed files for the current user."""
    return {"history": _history.get(current_user["email"], [])}


# ── Delete compressed file ────────────────────────────────

@router.delete("/delete/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    file_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a compressed file from disk."""
    if "/" in file_id or "\\" in file_id or ".." in file_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file ID")

    file_path = COMPRESSED_DIR / file_id
    if not file_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    file_path.unlink()

    # Remove from in-memory history
    email = current_user["email"]
    if email in _history:
        _history[email] = [h for h in _history[email] if h["id"] != file_id]
