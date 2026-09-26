"""
Simple JSON-file user store.
Structure of users.json:
{
  "users": {
    "<email>": {
      "email": "...",
      "name": "...",
      "hashed_password": "...",
      "created_at": "ISO-datetime",
      "is_active": true
    }
  }
}
"""

import json
import threading
from datetime import datetime, timezone
from pathlib import Path

from config import USERS_FILE

_lock = threading.Lock()   # thread-safe reads/writes


def _load() -> dict:
    if not USERS_FILE.exists():
        return {"users": {}}
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save(data: dict) -> None:
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ── Public API ────────────────────────────────────────────

def get_user(email: str) -> dict | None:
    with _lock:
        data = _load()
        return data["users"].get(email.lower())


def user_exists(email: str) -> bool:
    return get_user(email) is not None


def create_user(email: str, name: str, hashed_password: str) -> dict:
    with _lock:
        data = _load()
        key  = email.lower()
        if key in data["users"]:
            raise ValueError("Email already registered")
        user = {
            "email":           key,
            "name":            name,
            "hashed_password": hashed_password,
            "created_at":      datetime.now(timezone.utc).isoformat(),
            "is_active":       True,
        }
        data["users"][key] = user
        _save(data)
        return user


def all_users() -> list[dict]:
    with _lock:
        data = _load()
        # Never expose hashed_password in listings
        return [
            {k: v for k, v in u.items() if k != "hashed_password"}
            for u in data["users"].values()
        ]
