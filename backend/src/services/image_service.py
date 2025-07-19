"""
Image processing and management service
Extracted from monolithic app.py
"""
import json
import logging
import shutil
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from ..utils.file_utils import get_file_size
from ..utils.naming import parse_filename
from ..utils.error_handling import NotFoundError, ProcessingError, ValidationError

logger = logging.getLogger('omnimage.image_service')


class ImageService:
    """Service for managing image operations"""
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.output_dir = project_root / "output"
        self.raw_dir = self.output_dir / "raw"
        self.processed_dir = self.output_dir / "processed"
        self.icons_dir = self.output_dir / "icons"
        self.logs_dir = project_root / "logs"
        
        # Ensure directories exist
        for dir_path in [self.output_dir, self.raw_dir, self.processed_dir, self.icons_dir, self.logs_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
    
    def get_all_images(self) -> List[Dict]:
        """Get all generated images with metadata"""
        images = []
        
        # Get images from raw directory
        if self.raw_dir.exists():
            for img_file in self.raw_dir.glob("*"):
                if img_file.is_file() and img_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp']:
                    metadata = parse_filename(img_file.name)
                    metadata.update({
                        'size_mb': get_file_size(img_file),
                        'path': str(img_file.relative_to(self.project_root)),
                        'type': 'raw'
                    })
                    images.append(metadata)
        
        # Get images from processed directory
        if self.processed_dir.exists():
            for img_file in self.processed_dir.glob("*"):
                if img_file.is_file() and img_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp']:
                    metadata = parse_filename(img_file.name)
                    metadata.update({
                        'size_mb': get_file_size(img_file),
                        'path': str(img_file.relative_to(self.project_root)),
                        'type': 'processed'
                    })
                    images.append(metadata)
        
        # Sort by created_at (newest first)
        images.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        return images
    
    def get_image_stats(self) -> Dict:
        """Get generation statistics"""
        stats = {
            'total_images': 0,
            'total_size_mb': 0,
            'by_provider': {},
            'by_model': {},
            'by_date': {}
        }
        
        images = self.get_all_images()
        
        for img in images:
            stats['total_images'] += 1
            stats['total_size_mb'] += img.get('size_mb', 0)
            
            # Count by provider
            provider = img.get('provider', 'unknown')
            stats['by_provider'][provider] = stats['by_provider'].get(provider, 0) + 1
            
            # Count by model
            model = img.get('model', 'unknown')
            stats['by_model'][model] = stats['by_model'].get(model, 0) + 1
            
            # Count by date
            created_at = img.get('created_at', 'unknown')
            if created_at != 'unknown':
                try:
                    date = created_at.split(' ')[0]  # Get just the date part
                    stats['by_date'][date] = stats['by_date'].get(date, 0) + 1
                except:
                    pass
        
        stats['total_size_mb'] = round(stats['total_size_mb'], 2)
        return stats
    
    def delete_image(self, filename: str) -> Dict:
        """Move image to trash folder instead of deleting"""
        # Create trash folder if it doesn't exist
        trash_dir = self.output_dir / "trash"
        trash_dir.mkdir(exist_ok=True)
        
        # Look for the file in raw and processed directories
        file_found = False
        original_path = None
        
        for directory in [self.raw_dir, self.processed_dir]:
            file_path = directory / filename
            if file_path.exists():
                original_path = file_path
                file_found = True
                break
        
        if not file_found:
            return {'success': False, 'message': f'File {filename} not found'}
        
        try:
            # Move to trash with timestamp
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            trash_filename = f"{timestamp}_{filename}"
            trash_path = trash_dir / trash_filename
            
            shutil.move(str(original_path), str(trash_path))
            
            return {
                'success': True, 
                'message': f'File {filename} moved to trash',
                'trash_location': str(trash_path.relative_to(self.project_root))
            }
        except Exception as e:
            return {'success': False, 'message': f'Error moving file: {str(e)}'}
    
    def archive_current_images(self) -> Dict:
        """Archive current images before starting new workflow"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        archive_dir = self.output_dir / "archive" / timestamp
        archive_dir.mkdir(parents=True, exist_ok=True)
        
        archived_count = 0
        
        try:
            # Archive raw images
            if self.raw_dir.exists():
                for img_file in self.raw_dir.glob("*"):
                    if img_file.is_file():
                        shutil.move(str(img_file), str(archive_dir / img_file.name))
                        archived_count += 1
            
            # Archive processed images
            if self.processed_dir.exists():
                for img_file in self.processed_dir.glob("*"):
                    if img_file.is_file():
                        shutil.move(str(img_file), str(archive_dir / img_file.name))
                        archived_count += 1
            
            return {
                'success': True,
                'message': f'Archived {archived_count} images to {archive_dir.name}',
                'archive_path': str(archive_dir.relative_to(self.project_root)),
                'archived_count': archived_count
            }
        except Exception as e:
            return {'success': False, 'message': f'Error archiving images: {str(e)}'}
