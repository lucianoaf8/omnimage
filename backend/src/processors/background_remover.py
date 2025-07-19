# src/processors/background_remover.py
"""
Background removal processor using rembg
"""

import logging
from pathlib import Path
from typing import Optional, List
from PIL import Image
import rembg

class BackgroundRemover:
    """Remove backgrounds from images using AI models"""
    
    def __init__(self, model_name: str = "u2net"):
        self.model_name = model_name
        self.logger = logging.getLogger("processor.background_remover")
        self._session = None
    
    @property
    def session(self):
        """Lazy load the rembg session"""
        if self._session is None:
            self.logger.info(f"Loading background removal model: {self.model_name}")
            self._session = rembg.new_session(self.model_name)
            self.logger.info("Background removal model loaded")
        return self._session
    
    def process_image(self, input_path: Path, output_path: Path) -> bool:
        """Remove background from a single image"""
        try:
            with Image.open(input_path) as img:
                # Convert to RGB if necessary
                if img.mode not in ('RGB', 'RGBA'):
                    img = img.convert('RGB')
                
                # Remove background
                output_img = rembg.remove(img, session=self.session)
                
                # Ensure output directory exists
                output_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Save as PNG to preserve transparency
                output_img.save(output_path, 'PNG', optimize=True)
                
            self.logger.info(f"Background removed: {input_path.name} -> {output_path.name}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to remove background from {input_path.name}: {e}")
            return False
    
    def process_batch(self, input_paths: List[Path], output_dir: Path) -> List[Path]:
        """Process multiple images, returning list of successful outputs"""
        
        successful_outputs = []
        
        for input_path in input_paths:
            # Generate output filename with _nobg suffix
            output_filename = f"{input_path.stem}_nobg.png"
            output_path = output_dir / output_filename
            
            if self.process_image(input_path, output_path):
                successful_outputs.append(output_path)
        
        self.logger.info(f"Background removal complete: {len(successful_outputs)}/{len(input_paths)} successful")
        return successful_outputs

# src/processors/ico_converter.py
"""
ICO file converter using Pillow
"""

import logging
from pathlib import Path
from typing import List, Optional, Tuple
from PIL import Image

class ICOConverter:
    """Convert images to ICO format with multiple sizes"""
    
    def __init__(self, ico_sizes: List[int] = None):
        self.ico_sizes = ico_sizes or [16, 32, 48, 64, 128, 256]
        self.logger = logging.getLogger("processor.ico_converter")
    
    def convert_image(self, input_path: Path, output_path: Path) -> bool:
        """Convert single image to ICO format"""
        try:
            with Image.open(input_path) as img:
                # Convert to RGBA for transparency support
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')
                
                # Create different sizes
                resized_images = []
                
                for size in self.ico_sizes:
                    # Resize maintaining aspect ratio
                    resized = img.resize((size, size), Image.Resampling.LANCZOS)
                    resized_images.append(resized)
                
                # Ensure output directory exists
                output_path.parent.mkdir(parents=True, exist_ok=True)
                
                # Save as ICO with multiple sizes
                img.save(
                    output_path, 
                    format='ICO', 
                    sizes=[(size, size) for size in self.ico_sizes],
                    append_images=resized_images[1:] if len(resized_images) > 1 else None
                )
                
            self.logger.info(f"ICO created: {input_path.name} -> {output_path.name}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to convert {input_path.name} to ICO: {e}")
            return False
    
    def convert_batch(self, input_paths: List[Path], output_dir: Path) -> List[Path]:
        """Convert multiple images to ICO format"""
        
        successful_outputs = []
        
        for input_path in input_paths:
            # Generate output filename
            output_filename = f"{input_path.stem}.ico"
            output_path = output_dir / output_filename
            
            if self.convert_image(input_path, output_path):
                successful_outputs.append(output_path)
        
        self.logger.info(f"ICO conversion complete: {len(successful_outputs)}/{len(input_paths)} successful")
        return successful_outputs
    
    def verify_ico(self, ico_path: Path) -> bool:
        """Verify ICO file is valid and report sizes"""
        try:
            with Image.open(ico_path) as img:
                # ICO files can contain multiple images
                sizes_found = []
                
                try:
                    # Try to get all sizes
                    for i in range(100):  # Arbitrary limit
                        img.seek(i)
                        sizes_found.append(img.size)
                except EOFError:
                    # Normal - reached end of ICO frames
                    pass
                
                self.logger.info(f"ICO verified: {ico_path.name} contains {len(sizes_found)} sizes: {sizes_found}")
                return True
                
        except Exception as e:
            self.logger.error(f"ICO verification failed for {ico_path.name}: {e}")
            return False
