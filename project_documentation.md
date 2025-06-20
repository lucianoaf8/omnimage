# Omnimage - Comprehensive Project Documentation

## Table of Contents

1. [Project Overview](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#project-overview)
2. [Architecture &amp; Technology Stack](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#architecture--technology-stack)
3. [Project Structure](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#project-structure)
4. [Setup &amp; Installation](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#setup--installation)
5. [Development Guidelines](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#development-guidelines)
6. [API Documentation](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#api-documentation)
7. [Component Architecture](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#component-architecture)
8. [Feature Specifications](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#feature-specifications)
9. [Theme System](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#theme-system)
10. [Security Guidelines](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#security-guidelines)
11. [Performance Requirements](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#performance-requirements)
12. [Deployment](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#deployment)
13. [Testing Strategy](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#testing-strategy)
14. [Contributing Guidelines](https://claude.ai/chat/c680ce50-7051-4bf6-bd7f-6d3cb3208944#contributing-guidelines)

---

## Project Overview

### Vision Statement

Omnimage is a centralized, web-based image processing hub that provides professional-grade tools for transforming, processing, treating, enhancing, and improving digital images. Built as a modular platform, it serves as the foundation for integration with smaller specialized projects while maintaining enterprise-level performance and security standards.

### Key Objectives

* **Centralization** : Single platform for all image processing needs
* **Modularity** : Easy addition of new tools and features
* **Performance** : Handle large images and batch operations efficiently
* **Integration** : Seamless connection with external projects and services
* **User Experience** : Intuitive interface with professional workflow support

### Target Users

* **Graphic Designers** : Professional image editing and enhancement
* **Developers** : Integration platform for image processing services
* **Content Creators** : Batch processing and workflow automation
* **Businesses** : Centralized image management and processing

---

## Architecture & Technology Stack

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
├─────────────────────────────────────────────────────────────┤
│  UI Layer: Radix UI + Tailwind CSS + Framer Motion       │
├─────────────────────────────────────────────────────────────┤
│  State Management: Zustand + Immer                         │
├─────────────────────────────────────────────────────────────┤
│  Data Layer: TanStack Query + Axios                        │
├─────────────────────────────────────────────────────────────┤
│  Build System: Vite + TypeScript                           │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Flask Application                           │
├─────────────────────────────────────────────────────────────┤
│  API Layer: Flask-RESTful + Flask-CORS                    │
├─────────────────────────────────────────────────────────────┤
│  Processing: Celery + Redis Queue                          │
├─────────────────────────────────────────────────────────────┤
│  Image Processing: Pillow + OpenCV + scikit-image          │
├─────────────────────────────────────────────────────────────┤
│  Storage: File System + Cloud Storage Adapters             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend

| Category         | Technology       | Version | Purpose               |
| ---------------- | ---------------- | ------- | --------------------- |
| Framework        | React            | 18.x    | UI Framework          |
| Build Tool       | Vite             | 5.x     | Development & Build   |
| Language         | TypeScript       | 5.x     | Type Safety           |
| Styling          | Tailwind CSS     | 3.x     | Utility-first CSS     |
| UI Components    | Radix UI         | 1.x     | Accessible Primitives |
| Animation        | Framer Motion    | 11.x    | Smooth Animations     |
| State Management | Zustand          | 4.x     | Global State          |
| Data Fetching    | TanStack Query   | 5.x     | Server State          |
| HTTP Client      | Axios            | 1.x     | API Communication     |
| File Handling    | react-dropzone   | 14.x    | Drag & Drop           |
| Image Processing | react-image-crop | 11.x    | Client-side Cropping  |

#### Backend

| Category             | Technology   | Version | Purpose               |
| -------------------- | ------------ | ------- | --------------------- |
| Framework            | Flask        | 3.x     | Web Framework         |
| Task Queue           | Celery       | 5.x     | Background Processing |
| Message Broker       | Redis        | 7.x     | Queue & Caching       |
| Image Processing     | Pillow       | 10.x    | Core Image Operations |
| Computer Vision      | OpenCV       | 4.x     | Advanced Processing   |
| Scientific Computing | scikit-image | 0.22.x  | Image Analysis        |
| Math Operations      | NumPy        | 1.x     | Numerical Computing   |
| File Validation      | python-magic | 0.4.x   | MIME Type Detection   |

---

## Project Structure

### Complete Directory Layout

```
omnimage/
├── frontend/                           # React frontend application
│   ├── public/                        # Static assets
│   │   ├── favicon.ico
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/                           # Source code
│   │   ├── components/                # React components
│   │   │   ├── ui/                   # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Dialog.tsx
│   │   │   │   ├── Collapsible.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── index.ts
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── PanelLayout.tsx
│   │   │   │   ├── ResizeHandle.tsx
│   │   │   │   └── index.ts
│   │   │   ├── panels/               # Main panel components
│   │   │   │   ├── LeftPanel/
│   │   │   │   │   ├── ToolSection.tsx
│   │   │   │   │   ├── ToolCategory.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── MiddlePanel/
│   │   │   │   │   ├── ImageViewer.tsx
│   │   │   │   │   ├── ImageMetadata.tsx
│   │   │   │   │   ├── QuickTools.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── RightPanel/
│   │   │   │   │   ├── Gallery.tsx
│   │   │   │   │   ├── ImageGrid.tsx
│   │   │   │   │   ├── ImageCard.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   └── index.ts
│   │   │   └── tools/                # Processing tools
│   │   │       ├── transform/
│   │   │       │   ├── CropTool.tsx
│   │   │       │   ├── ResizeTool.tsx
│   │   │       │   ├── RotateTool.tsx
│   │   │       │   └── index.ts
│   │   │       ├── enhance/
│   │   │       │   ├── BrightnessTool.tsx
│   │   │       │   ├── ContrastTool.tsx
│   │   │       │   ├── SaturationTool.tsx
│   │   │       │   └── index.ts
│   │   │       ├── filters/
│   │   │       │   ├── BlurTool.tsx
│   │   │       │   ├── SharpenTool.tsx
│   │   │       │   ├── NoiseTool.tsx
│   │   │       │   └── index.ts
│   │   │       └── ai/
│   │   │           ├── BackgroundRemoval.tsx
│   │   │           ├── Upscaling.tsx
│   │   │           ├── StyleTransfer.tsx
│   │   │           └── index.ts
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useImageProcessing.ts
│   │   │   ├── useResizePanel.ts
│   │   │   ├── useFileUpload.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── index.ts
│   │   ├── stores/                    # Zustand state stores
│   │   │   ├── imageStore.ts         # Current image & processing state
│   │   │   ├── galleryStore.ts       # Gallery images & metadata
│   │   │   ├── uiStore.ts            # UI state & preferences
│   │   │   ├── settingsStore.ts      # App settings & configuration
│   │   │   ├── processingStore.ts    # Queue & progress tracking
│   │   │   └── index.ts
│   │   ├── services/                  # API & external services
│   │   │   ├── api.ts                # Main API client
│   │   │   ├── imageService.ts       # Image operations
│   │   │   ├── uploadService.ts      # File upload handling
│   │   │   ├── processingService.ts  # Processing operations
│   │   │   ├── websocketService.ts   # Real-time communication
│   │   │   └── index.ts
│   │   ├── types/                     # TypeScript definitions
│   │   │   ├── image.ts              # Image-related types
│   │   │   ├── processing.ts         # Processing-related types
│   │   │   ├── api.ts                # API response types
│   │   │   ├── ui.ts                 # UI component types
│   │   │   └── index.ts
│   │   ├── lib/                       # Utilities & configurations
│   │   │   ├── theme.ts              # Theme configuration
│   │   │   ├── utils.ts              # General utilities
│   │   │   ├── constants.ts          # App constants
│   │   │   ├── validators.ts         # Input validation
│   │   │   └── index.ts
│   │   ├── assets/                    # Static assets
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   ├── App.tsx                    # Main App component
│   │   ├── main.tsx                   # Application entry point
│   │   └── index.css                  # Global styles
│   ├── .env.example                   # Environment variables template
│   ├── .gitignore                     # Git ignore rules
│   ├── eslint.config.js              # ESLint configuration
│   ├── prettier.config.js            # Prettier configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── vite.config.ts                # Vite configuration
│   └── package.json                   # Node.js dependencies
├── backend/                           # Flask backend application
│   ├── app/                          # Application package
│   │   ├── __init__.py               # Flask app factory
│   │   ├── config.py                 # Configuration management
│   │   ├── routes/                   # API route definitions
│   │   │   ├── __init__.py
│   │   │   ├── images.py             # Image CRUD operations
│   │   │   ├── processing.py         # Image processing endpoints
│   │   │   ├── tools.py              # Tool-specific endpoints
│   │   │   ├── upload.py             # File upload handling
│   │   │   ├── metadata.py           # Metadata operations
│   │   │   └── system.py             # System status & health
│   │   ├── services/                 # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── image_processor.py    # Core image processing
│   │   │   ├── file_manager.py       # File system operations
│   │   │   ├── metadata_extractor.py # EXIF & metadata handling
│   │   │   ├── thumbnail_generator.py # Thumbnail creation
│   │   │   ├── queue_manager.py      # Processing queue management
│   │   │   └── cache_manager.py      # Caching operations
│   │   ├── models/                   # Data models
│   │   │   ├── __init__.py
│   │   │   ├── image_model.py        # Image data model
│   │   │   ├── processing_job.py     # Processing job model
│   │   │   └── user_session.py       # Session management
│   │   ├── utils/                    # Helper functions
│   │   │   ├── __init__.py
│   │   │   ├── validators.py         # Input validation
│   │   │   ├── exceptions.py         # Custom exceptions
│   │   │   ├── security.py           # Security utilities
│   │   │   └── image_utils.py        # Image processing utilities
│   │   └── tasks/                    # Celery tasks
│   │       ├── __init__.py
│   │       ├── image_processing.py   # Processing tasks
│   │       ├── thumbnail_generation.py # Thumbnail tasks
│   │       └── cleanup.py            # Maintenance tasks
│   ├── uploads/                      # User uploaded files
│   │   ├── images/                   # Original uploaded images
│   │   └── temp/                     # Temporary processing files
│   ├── processed/                    # Processed images cache
│   │   ├── resized/
│   │   ├── filtered/
│   │   └── enhanced/
│   ├── thumbnails/                   # Generated thumbnails
│   │   ├── small/                    # 150x150 thumbnails
│   │   ├── medium/                   # 300x300 thumbnails
│   │   └── large/                    # 600x600 thumbnails
│   ├── logs/                         # Application logs
│   ├── tests/                        # Backend tests
│   │   ├── test_routes/
│   │   ├── test_services/
│   │   └── test_utils/
│   ├── .env.example                  # Environment variables template
│   ├── requirements.txt              # Python dependencies
│   ├── celery_config.py             # Celery configuration
│   ├── redis.conf                   # Redis configuration
│   └── run.py                        # Application entry point
├── docs/                             # Documentation
│   ├── api/                         # API documentation
│   ├── deployment/                  # Deployment guides
│   ├── development/                 # Development setup
│   └── user/                        # User manuals
├── docker/                          # Docker configurations
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── .github/                         # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── security.yml
├── README.md                        # Project overview
├── CONTRIBUTING.md                  # Contributing guidelines
├── LICENSE                          # License file
└── .gitignore                       # Git ignore rules
```

---

## Setup & Installation

### Prerequisites

* **Node.js** : Version 18.x or higher
* **Python** : Version 3.9 or higher
* **Redis** : Version 7.x or higher (for background processing)
* **Git** : Latest version

### Environment Setup

#### 1. Clone Repository

```bash
git clone <repository-url>
cd omnimage
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

**Frontend Environment Variables:**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000

# Upload Configuration
VITE_MAX_FILE_SIZE=50485760  # 50MB
VITE_ALLOWED_TYPES=image/jpeg,image/png,image/webp,image/tiff

# Feature Flags
VITE_ENABLE_AI_TOOLS=true
VITE_ENABLE_CLOUD_STORAGE=false
VITE_ENABLE_BATCH_PROCESSING=true

# Development
VITE_DEBUG_MODE=true
```

#### 3. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
cp .env.example .env
```

**Backend Environment Variables:**

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Database Configuration
DATABASE_URL=sqlite:///omnimage.db

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# File Storage
UPLOAD_FOLDER=uploads
PROCESSED_FOLDER=processed
THUMBNAIL_FOLDER=thumbnails
MAX_FILE_SIZE=52428800  # 50MB

# Security
CORS_ORIGINS=http://localhost:5173
JWT_SECRET_KEY=your-jwt-secret-here

# Processing Configuration
MAX_CONCURRENT_JOBS=4
THUMBNAIL_SIZES=150,300,600
CACHE_TIMEOUT=3600

# AI Services (Optional)
OPENAI_API_KEY=your-openai-key
REPLICATE_API_TOKEN=your-replicate-token
```

#### 4. Redis Setup

**Windows (using WSL or Docker):**

```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or using WSL
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

**macOS:**

```bash
brew install redis
brew services start redis
```

**Linux:**

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### Development Server Setup

#### 1. Start Backend Services

```bash
# Terminal 1: Start Redis (if not running as service)
redis-server

# Terminal 2: Start Flask application
cd backend
python run.py

# Terminal 3: Start Celery worker
cd backend
celery -A app.celery worker --loglevel=info

# Terminal 4 (Optional): Start Celery monitoring
cd backend
celery -A app.celery flower
```

#### 2. Start Frontend Development Server

```bash
# Terminal 5: Start React development server
cd frontend
npm run dev
```

### Verification

#### Backend Health Check

```bash
curl http://localhost:5000/api/system/status
```

Expected Response:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "redis": "connected",
    "celery": "running",
    "storage": "available"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Frontend Access

* Open browser to `http://localhost:5173`
* Verify three-panel layout renders correctly
* Test panel resizing functionality
* Confirm theme toggle works

---

## Development Guidelines

### Code Standards

#### TypeScript/JavaScript

```typescript
// Use strict type definitions
interface ImageMetadata {
  id: string;
  filename: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  createdAt: Date;
  modifiedAt: Date;
}

// Prefer functional components with hooks
const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  onImageChange,
  className
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Component logic here
  
  return (
    <div className={cn("image-viewer", className)}>
      {/* Component JSX */}
    </div>
  );
};
```

#### Python Code Style

```python
from typing import Dict, List, Optional, Union
from dataclasses import dataclass
from pathlib import Path

@dataclass
class ProcessingResult:
    """Result of an image processing operation."""
    success: bool
    image_path: Optional[Path] = None
    error_message: Optional[str] = None
    processing_time: float = 0.0
    metadata: Dict[str, Union[str, int, float]] = None

class ImageProcessor:
    """Core image processing service."""
  
    def __init__(self, config: Dict[str, Any]) -> None:
        self.config = config
        self.logger = logging.getLogger(__name__)
  
    def process_image(
        self, 
        image_path: Path, 
        operations: List[str]
    ) -> ProcessingResult:
        """Process image with specified operations."""
        try:
            # Processing logic here
            return ProcessingResult(success=True, image_path=result_path)
        except Exception as e:
            self.logger.error(f"Processing failed: {e}")
            return ProcessingResult(success=False, error_message=str(e))
```

### Component Architecture

#### Component Hierarchy

```
App
├── ThemeProvider
├── QueryClient
├── PanelLayout
│   ├── Header
│   │   ├── Logo
│   │   ├── StatusIndicators
│   │   └── ThemeToggle
│   ├── MainContent
│   │   ├── LeftPanel
│   │   │   ├── ToolSection (Transform)
│   │   │   ├── ToolSection (Enhance)
│   │   │   ├── ToolSection (Filters)
│   │   │   └── ToolSection (AI)
│   │   ├── MiddlePanel
│   │   │   ├── ImageViewer
│   │   │   ├── QuickTools
│   │   │   └── MetadataPanel
│   │   └── RightPanel
│   │       ├── GalleryHeader
│   │       ├── ImageGrid
│   │       └── GalleryFooter
│   └── Footer
│       ├── ProgressIndicator
│       ├── SystemStatus
│       └── QuickActions
```

#### State Management Pattern

```typescript
// Zustand store example
interface ImageStore {
  // State
  currentImage: ImageMetadata | null;
  isProcessing: boolean;
  processingQueue: ProcessingJob[];
  history: HistoryEntry[];
  
  // Actions
  setCurrentImage: (image: ImageMetadata) => void;
  addToQueue: (job: ProcessingJob) => void;
  processImage: (operation: string, params: any) => Promise<void>;
  undo: () => void;
  redo: () => void;
}

const useImageStore = create<ImageStore>((set, get) => ({
  currentImage: null,
  isProcessing: false,
  processingQueue: [],
  history: [],
  
  setCurrentImage: (image) => set({ currentImage: image }),
  
  addToQueue: (job) => set((state) => ({
    processingQueue: [...state.processingQueue, job]
  })),
  
  processImage: async (operation, params) => {
    set({ isProcessing: true });
    try {
      const result = await imageService.processImage(
        get().currentImage?.id,
        operation,
        params
      );
      // Handle result
    } finally {
      set({ isProcessing: false });
    }
  },
  
  undo: () => {
    // Undo logic
  },
  
  redo: () => {
    // Redo logic
  }
}));
```

### API Design Patterns

#### RESTful Endpoints

```
GET    /api/images                    # List images with pagination
POST   /api/images                    # Upload new image
GET    /api/images/:id                # Get specific image
PUT    /api/images/:id                # Update image metadata
DELETE /api/images/:id                # Delete image

POST   /api/images/:id/process        # Start processing operation
GET    /api/images/:id/process/:jobId # Get processing status
POST   /api/images/:id/duplicate      # Duplicate image

GET    /api/processing/queue          # Get processing queue status
POST   /api/processing/batch          # Start batch operation
DELETE /api/processing/:jobId         # Cancel processing job

GET    /api/tools                     # List available tools
GET    /api/tools/:toolId/config      # Get tool configuration
POST   /api/tools/:toolId/preview     # Generate tool preview
```

#### Error Handling

```python
from flask import jsonify
from app.utils.exceptions import ValidationError, ProcessingError

@app.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify({
        "error": "validation_error",
        "message": str(error),
        "details": error.details if hasattr(error, 'details') else None
    }), 400

@app.errorhandler(ProcessingError)
def handle_processing_error(error):
    return jsonify({
        "error": "processing_error",
        "message": str(error),
        "operation": error.operation if hasattr(error, 'operation') else None
    }), 422
```

---

## API Documentation

### Authentication

Currently using session-based authentication. JWT implementation planned for production.

### Image Management

#### Upload Image

```http
POST /api/images
Content-Type: multipart/form-data

file: <image-file>
metadata: {
  "title": "string",
  "description": "string",
  "tags": ["string"]
}
```

**Response:**

```json
{
  "success": true,
  "image": {
    "id": "uuid",
    "filename": "original_filename.jpg",
    "url": "/api/images/uuid/download",
    "thumbnail_url": "/api/images/uuid/thumbnail",
    "metadata": {
      "size": 1048576,
      "dimensions": {"width": 1920, "height": 1080},
      "format": "JPEG",
      "color_mode": "RGB",
      "has_exif": true
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Process Image

```http
POST /api/images/:id/process
Content-Type: application/json

{
  "operation": "resize",
  "parameters": {
    "width": 800,
    "height": 600,
    "maintain_aspect": true,
    "quality": 90
  },
  "save_original": true
}
```

**Response:**

```json
{
  "success": true,
  "job_id": "uuid",
  "status": "queued",
  "estimated_duration": 5.2
}
```

### Processing Operations

#### Available Operations

| Operation         | Parameters                              | Description                     |
| ----------------- | --------------------------------------- | ------------------------------- |
| resize            | width, height, maintain_aspect, quality | Resize image                    |
| crop              | x, y, width, height                     | Crop image to specified area    |
| rotate            | angle, expand                           | Rotate image by degrees         |
| flip              | direction                               | Flip horizontally or vertically |
| brightness        | factor                                  | Adjust brightness (-100 to 100) |
| contrast          | factor                                  | Adjust contrast (-100 to 100)   |
| saturation        | factor                                  | Adjust saturation (-100 to 100) |
| blur              | radius                                  | Apply Gaussian blur             |
| sharpen           | strength                                | Apply sharpening filter         |
| remove_background | model                                   | AI background removal           |

#### Batch Processing

```http
POST /api/processing/batch
Content-Type: application/json

{
  "image_ids": ["uuid1", "uuid2", "uuid3"],
  "operations": [
    {
      "operation": "resize",
      "parameters": {"width": 800, "height": 600}
    },
    {
      "operation": "brightness",
      "parameters": {"factor": 10}
    }
  ],
  "output_format": "JPEG",
  "quality": 90
}
```

### WebSocket Events

#### Real-time Updates

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:5000/ws');

// Listen for processing updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'processing_started':
      // Handle processing start
      break;
    case 'processing_progress':
      // Update progress indicator
      break;
    case 'processing_completed':
      // Handle completion
      break;
    case 'processing_error':
      // Handle error
      break;
  }
};
```

---

## Component Architecture

### UI Component Library

#### Base Components

```typescript
// Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// Input Component
interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}

// Card Component
interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}
```

#### Layout Components

```typescript
// Panel Layout
interface PanelLayoutProps {
  leftPanel: React.ReactNode;
  middlePanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftPanelWidth?: number;
  rightPanelWidth?: number;
  onPanelResize?: (panel: 'left' | 'right', width: number) => void;
}

// Collapsible Section
interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}
```

### Tool Component Pattern

```typescript
// Base Tool Interface
interface ToolProps {
  image: ImageMetadata;
  onApply: (operation: string, parameters: any) => void;
  onPreview: (parameters: any) => void;
  onReset: () => void;
  isProcessing?: boolean;
}

// Example Tool Implementation
const ResizeTool: React.FC<ToolProps> = ({
  image,
  onApply,
  onPreview,
  isProcessing
}) => {
  const [width, setWidth] = useState(image.dimensions.width);
  const [height, setHeight] = useState(image.dimensions.height);
  const [maintainAspect, setMaintainAspect] = useState(true);

  const handleApply = () => {
    onApply('resize', {
      width,
      height,
      maintain_aspect: maintainAspect
    });
  };

  return (
    <div className="tool-panel">
      <h3 className="tool-title">Resize Image</h3>
    
      <div className="tool-controls">
        <Input
          type="number"
          label="Width"
          value={width}
          onChange={setWidth}
        />
        <Input
          type="number"
          label="Height"
          value={height}
          onChange={setHeight}
        />
        <Checkbox
          label="Maintain Aspect Ratio"
          checked={maintainAspect}
          onChange={setMaintainAspect}
        />
      </div>
    
      <div className="tool-actions">
        <Button
          variant="outline"
          onClick={() => onPreview({ width, height, maintain_aspect: maintainAspect })}
        >
          Preview
        </Button>
        <Button
          variant="primary"
          onClick={handleApply}
          loading={isProcessing}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
```

---

## Feature Specifications

### Core Features

#### 1. Image Viewer

**Requirements:**

* Support for JPEG, PNG, WebP, TIFF formats
* Zoom levels: Fit to screen, 25%, 50%, 100%, 200%, 400%
* Pan and zoom with mouse wheel and drag
* Keyboard shortcuts for navigation
* Fullscreen mode support

**Technical Implementation:**

* Canvas-based rendering for performance
* Virtual viewport for memory efficiency
* Smooth animations with requestAnimationFrame
* Touch gesture support for mobile devices

#### 2. Gallery System

**Requirements:**

* Grid view with configurable thumbnail sizes
* List view with detailed metadata
* Infinite scrolling for large collections
* Advanced filtering and sorting options
* Batch selection with keyboard modifiers

**Performance Targets:**

* Handle 10,000+ images without performance degradation
* Thumbnail loading under 200ms
* Smooth scrolling at 60fps
* Memory usage under 500MB for large galleries

#### 3. Processing Tools

##### Transform Tools

| Tool   | Function                 | Parameters                         | Output Quality          |
| ------ | ------------------------ | ---------------------------------- | ----------------------- |
| Crop   | Extract portion of image | x, y, width, height, aspect ratio  | Lossless                |
| Resize | Change image dimensions  | width, height, algorithm, quality  | High quality resampling |
| Rotate | Rotate by degrees        | angle (-360 to 360), expand canvas | Bicubic interpolation   |
| Flip   | Mirror image             | direction (horizontal/vertical)    | Lossless                |

##### Enhancement Tools

| Tool       | Function           | Range        | Algorithm         |
| ---------- | ------------------ | ------------ | ----------------- |
| Brightness | Adjust luminance   | -100 to +100 | Linear adjustment |
| Contrast   | Adjust tonal range | -100 to +100 | Sigmoid curve     |
| Saturation | Color intensity    | -100 to +100 | HSV color space   |
| Gamma      | Gamma correction   | 0.1 to 3.0   | Power law         |

##### Filter Tools

| Tool            | Function           | Parameters                | Performance       |
| --------------- | ------------------ | ------------------------- | ----------------- |
| Blur            | Gaussian blur      | radius (0-50px)           | GPU accelerated   |
| Sharpen         | Unsharp mask       | strength (0-200%)         | Optimized kernel  |
| Noise Reduction | Remove image noise | strength, preserve detail | Edge-preserving   |
| Edge Detection  | Highlight edges    | algorithm, threshold      | Real-time preview |

#### 4. AI-Powered Tools

**Background Removal:**

* Multiple AI models for different image types
* Edge refinement for clean cutouts
* Feathering options for natural blending
* Batch processing support

**Upscaling:**

* AI-based super-resolution
* 2x, 4x, and 8x scaling options
* Preservation of image details
* Format-specific optimizations

**Style Transfer:**

* Artistic style application
* Custom style training support
* Blend strength controls
* Preview generation

### Advanced Features

#### 1. Batch Processing

**Workflow Designer:**

* Visual pipeline builder
* Operation chaining with preview
* Conditional processing based on image properties
* Template saving and sharing

**Queue Management:**

* Priority-based processing
* Pause/resume capabilities
* Progress tracking with ETA
* Error handling and retry logic

#### 2. Cloud Integration

**Storage Providers:**

* AWS S3 integration
* Google Cloud Storage
* Dropbox synchronization
* OneDrive support

**Collaboration Features:**

* Shared workspaces
* Version control for images
* Comment and annotation system
* Real-time collaborative editing

#### 3. Plugin System

**Architecture:**

* JavaScript-based plugin API
* Sandboxed execution environment
* Plugin marketplace integration
* Hot-loading for development

**Plugin Types:**

* Image processing algorithms
* Import/export formats
* Cloud service integrations
* UI components and themes

---

## Theme System

### Design Token Architecture

```typescript
// Theme configuration structure
interface ThemeConfig {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    semantic: {
      success: ColorScale;
      warning: ColorScale;
      error: ColorScale;
      info: ColorScale;
    };
  };
  typography: {
    fontFamily: {
      sans: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, string>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  animation: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
}

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}
```

### Theme Implementation

```typescript
// lib/theme.ts
export const lightTheme: ThemeConfig = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    // ... more color scales
  },
  // ... typography, spacing, etc.
};

export const darkTheme: ThemeConfig = {
  // Dark theme configuration
};

// Theme provider implementation
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  theme?: 'light' | 'dark';
}> = ({ children, theme = 'light' }) => {
  const themeConfig = theme === 'light' ? lightTheme : darkTheme;
  
  useEffect(() => {
    // Apply CSS custom properties
    const root = document.documentElement;
    Object.entries(flattenTheme(themeConfig)).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [themeConfig]);

  return (
    <ThemeContext.Provider value={{ theme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Tailwind Integration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          // ... all color scales
        },
        // Use CSS custom properties for dynamic theming
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn var(--animation-duration-normal) var(--animation-easing-ease-out)',
        'slide-up': 'slideUp var(--animation-duration-normal) var(--animation-easing-ease-out)',
        'scale-in': 'scaleIn var(--animation-duration-fast) var(--animation-easing-ease-out)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Component Theming

```tsx
// Example themed component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:pointer-events-none disabled:opacity-50',
        
          // Variant styles
          {
            'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
            'bg-secondary-500 text-white hover:bg-secondary-600': variant === 'secondary',
            'border border-primary-500 text-primary-500 hover:bg-primary-50': variant === 'outline',
            'text-primary-500 hover:bg-primary-50': variant === 'ghost',
          },
        
          // Size styles
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
        
          className
        )}
        {...props}
      />
    );
  }
);
```

---

## Security Guidelines

### Input Validation

#### File Upload Security

```python
# Backend validation
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'tiff', 'bmp'}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

def validate_image_file(file):
    """Comprehensive file validation."""
    # Check file extension
    if not allowed_file(file.filename):
        raise ValidationError("File type not allowed")
  
    # Check file size
    if len(file.read()) > MAX_FILE_SIZE:
        raise ValidationError("File too large")
    file.seek(0)  # Reset file pointer
  
    # Check MIME type using python-magic
    file_type = magic.from_buffer(file.read(1024), mime=True)
    if not file_type.startswith('image/'):
        raise ValidationError("Invalid file type")
    file.seek(0)
  
    # Validate image integrity
    try:
        with Image.open(file) as img:
            img.verify()
    except Exception:
        raise ValidationError("Corrupted image file")
  
    return True
```

#### API Parameter Validation

```python
from marshmallow import Schema, fields, validate

class ImageProcessingSchema(Schema):
    operation = fields.Str(required=True, validate=validate.OneOf([
        'resize', 'crop', 'rotate', 'flip', 'brightness', 'contrast'
    ]))
    parameters = fields.Dict(required=True)
  
class ResizeParametersSchema(Schema):
    width = fields.Int(required=True, validate=validate.Range(min=1, max=10000))
    height = fields.Int(required=True, validate=validate.Range(min=1, max=10000))
    maintain_aspect = fields.Bool(missing=True)
    quality = fields.Int(validate=validate.Range(min=1, max=100), missing=90)

@app.route('/api/images/<id>/process', methods=['POST'])
def process_image(id):
    # Validate main schema
    schema = ImageProcessingSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
  
    # Validate operation-specific parameters
    if data['operation'] == 'resize':
        param_schema = ResizeParametersSchema()
        try:
            params = param_schema.load(data['parameters'])
        except ValidationError as err:
            return jsonify({'errors': err.messages}), 400
```

### Authentication & Authorization

#### JWT Implementation

```python
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
jwt = JWTManager(app)

@app.route('/api/auth/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
  
    # Validate credentials
    if not validate_user(username, password):
        return jsonify({'error': 'Invalid credentials'}), 401
  
    # Create access token
    access_token = create_access_token(
        identity=username,
        expires_delta=timedelta(hours=24)
    )
  
    return jsonify({'access_token': access_token})

@app.route('/api/images', methods=['GET'])
@jwt_required()
def get_user_images():
    current_user = get_jwt_identity()
    # Return user's images
```

#### Rate Limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per hour"]
)

@app.route('/api/images/upload', methods=['POST'])
@limiter.limit("10 per minute")
@jwt_required()
def upload_image():
    # Upload logic
```

### Data Protection

#### Secure File Handling

```python
import os
import uuid
from werkzeug.utils import secure_filename

def save_uploaded_file(file, user_id):
    """Securely save uploaded file with unique name."""
    # Generate unique filename
    file_id = str(uuid.uuid4())
    extension = os.path.splitext(secure_filename(file.filename))[1]
    filename = f"{file_id}{extension}"
  
    # Create user-specific directory
    user_dir = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id))
    os.makedirs(user_dir, exist_ok=True)
  
    # Save file with restricted permissions
    filepath = os.path.join(user_dir, filename)
    file.save(filepath)
    os.chmod(filepath, 0o644)  # Read-only for group/others
  
    return filepath
```

#### Environment Variable Security

```python
# Use environment variables for sensitive configuration
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-change-in-production'
    DATABASE_URL = os.environ.get('DATABASE_URL')
    REDIS_URL = os.environ.get('REDIS_URL')
  
    # Validate required environment variables
    @classmethod
    def validate_config(cls):
        required_vars = ['SECRET_KEY', 'JWT_SECRET_KEY']
        missing_vars = [var for var in required_vars if not getattr(cls, var)]
        if missing_vars:
            raise RuntimeError(f"Missing required environment variables: {missing_vars}")
```

### Frontend Security

#### Content Security Policy

```typescript
// Add CSP headers in development and production
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'"], // Remove unsafe-inline in production
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", "data:", "blob:"],
  connectSrc: ["'self'", process.env.VITE_API_BASE_URL],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"],
};
```

#### Input Sanitization

```typescript
// Client-side validation and sanitization
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: []
  });
};

export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  return true;
};
```

---

## Performance Requirements

### Frontend Performance Targets

#### Load Time Metrics

| Metric                   | Target  | Measurement          |
| ------------------------ | ------- | -------------------- |
| First Contentful Paint   | < 1.5s  | Lighthouse           |
| Largest Contentful Paint | < 2.5s  | Lighthouse           |
| Time to Interactive      | < 3.0s  | Lighthouse           |
| Cumulative Layout Shift  | < 0.1   | Lighthouse           |
| First Input Delay        | < 100ms | Real User Monitoring |

#### Runtime Performance

| Feature           | Target                 | Measurement     |
| ----------------- | ---------------------- | --------------- |
| Panel Resizing    | 60 FPS                 | Performance API |
| Image Zoom/Pan    | 60 FPS                 | Performance API |
| Gallery Scrolling | < 16ms frame time      | Performance API |
| Tool Preview      | < 500ms                | Processing time |
| Batch Selection   | < 100ms for 1000 items | Execution time  |

### Backend Performance Targets

#### API Response Times

| Endpoint                     | Target  | Load Conditions   |
| ---------------------------- | ------- | ----------------- |
| GET /api/images              | < 200ms | 1000 images       |
| POST /api/images/upload      | < 2s    | 10MB file         |
| POST /api/images/:id/process | < 100ms | Queue submission  |
| GET /api/processing/status   | < 50ms  | Real-time polling |

#### Processing Performance

| Operation            | Target          | Image Size  |
| -------------------- | --------------- | ----------- |
| Thumbnail Generation | < 500ms         | 4K image    |
| Resize Operation     | < 1s            | 4K → 1080p |
| Filter Application   | < 2s            | 4K image    |
| Background Removal   | < 10s           | 4K image    |
| Batch Processing     | 5 images/minute | 4K images   |

### Optimization Strategies

#### Frontend Optimizations

```typescript
// Code splitting by route and feature
const ImageViewer = lazy(() => import('./components/ImageViewer'));
const ToolPanel = lazy(() => import('./components/ToolPanel'));

// Memoization for expensive computations
const MemoizedImageGrid = React.memo(ImageGrid, (prevProps, nextProps) => {
  return (
    prevProps.images.length === nextProps.images.length &&
    prevProps.selectedIds === nextProps.selectedIds
  );
});

// Virtual scrolling for large lists
const VirtualizedGallery = () => {
  const { height, width } = useWindowSize();
  
  return (
    <FixedSizeGrid
      height={height}
      width={width}
      columnCount={Math.floor(width / ITEM_WIDTH)}
      columnWidth={ITEM_WIDTH}
      rowCount={Math.ceil(images.length / Math.floor(width / ITEM_WIDTH))}
      rowHeight={ITEM_HEIGHT}
      itemData={images}
    >
      {ImageGridItem}
    </FixedSizeGrid>
  );
};
```

#### Backend Optimizations

```python
# Async processing with Celery
@celery.task(bind=True)
def process_image_async(self, image_id, operation, parameters):
    try:
        # Update task progress
        self.update_state(
            state='PROGRESS',
            meta={'current': 0, 'total': 100, 'status': 'Starting...'}
        )
      
        # Process image
        result = image_processor.process(image_id, operation, parameters)
      
        return {'result': result, 'status': 'Complete'}
    except Exception as exc:
        self.update_state(
            state='FAILURE',
            meta={'error': str(exc)}
        )
        raise

# Redis caching for frequently accessed data
@app.route('/api/images/<id>/metadata')
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_image_metadata(id):
    metadata = extract_image_metadata(id)
    return jsonify(metadata)

# Database query optimization
def get_user_images(user_id, page=1, per_page=20):
    return Image.query.filter_by(user_id=user_id)\
        .options(load_only('id', 'filename', 'thumbnail_url', 'created_at'))\
        .order_by(Image.created_at.desc())\
        .paginate(page=page, per_page=per_page)
```

### Memory Management

#### Frontend Memory Optimization

```typescript
// Image cleanup and garbage collection
export const useImageCleanup = () => {
  const loadedImages = useRef<Map<string, HTMLImageElement>>(new Map());
  const maxCacheSize = 50; // Maximum images to keep in memory
  
  const loadImage = useCallback((url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.current.has(url)) {
        resolve(loadedImages.current.get(url)!);
        return;
      }
    
      const img = new Image();
      img.onload = () => {
        // Implement LRU cache
        if (loadedImages.current.size >= maxCacheSize) {
          const firstKey = loadedImages.current.keys().next().value;
          loadedImages.current.delete(firstKey);
        }
      
        loadedImages.current.set(url, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }, []);
  
  const clearCache = useCallback(() => {
    loadedImages.current.clear();
  }, []);
  
  return { loadImage, clearCache };
};
```

#### Backend Memory Management

```python
# Streaming file uploads for large files
@app.route('/api/images/upload', methods=['POST'])
def upload_large_image():
    def save_stream(stream, filename):
        chunk_size = 1024 * 1024  # 1MB chunks
        with open(filename, 'wb') as f:
            while True:
                chunk = stream.read(chunk_size)
                if not chunk:
                    break
                f.write(chunk)
  
    file = request.files['image']
    filename = secure_filename(file.filename)
    save_stream(file.stream, filename)

# Memory-efficient image processing
def process_large_image(image_path, operation, params):
    # Process image in tiles for very large images
    with Image.open(image_path) as img:
        if img.size[0] * img.size[1] > 50_000_000:  # 50MP threshold
            return process_image_tiled(img, operation, params)
        else:
            return process_image_direct(img, operation, params)
```

---

## Deployment

### Production Environment Setup

#### Docker Configuration

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Dockerfile.backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmagic1 \
    libmagic-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
USER app

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "run:app"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:5000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    depends_on:
      - redis
      - postgres
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/omnimage
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./uploads:/app/uploads
      - ./processed:/app/processed

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=omnimage
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    command: celery -A app.celery worker --loglevel=info
    depends_on:
      - redis
      - postgres
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/omnimage
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./uploads:/app/uploads
      - ./processed:/app/processed

volumes:
  redis_data:
  postgres_data:
```

### Cloud Deployment

#### AWS Deployment

```yaml
# aws-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: omnimage-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: omnimage-frontend
  template:
    metadata:
      labels:
        app: omnimage-frontend
    spec:
      containers:
      - name: frontend
        image: omnimage/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: omnimage-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: omnimage-backend
  template:
    metadata:
      labels:
        app: omnimage-backend
    spec:
      containers:
      - name: backend
        image: omnimage/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: omnimage-secrets
              key: database-url
        - name: REDIS_URL
          value: "redis://redis-service:6379/0"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

#### Environment-Specific Configuration

```bash
# Production environment variables
export FLASK_ENV=production
export DATABASE_URL=postgresql://user:pass@db.example.com:5432/omnimage
export REDIS_URL=redis://cache.example.com:6379/0
export AWS_S3_BUCKET=omnimage-storage
export CDN_URL=https://cdn.example.com
export JWT_SECRET_KEY=your-production-jwt-secret
export ENCRYPTION_KEY=your-encryption-key

# SSL and security settings
export SSL_DISABLE=False
export SECURE_COOKIES=True
export SESSION_COOKIE_SECURE=True
export PREFERRED_URL_SCHEME=https

# Performance settings
export WEB_CONCURRENCY=4
export MAX_WORKERS=8
export WORKER_TIMEOUT=120
```

### Monitoring and Logging

#### Application Monitoring

```python
# backend/monitoring.py
import logging
import time
from functools import wraps
from flask import request, g
import psutil
import redis

# Performance monitoring decorator
def monitor_performance(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
      
        try:
            result = f(*args, **kwargs)
            status = 'success'
        except Exception as e:
            result = {'error': str(e)}
            status = 'error'
            raise
        finally:
            duration = time.time() - start_time
          
            # Log performance metrics
            logger.info(f"Performance: {request.endpoint} - {duration:.3f}s - {status}")
          
            # Send metrics to monitoring service
            send_metric(f"{request.endpoint}.duration", duration)
            send_metric(f"{request.endpoint}.status.{status}", 1)
      
        return result
    return decorated_function

# Health check endpoint
@app.route('/api/health')
def health_check():
    health_status = {
        'status': 'healthy',
        'timestamp': time.time(),
        'version': app.config.get('VERSION', '1.0.0'),
        'services': {}
    }
  
    # Check database connection
    try:
        db.session.execute('SELECT 1')
        health_status['services']['database'] = 'healthy'
    except Exception:
        health_status['services']['database'] = 'unhealthy'
        health_status['status'] = 'degraded'
  
    # Check Redis connection
    try:
        redis_client = redis.from_url(app.config['REDIS_URL'])
        redis_client.ping()
        health_status['services']['redis'] = 'healthy'
    except Exception:
        health_status['services']['redis'] = 'unhealthy'
        health_status['status'] = 'degraded'
  
    # Check disk space
    disk_usage = psutil.disk_usage('/')
    if disk_usage.percent > 90:
        health_status['services']['disk'] = 'critical'
        health_status['status'] = 'degraded'
    else:
        health_status['services']['disk'] = 'healthy'
  
    status_code = 200 if health_status['status'] == 'healthy' else 503
    return jsonify(health_status), status_code
```

#### Logging Configuration

```python
# backend/logging_config.py
import logging
import logging.config
from pythonjsonlogger import jsonlogger

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': jsonlogger.JsonFormatter,
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s'
        },
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        }
    },
    'handlers': {
        'default': {
            'level': 'INFO',
            'formatter': 'json',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout'
        },
        'file': {
            'level': 'INFO',
            'formatter': 'json',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/app.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5
        }
    },
    'loggers': {
        '': {
            'handlers': ['default', 'file'],
            'level': 'INFO',
            'propagate': False
        }
    }
}

def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
```

### Backup and Recovery

#### Database Backup Strategy

```bash
#!/bin/bash
# backup-database.sh

DB_NAME="omnimage"
DB_USER="user"
DB_HOST="localhost"
BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/omnimage_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "omnimage_*.sql.gz" -mtime +30 -delete

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/omnimage_$DATE.sql.gz s3://omnimage-backups/database/
```

#### File Storage Backup

```bash
#!/bin/bash
# backup-files.sh

UPLOAD_DIR="/app/uploads"
PROCESSED_DIR="/app/processed"
BACKUP_DIR="/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Sync files to backup directory
rsync -av --delete $UPLOAD_DIR/ $BACKUP_DIR/uploads_$DATE/
rsync -av --delete $PROCESSED_DIR/ $BACKUP_DIR/processed_$DATE/

# Create compressed archive
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C $BACKUP_DIR uploads_$DATE processed_$DATE

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/files_$DATE.tar.gz s3://omnimage-backups/files/

# Clean up local copies
rm -rf $BACKUP_DIR/uploads_$DATE $BACKUP_DIR/processed_$DATE
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +7 -delete
```

---

## Testing Strategy

### Frontend Testing

#### Unit Testing

```typescript
// components/__tests__/ImageViewer.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageViewer } from '../ImageViewer';
import { mockImage } from '../../__mocks__/image';

describe('ImageViewer', () => {
  it('renders image correctly', () => {
    render(<ImageViewer image={mockImage} />);
  
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockImage.url);
  });

  it('handles zoom controls', () => {
    const onZoomChange = jest.fn();
    render(
      <ImageViewer 
        image={mockImage} 
        onZoomChange={onZoomChange}
      />
    );
  
    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    fireEvent.click(zoomInButton);
  
    expect(onZoomChange).toHaveBeenCalledWith(1.25);
  });

  it('handles keyboard navigation', () => {
    const onImageChange = jest.fn();
    render(
      <ImageViewer 
        image={mockImage} 
        onImageChange={onImageChange}
      />
    );
  
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(onImageChange).toHaveBeenCalledWith('next');
  
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(onImageChange).toHaveBeenCalledWith('previous');
  });
});
```

#### Integration Testing

```typescript
// components/__tests__/ProcessingWorkflow.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProcessingWorkflow } from '../ProcessingWorkflow';
import { server } from '../../__mocks__/server';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Processing Workflow Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('completes resize operation successfully', async () => {
    const user = userEvent.setup();
  
    render(<ProcessingWorkflow />, { wrapper: createWrapper() });
  
    // Select resize tool
    await user.click(screen.getByRole('button', { name: /resize/i }));
  
    // Set dimensions
    await user.clear(screen.getByLabelText(/width/i));
    await user.type(screen.getByLabelText(/width/i), '800');
  
    await user.clear(screen.getByLabelText(/height/i));
    await user.type(screen.getByLabelText(/height/i), '600');
  
    // Apply operation
    await user.click(screen.getByRole('button', { name: /apply/i }));
  
    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.getByText(/processing complete/i)).toBeInTheDocument();
    });
  
    // Verify result
    expect(screen.getByText(/image resized successfully/i)).toBeInTheDocument();
  });
});
```

#### End-to-End Testing

```typescript
// e2e/image-processing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Image Processing Workflow', () => {
  test('user can upload, process, and download image', async ({ page }) => {
    await page.goto('/');
  
    // Upload image
    const fileChooser = await page.waitForEvent('filechooser');
    await page.click('text=Upload Image');
    await fileChooser.setFiles('test-assets/sample-image.jpg');
  
    // Wait for upload to complete
    await expect(page.locator('.gallery-item')).toBeVisible();
  
    // Select image in gallery
    await page.click('.gallery-item');
  
    // Verify image appears in middle panel
    await expect(page.locator('.image-viewer img')).toBeVisible();
  
    // Apply resize operation
    await page.click('text=Transform');
    await page.click('text=Resize');
  
    await page.fill('[data-testid="width-input"]', '800');
    await page.fill('[data-testid="height-input"]', '600');
  
    await page.click('button:has-text("Apply")');
  
    // Wait for processing
    await expect(page.locator('.processing-indicator')).toBeVisible();
    await expect(page.locator('.processing-indicator')).not.toBeVisible();
  
    // Verify processed image
    await expect(page.locator('.image-viewer')).toContainText('800 × 600');
  
    // Download processed image
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Download');
    const download = await downloadPromise;
  
    expect(download.suggestedFilename()).toMatch(/\.jpg$/);
  });
});
```

### Backend Testing

#### Unit Testing

```python
# tests/test_image_processor.py
import pytest
from PIL import Image
import tempfile
import os
from app.services.image_processor import ImageProcessor

class TestImageProcessor:
    @pytest.fixture
    def processor(self):
        return ImageProcessor()
  
    @pytest.fixture
    def sample_image(self):
        # Create a test image
        image = Image.new('RGB', (1000, 800), color='red')
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            image.save(f.name)
            yield f.name
        os.unlink(f.name)
  
    def test_resize_image(self, processor, sample_image):
        result = processor.resize_image(
            sample_image,
            width=500,
            height=400,
            maintain_aspect=False
        )
      
        assert result.success
        assert result.image_path is not None
      
        # Verify dimensions
        with Image.open(result.image_path) as img:
            assert img.size == (500, 400)
  
    def test_resize_with_aspect_ratio(self, processor, sample_image):
        result = processor.resize_image(
            sample_image,
            width=500,
            height=500,
            maintain_aspect=True
        )
      
        assert result.success
      
        # Should maintain 5:4 aspect ratio
        with Image.open(result.image_path) as img:
            assert img.size == (500, 400)
  
    def test_invalid_operation(self, processor, sample_image):
        result = processor.process_image(
            sample_image,
            'invalid_operation',
            {}
        )
      
        assert not result.success
        assert 'unknown operation' in result.error_message.lower()

# tests/test_routes.py
import pytest
import json
from app import create_app
from app.models import Image

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    return app.test_client()

class TestImageRoutes:
    def test_upload_image(self, client):
        data = {
            'image': (open('test-assets/sample.jpg', 'rb'), 'sample.jpg')
        }
      
        response = client.post('/api/images', data=data)
      
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'id' in data['image']
        assert data['image']['filename'] == 'sample.jpg'
  
    def test_process_image(self, client):
        # First upload an image
        upload_data = {
            'image': (open('test-assets/sample.jpg', 'rb'), 'sample.jpg')
        }
        upload_response = client.post('/api/images', data=upload_data)
        image_id = json.loads(upload_response.data)['image']['id']
      
        # Then process it
        process_data = {
            'operation': 'resize',
            'parameters': {
                'width': 800,
                'height': 600,
                'maintain_aspect': True
            }
        }
      
        response = client.post(
            f'/api/images/{image_id}/process',
            data=json.dumps(process_data),
            content_type='application/json'
        )
      
        assert response.status_code == 202
        data = json.loads(response.data)
        assert 'job_id' in data
```

#### Load Testing

```python
# tests/load_test.py
import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor

async def upload_image(session, image_path):
    """Upload an image and measure response time."""
    start_time = time.time()
  
    with open(image_path, 'rb') as f:
        data = aiohttp.FormData()
        data.add_field('image', f, filename='test.jpg')
      
        async with session.post('/api/images', data=data) as response:
            await response.json()
            return time.time() - start_time

async def load_test_uploads():
    """Test concurrent image uploads."""
    connector = aiohttp.TCPConnector(limit=100)
    async with aiohttp.ClientSession(
        'http://localhost:5000',
        connector=connector
    ) as session:
      
        # Create 50 concurrent upload tasks
        tasks = [
            upload_image(session, 'test-assets/sample.jpg')
            for _ in range(50)
        ]
      
        response_times = await asyncio.gather(*tasks)
      
        avg_time = sum(response_times) / len(response_times)
        max_time = max(response_times)
      
        print(f"Average response time: {avg_time:.3f}s")
        print(f"Maximum response time: {max_time:.3f}s")
        print(f"Requests per second: {len(response_times) / max_time:.2f}")

if __name__ == '__main__':
    asyncio.run(load_test_uploads())
```

### Performance Testing

#### Frontend Performance Tests

```typescript
// tests/performance/image-viewer.perf.test.ts
import { performance } from 'perf_hooks';

describe('Image Viewer Performance', () => {
  it('renders large image within performance budget', async () => {
    const startTime = performance.now();
  
    const { container } = render(
      <ImageViewer 
        image={{
          ...mockImage,
          url: '/test-assets/large-image-4k.jpg'
        }}
      />
    );
  
    await waitFor(() => {
      expect(container.querySelector('img')).toHaveProperty('complete', true);
    });
  
    const endTime = performance.now();
    const renderTime = endTime - startTime;
  
    // Should render within 1 second
    expect(renderTime).toBeLessThan(1000);
  });

  it('maintains 60fps during zoom operations', async () => {
    const frameTimings: number[] = [];
    let animationId: number;
  
    const measureFrameRate = () => {
      const start = performance.now();
    
      animationId = requestAnimationFrame(() => {
        frameTimings.push(performance.now() - start);
        if (frameTimings.length < 60) { // Measure 60 frames
          measureFrameRate();
        }
      });
    };
  
    render(<ImageViewer image={mockImage} />);
  
    // Start measuring during zoom
    const zoomSlider = screen.getByRole('slider');
    fireEvent.change(zoomSlider, { target: { value: '200' } });
  
    measureFrameRate();
  
    await waitFor(() => {
      expect(frameTimings).toHaveLength(60);
    });
  
    const avgFrameTime = frameTimings.reduce((a, b) => a + b) / frameTimings.length;
    const fps = 1000 / avgFrameTime;
  
    expect(fps).toBeGreaterThan(30); // Minimum acceptable framerate
  
    cancelAnimationFrame(animationId);
  });
});
```

---

## Contributing Guidelines

### Development Workflow

#### Git Workflow

```bash
# Feature development workflow
git checkout main
git pull origin main
git checkout -b feature/image-enhancement-tools

# Make changes and commit with conventional commits
git add .
git commit -m "feat(tools): add brightness adjustment tool

- Implement brightness adjustment with real-time preview
- Add keyboard shortcuts for fine adjustment
- Include unit tests for brightness calculations"

# Push feature branch
git push origin feature/image-enhancement-tools

# Create pull request for review
```

#### Commit Message Convention

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

* `feat`: New feature
* `fix`: Bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code
* `refactor`: Code change that neither fixes a bug nor adds a feature
* `perf`: Performance improvement
* `test`: Adding missing tests
* `chore`: Changes to the build process or auxiliary tools

**Examples:**

```
feat(tools): add crop tool with aspect ratio constraints
fix(gallery): resolve memory leak in virtual scrolling
docs(api): update processing endpoint documentation
refactor(stores): migrate to Zustand v4 API
perf(viewer): optimize canvas rendering for large images
test(processor): add unit tests for image transformations
```

### Code Review Process

#### Pull Request Requirements

1. **Automated Checks Pass**
   * All tests passing
   * No linting errors
   * No TypeScript errors
   * Bundle size within limits
2. **Code Quality**
   * Follows established patterns
   * Includes appropriate tests
   * Documentation updated
   * No security vulnerabilities
3. **Review Criteria**
   * Two approving reviews required
   * Performance impact assessed
   * UI/UX changes tested
   * Breaking changes documented

#### Review Checklist

```markdown
## Code Review Checklist

### Functionality
- [ ] Feature works as described
- [ ] Edge cases handled appropriately
- [ ] Error handling implemented
- [ ] Performance considerations addressed

### Code Quality
- [ ] Code follows project conventions
- [ ] No code duplication
- [ ] Functions are focused and testable
- [ ] Comments explain complex logic

### Testing
- [ ] Unit tests cover new functionality
- [ ] Integration tests for user flows
- [ ] Manual testing completed
- [ ] Performance tests if applicable

### Documentation
- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Type definitions accurate
- [ ] Comments explain complex logic

### Security
- [ ] Input validation implemented
- [ ] No sensitive data exposed
- [ ] Dependencies up to date
- [ ] Security best practices followed
```

### Release Process

#### Version Management

```json
// package.json
{
  "version": "1.2.3",
  "scripts": {
    "version": "npm run build && npm run test",
    "postversion": "git push && git push --tags"
  }
}
```

#### Release Checklist

```markdown
## Release Checklist

### Pre-Release
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Changelog prepared

### Release
- [ ] Version bumped appropriately
- [ ] Release notes published
- [ ] Docker images built and tagged
- [ ] Deployment pipeline triggered
- [ ] Monitoring alerts configured

### Post-Release
- [ ] Deployment verified
- [ ] Performance metrics stable
- [ ] Error rates within acceptable range
- [ ] User feedback collected
- [ ] Known issues documented
```

#### Semantic Versioning

* **MAJOR** (1.0.0): Breaking changes
* **MINOR** (0.1.0): New features, backward compatible
* **PATCH** (0.0.1): Bug fixes, backward compatible

### Documentation Standards

#### Code Documentation

```typescript
/**
 * Processes an image with the specified operation and parameters.
 * 
 * @param image - The image metadata object
 * @param operation - The processing operation to apply
 * @param parameters - Operation-specific parameters
 * @returns Promise that resolves to the processing result
 * 
 * @example
 * ```typescript
 * const result = await processImage(
 *   imageMetadata,
 *   'resize',
 *   { width: 800, height: 600, maintainAspect: true }
 * );
 * ```
 */
export async function processImage(
  image: ImageMetadata,
  operation: ProcessingOperation,
  parameters: ProcessingParameters
): Promise<ProcessingResult> {
  // Implementation
}
```

#### API Documentation

```python
def resize_image(image_id: str, width: int, height: int, maintain_aspect: bool = True):
    """
    Resize an image to the specified dimensions.
  
    Args:
        image_id: Unique identifier for the image
        width: Target width in pixels (1-10000)
        height: Target height in pixels (1-10000)
        maintain_aspect: Whether to maintain aspect ratio
      
    Returns:
        ProcessingResult: Contains success status and result path
      
    Raises:
        ValidationError: If parameters are invalid
        ProcessingError: If image processing fails
      
    Example:
        >>> result = resize_image('123', 800, 600, True)
        >>> print(result.image_path)
        '/processed/123_resized.jpg'
    """
```

---

This comprehensive documentation provides the foundation for building and maintaining Omnimage as a professional image processing platform. The modular architecture, security considerations, and performance requirements ensure the system can scale and evolve with user needs while maintaining high standards of quality and reliability.
