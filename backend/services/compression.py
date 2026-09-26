"""
Compression service.

PDF  → uses pikepdf (lossless object stream compression)
Image → uses Pillow (JPEG/WebP re-encode + optional resize)
"""

import uuid
from pathlib import Path

import pikepdf
from PIL import Image

from config import (
    COMPRESSED_DIR,
    IMAGE_QUALITY,
    IMAGE_MAX_WIDTH,
)


# ── PDF ───────────────────────────────────────────────────

def compress_pdf(input_path: Path) -> tuple[Path, int, int]:
    """
    Compress a PDF using pikepdf.
    Returns (output_path, original_bytes, compressed_bytes).
    """
    original_size = input_path.stat().st_size
    output_path   = COMPRESSED_DIR / f"{uuid.uuid4().hex}_compressed.pdf"

    with pikepdf.open(input_path) as pdf:
        pdf.save(
            output_path,
            compress_streams=True,
            object_stream_mode=pikepdf.ObjectStreamMode.generate,
            recompress_flate=True,
        )

    compressed_size = output_path.stat().st_size
    return output_path, original_size, compressed_size


# ── Image ─────────────────────────────────────────────────

def compress_image(input_path: Path, mime_type: str) -> tuple[Path, int, int]:
    """
    Compress an image using Pillow.
    - JPEG/JPG → re-saved at IMAGE_QUALITY
    - PNG      → converted to WebP (better compression, keeps transparency)
    - WebP     → re-saved at IMAGE_QUALITY
    Returns (output_path, original_bytes, compressed_bytes).
    """
    original_size = input_path.stat().st_size

    img = Image.open(input_path)

    # Resize if too wide
    if img.width > IMAGE_MAX_WIDTH:
        ratio  = IMAGE_MAX_WIDTH / img.width
        new_h  = int(img.height * ratio)
        img    = img.resize((IMAGE_MAX_WIDTH, new_h), Image.LANCZOS)

    if mime_type in ("image/png",):
        # PNG → WebP (smaller + lossless alpha support)
        output_path = COMPRESSED_DIR / f"{uuid.uuid4().hex}_compressed.webp"
        img.save(output_path, format="WEBP", quality=IMAGE_QUALITY, method=6)
    elif mime_type in ("image/webp",):
        output_path = COMPRESSED_DIR / f"{uuid.uuid4().hex}_compressed.webp"
        img.save(output_path, format="WEBP", quality=IMAGE_QUALITY, method=6)
    else:
        # JPEG
        output_path = COMPRESSED_DIR / f"{uuid.uuid4().hex}_compressed.jpg"
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(output_path, format="JPEG", quality=IMAGE_QUALITY, optimize=True)

    compressed_size = output_path.stat().st_size
    return output_path, original_size, compressed_size
