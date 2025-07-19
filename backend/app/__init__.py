"""Flask application factory for Omnimage backend.
Refactored from monolithic app.py to proper modular structure.
Includes comprehensive API endpoints, error handling, and logging.
"""

from pathlib import Path
from flask import Flask, jsonify
from flask_cors import CORS

# Import utilities
from ..src.utils.logging_config import setup_logging
from ..src.utils.error_handling import OmnimageError, handle_api_error


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
    
    # Setup logging
    project_root = Path(__file__).resolve().parent.parent.parent  # omnimage root
    setup_logging(project_root)
    
    # Register error handlers
    @app.errorhandler(OmnimageError)
    def handle_omnimage_error(error):
        return handle_api_error(error)
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({'error': 'Resource not found', 'status_code': 404}), 404
    
    @app.errorhandler(500)
    def handle_internal_error(error):
        return jsonify({'error': 'Internal server error', 'status_code': 500}), 500

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
        PROJECT_ROOT=str(project_root.parent),  # Point to omnimage root
        UPLOAD_FOLDER=str(upload_dir),
        THUMBNAIL_FOLDER=str(thumbnail_dir),
        STATIC_FOLDER=str(static_dir),
    )

    # Register blueprints
    from .routes.images import bp as images_bp
    app.register_blueprint(images_bp)

    # Simple health-check
    @app.route("/ping")
    def ping():  # pragma: no cover – trivial
        return {"status": "ok"}

    return app
