import os
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────
BASE_DIR        = Path(__file__).parent
UPLOADS_DIR     = BASE_DIR / "uploads"
COMPRESSED_DIR  = BASE_DIR / "compressed"
USERS_FILE      = BASE_DIR / "users.json"

# ── JWT ───────────────────────────────────────────────────
# Change this in production — use a long random string
SECRET_KEY      = os.getenv("SECRET_KEY", "change-me-in-production-use-a-long-random-string")
ALGORITHM       = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24   # 24 hours

# ── File handling ─────────────────────────────────────────
MAX_FILE_SIZE_MB    = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

ALLOWED_PDF_TYPES   = {"application/pdf"}
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_TYPES       = ALLOWED_PDF_TYPES | ALLOWED_IMAGE_TYPES

ALLOWED_EXTENSIONS  = {".pdf", ".jpg", ".jpeg", ".png", ".webp"}

# ── Compression quality ───────────────────────────────────
IMAGE_QUALITY       = 70    # 1-95 (Pillow JPEG quality)
IMAGE_MAX_WIDTH     = 2000  # px — resize if wider than this
