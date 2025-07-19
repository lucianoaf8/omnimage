"""
Workflow management service for AI image generation
Extracted from monolithic app.py
"""
import json
from pathlib import Path
from typing import Dict, List

from ..core.config import Config


class WorkflowService:
    """Service for managing AI generation workflows"""
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self.config_dir = project_root / "config"
        self.prompts_dir = self.config_dir / "prompts"
        
        # Ensure directories exist
        self.config_dir.mkdir(exist_ok=True)
        self.prompts_dir.mkdir(exist_ok=True)
    
    def get_available_models(self) -> List[Dict]:
        """Get list of available models"""
        models = [
            {
                "id": "dalle3",
                "name": "DALL-E 3",
                "provider": "openai",
                "description": "OpenAI's latest image generation model"
            },
            {
                "id": "flux-dev",
                "name": "FLUX.1 [dev]",
                "provider": "together_ai",
                "description": "High-quality open-source model"
            },
            {
                "id": "flux-schnell",
                "name": "FLUX.1 [schnell]",
                "provider": "together_ai",
                "description": "Fast generation model"
            },
            {
                "id": "flux-pro",
                "name": "FLUX.1 [pro]",
                "provider": "fal_ai",
                "description": "Professional quality model"
            },
            {
                "id": "ideogram-v2",
                "name": "Ideogram v2",
                "provider": "replicate",
                "description": "Text-aware image generation"
            },
            {
                "id": "recraft-v3",
                "name": "Recraft v3",
                "provider": "replicate",
                "description": "Style-controllable generation"
            }
        ]
        return models
    
    def get_prompt_files(self) -> List[str]:
        """Get list of available prompt files"""
        if not self.prompts_dir.exists():
            return []
        
        prompt_files = []
        for file in self.prompts_dir.glob("*.txt"):
            prompt_files.append(file.name)
        
        return sorted(prompt_files)
    
    def get_prompts_from_file(self, filename: str) -> List[str]:
        """Get prompts from a specific prompt file"""
        file_path = self.prompts_dir / filename
        
        if not file_path.exists():
            return []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
            
            # Split by lines and filter out empty lines
            prompts = [line.strip() for line in content.split('\n') if line.strip()]
            return prompts
        except Exception as e:
            print(f"Error reading prompt file {filename}: {e}")
            return []
    
    def validate_workflow_config(self, config: Dict) -> Dict:
        """Validate workflow configuration"""
        errors = []
        
        # Check required fields
        required_fields = ['models', 'prompts', 'settings']
        for field in required_fields:
            if field not in config:
                errors.append(f"Missing required field: {field}")
        
        # Validate models
        if 'models' in config:
            if not isinstance(config['models'], list) or len(config['models']) == 0:
                errors.append("At least one model must be selected")
        
        # Validate prompts
        if 'prompts' in config:
            if not isinstance(config['prompts'], list) or len(config['prompts']) == 0:
                errors.append("At least one prompt must be provided")
        
        # Validate settings
        if 'settings' in config:
            settings = config['settings']
            if 'images_per_prompt' in settings:
                try:
                    count = int(settings['images_per_prompt'])
                    if count < 1 or count > 10:
                        errors.append("Images per prompt must be between 1 and 10")
                except ValueError:
                    errors.append("Images per prompt must be a valid number")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    def start_workflow(self, config: Dict) -> Dict:
        """Start a new generation workflow"""
        # Validate configuration
        validation = self.validate_workflow_config(config)
        if not validation['valid']:
            return {
                'success': False,
                'message': 'Invalid workflow configuration',
                'errors': validation['errors']
            }
        
        # TODO: Implement actual workflow execution
        # This would involve:
        # 1. Creating generation tasks for each model/prompt combination
        # 2. Queuing tasks for execution
        # 3. Managing progress tracking
        # 4. Handling API calls to different providers
        
        return {
            'success': True,
            'message': 'Workflow started successfully',
            'workflow_id': 'placeholder_id',
            'total_tasks': len(config['models']) * len(config['prompts'])
        }
