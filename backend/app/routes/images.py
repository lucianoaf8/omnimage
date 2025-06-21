"""Image management API endpoints (CRUD lite).

Ported and simplified from original LogoNico `app.py`.
Only includes upload, list, serve and delete.  
Filenames are validated lightly; the original `parse_filename` function is copied
for simple metadata extraction.
"""

from __future__ import annotations

import shutil
from datetime import datetime
from pathlib import Path
from typing import List

from flask import Blueprint, current_app, jsonify, request, send_file

bp = Blueprint("images", __name__, url_prefix="/api")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "svg"}


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def parse_filename(filename: str):
    """Very light metadata extraction copied from original code."""
    from datetime import datetime

    stem = Path(filename).stem
    ext = Path(filename).suffix[1:]

    parts = stem.split("_")

    timestamp_idx = -1
    for i, part in enumerate(parts):
        if len(part) == 8 and part.isdigit():
            if i + 1 < len(parts) and len(parts[i + 1]) == 6 and parts[i + 1].isdigit():
                timestamp_idx = i
                break

    if timestamp_idx > 0:
        prompt_parts = parts[: timestamp_idx - 1]
        model_part = parts[timestamp_idx - 1]
        timestamp_parts = parts[timestamp_idx : timestamp_idx + 2]
        prompt_id = "_".join(prompt_parts) if prompt_parts else "unknown"
        model = model_part
        timestamp = "_".join(timestamp_parts)
        try:
            dt = datetime.strptime(timestamp, "%Y%m%d_%H%M%S")
            created_at = dt.strftime("%Y-%m-%d %H:%M:%S")
        except Exception:
            created_at = timestamp
    else:
        prompt_id = parts[0] if parts else "unknown"
        model = parts[1] if len(parts) > 1 else "unknown"
        created_at = "unknown"

    provider = "unknown"
    if "dalle" in model.lower():
        provider = "openai"
    elif "flux" in model.lower():
        provider = "fal_ai"

    return {
        "prompt_id": prompt_id,
        "model": model,
        "provider": provider,
        "created_at": created_at,
        "extension": ext,
        "filename": filename,
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@bp.get("/images")
def list_images():
    upload_folder = Path(current_app.config["UPLOAD_FOLDER"])
    images: List[dict] = []

    base_url = request.host_url.rstrip('/')  # e.g. http://localhost:5000

    if upload_folder.exists():
        for img_file in upload_folder.iterdir():
            if img_file.is_file() and img_file.suffix[1:].lower() in ALLOWED_EXTENSIONS:
                meta = parse_filename(img_file.name)
                images.append(
                    {
                        "id": img_file.stem,
                        "filename": img_file.name,
                        "url": f"{base_url}/api/image/{img_file.name}",
                        "thumbnail_url": f"{base_url}/api/image/{img_file.name}",  # same for now
                        **meta,
                    }
                )

    # Newest first by creation datetime if available
    images.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return jsonify(images)


@bp.post("/images/upload")
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "file field missing"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "empty filename"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "unsupported filetype"}), 400

    upload_folder = Path(current_app.config["UPLOAD_FOLDER"])
    save_path = upload_folder / file.filename

    # Ensure unique filename
    counter = 1
    while save_path.exists():
        save_path = upload_folder / f"{save_path.stem}_{counter}{save_path.suffix}"
        counter += 1

    file.save(save_path)
    return jsonify({"success": True, "filename": save_path.name})


@bp.get("/image/<path:filename>")
def serve_image(filename):
    upload_folder = Path(current_app.config["UPLOAD_FOLDER"])
    img_path = upload_folder / filename
    if not img_path.exists():
        return jsonify({"error": "not found"}), 404
    return send_file(img_path)


@bp.delete("/image/<path:filename>")
def delete_image(filename):
    upload_folder = Path(current_app.config["UPLOAD_FOLDER"])
    img_path = upload_folder / filename
    if not img_path.exists():
        return jsonify({"error": "not found"}), 404

    trash_dir = upload_folder.parent / "trash"
    trash_dir.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    trash_path = trash_dir / f"{img_path.stem}_{timestamp}{img_path.suffix}"
    shutil.move(str(img_path), str(trash_path))
    return jsonify({"success": True, "filename": filename})
