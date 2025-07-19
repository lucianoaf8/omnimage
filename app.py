# app.py - Omnimage Flask Web Interface (Refactored)
# This file now uses the proper backend structure instead of monolithic design

from pathlib import Path
from backend.app import create_app

# Create Flask app using the application factory pattern
app = create_app()

if __name__ == '__main__':
    # Ensure output directories exist
    project_root = Path(__file__).parent
    output_dir = project_root / "output"
    raw_dir = output_dir / "raw"
    processed_dir = output_dir / "processed"
    icons_dir = output_dir / "icons"
    logs_dir = project_root / "logs"
    
    for dir_path in [output_dir, raw_dir, processed_dir, icons_dir, logs_dir]:
        dir_path.mkdir(parents=True, exist_ok=True)
    
    print("🚀 Starting Omnimage server...")
    print("📁 Output directories initialized")
    print("🌐 Server running at http://localhost:5000")
    print("📊 API endpoints available at http://localhost:5000/api/")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
