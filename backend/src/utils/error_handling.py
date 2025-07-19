"""
Error handling utilities for Omnimage
"""
import logging
import traceback
from functools import wraps
from typing import Dict, Any, Callable
from flask import jsonify, request


logger = logging.getLogger('omnimage.error_handling')


class OmnimageError(Exception):
    """Base exception for Omnimage application"""
    def __init__(self, message: str, status_code: int = 500, details: Dict = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class ValidationError(OmnimageError):
    """Validation error"""
    def __init__(self, message: str, details: Dict = None):
        super().__init__(message, 400, details)


class NotFoundError(OmnimageError):
    """Resource not found error"""
    def __init__(self, message: str, details: Dict = None):
        super().__init__(message, 404, details)


class ProcessingError(OmnimageError):
    """Image processing error"""
    def __init__(self, message: str, details: Dict = None):
        super().__init__(message, 422, details)


def handle_api_error(error: Exception) -> tuple:
    """Handle API errors and return appropriate JSON response"""
    
    if isinstance(error, OmnimageError):
        logger.warning(f"Application error: {error.message}", extra={'details': error.details})
        return jsonify({
            'error': error.message,
            'status_code': error.status_code,
            'details': error.details
        }), error.status_code
    
    # Log unexpected errors
    logger.error(f"Unexpected error: {str(error)}", exc_info=True)
    
    return jsonify({
        'error': 'Internal server error',
        'status_code': 500,
        'message': 'An unexpected error occurred'
    }), 500


def api_error_handler(f: Callable) -> Callable:
    """Decorator to handle API errors"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return handle_api_error(e)
    return decorated_function


def log_request_info():
    """Log request information for debugging"""
    logger.debug(f"Request: {request.method} {request.url}")
    if request.is_json:
        logger.debug(f"Request JSON: {request.get_json()}")
    if request.form:
        logger.debug(f"Request Form: {dict(request.form)}")


def validate_required_fields(data: Dict, required_fields: list) -> None:
    """Validate required fields in request data"""
    missing_fields = []
    
    for field in required_fields:
        if field not in data or data[field] is None:
            missing_fields.append(field)
    
    if missing_fields:
        raise ValidationError(
            f"Missing required fields: {', '.join(missing_fields)}",
            {'missing_fields': missing_fields}
        )


def validate_file_type(filename: str, allowed_extensions: set) -> None:
    """Validate file type"""
    if not filename or '.' not in filename:
        raise ValidationError("Invalid filename")
    
    extension = filename.rsplit('.', 1)[1].lower()
    if extension not in allowed_extensions:
        raise ValidationError(
            f"Unsupported file type: {extension}",
            {'allowed_extensions': list(allowed_extensions)}
        )


def safe_path_join(base_path, *paths) -> str:
    """Safely join paths to prevent directory traversal"""
    from pathlib import Path
    
    try:
        # Resolve the base path
        base = Path(base_path).resolve()
        
        # Join additional paths
        result = base
        for path in paths:
            # Remove any leading slashes or dots to prevent traversal
            clean_path = str(path).lstrip('/\\.')
            result = result / clean_path
        
        # Ensure the result is still under the base path
        result = result.resolve()
        if not str(result).startswith(str(base)):
            raise ValidationError("Invalid path: directory traversal detected")
        
        return str(result)
    
    except Exception as e:
        raise ValidationError(f"Invalid path: {str(e)}")


def format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    size = float(size_bytes)
    
    while size >= 1024.0 and i < len(size_names) - 1:
        size /= 1024.0
        i += 1
    
    return f"{size:.1f} {size_names[i]}"
