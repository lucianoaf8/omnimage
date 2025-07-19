"""
Logging configuration for Omnimage
"""
import logging
import logging.handlers
from pathlib import Path
from datetime import datetime


def setup_logging(project_root: Path, log_level: str = "INFO"):
    """Setup application logging"""
    
    # Create logs directory
    logs_dir = project_root / "logs"
    logs_dir.mkdir(exist_ok=True)
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
    )
    
    simple_formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # Setup root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper()))
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(simple_formatter)
    root_logger.addHandler(console_handler)
    
    # File handler for all logs
    log_file = logs_dir / f"omnimage_{datetime.now().strftime('%Y%m%d')}.log"
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(detailed_formatter)
    root_logger.addHandler(file_handler)
    
    # Error file handler
    error_file = logs_dir / f"omnimage_errors_{datetime.now().strftime('%Y%m%d')}.log"
    error_handler = logging.handlers.RotatingFileHandler(
        error_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(detailed_formatter)
    root_logger.addHandler(error_handler)
    
    # Setup specific loggers
    setup_app_loggers()
    
    logging.info("Logging system initialized")
    return root_logger


def setup_app_loggers():
    """Setup application-specific loggers"""
    
    # Flask logger
    flask_logger = logging.getLogger('flask')
    flask_logger.setLevel(logging.INFO)
    
    # Werkzeug logger (Flask development server)
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.setLevel(logging.WARNING)
    
    # Application loggers
    app_logger = logging.getLogger('omnimage')
    app_logger.setLevel(logging.DEBUG)
    
    # Service loggers
    image_service_logger = logging.getLogger('omnimage.image_service')
    workflow_service_logger = logging.getLogger('omnimage.workflow_service')
    
    return {
        'flask': flask_logger,
        'werkzeug': werkzeug_logger,
        'app': app_logger,
        'image_service': image_service_logger,
        'workflow_service': workflow_service_logger
    }


def get_logger(name: str = 'omnimage'):
    """Get a logger instance"""
    return logging.getLogger(name)
