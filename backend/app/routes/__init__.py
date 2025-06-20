"""Package for API route blueprints.
Currently exposes `images` blueprint that handles image management endpoints.
"""

# Import order matters: blueprints must be imported here so they can be discovered
from .images import bp as images_bp  # noqa: F401  (re-export for convenience)
