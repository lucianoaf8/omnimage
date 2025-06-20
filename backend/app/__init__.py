"""Flask application factory for Omnimage Phase 2 backend.
This minimal backend focuses only on image upload, listing and serving.
Advanced AI-generation endpoints from the original `app.py` have **not** been
ported – keeping the scope aligned with Phase 2 requirements.
"""

from pathlib import Path
from flask import Flask
from flask_cors import CORS


def create_app() -> Flask:
    """Application factory used by *backend/run.py*.

    The app exposes only the API surface required for Phase 2:
    - /api/images            → list uploaded images
    - /api/images/upload     → upload a new image
    - /api/image/<filename>  → retrieve an image file
    - DELETE /api/image/<filename> → delete an image
    """

    app = Flask(__name__)
    CORS(app)  # Open CORS for local development (frontend dev server runs on a different port)

    # ---------------------------------------------------------------------
    # Folders
    # ---------------------------------------------------------------------
    project_root = Path(__file__).resolve().parent.parent  # backend/
    upload_dir = project_root / "uploads"
    thumbnail_dir = project_root / "thumbnails"
    static_dir = project_root / "static"

    for d in (upload_dir, thumbnail_dir, static_dir):
        d.mkdir(parents=True, exist_ok=True)

    # Store useful paths on the app config for easy access inside blueprints
    app.config.update(
        PROJECT_ROOT=str(project_root),
        UPLOAD_FOLDER=str(upload_dir),
        THUMBNAIL_FOLDER=str(thumbnail_dir),
        STATIC_FOLDER=str(static_dir),
    )

    # ------------------------------------------------------------------
    # Blueprints
    # ------------------------------------------------------------------
    from .routes.images import bp as images_bp  # noqa: E402  (local import to avoid circular deps)

    app.register_blueprint(images_bp)

    # Simple health-check
    @app.route("/ping")
    def ping():  # pragma: no cover – trivial
        return {"status": "ok"}

    return app
