from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routers import auth, files

app = FastAPI(
    title="ComprimirPDF API",
    description="File compression and auth backend",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────
# Production frontend domain(s). Extra origins can be appended with the
# FRONTEND_URLS env var (comma-separated).
_extra_origins = [
    u.strip()
    for u in os.getenv("FRONTEND_URLS", "").split(",")
    if u.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://comprimirpdf.dev",
        "https://www.comprimirpdf.dev",
        "https://comprimirpdf.onrender.com",
        *_extra_origins,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static folders ────────────────────────────────────────
os.makedirs("uploads", exist_ok=True)
os.makedirs("compressed", exist_ok=True)

# ── Routers ───────────────────────────────────────────────
app.include_router(auth.router,  prefix="/auth",  tags=["Auth"])
app.include_router(files.router, prefix="/files", tags=["Files"])


@app.get("/")
def root():
    return {"status": "ok", "message": "ComprimirPDF API is running"}
