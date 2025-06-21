# Phase 5: Performance & User Experience Implementation Plan

## Overview

Phase 5 focuses on optimizing Omnimage for production-ready performance and providing a polished user experience. This phase implements advanced performance optimizations, comprehensive UI enhancements, robust export capabilities, and enterprise-grade security measures.

## 5.1 Performance Optimization

### Task 5.1.1: Advanced Image Lazy Loading and Caching System

**Prompt for Cascade:**

```
Implement a sophisticated image lazy loading and multi-tier caching system for optimal performance.

Location: `frontend/src/services/ImageCacheService.ts`

Requirements:
1. Intersection Observer-based lazy loading with configurable thresholds
2. Multi-tier caching (memory, IndexedDB, service worker cache)
3. Adaptive image loading based on connection speed and device capabilities
4. Preloading strategy for anticipated user actions
5. Progressive image enhancement (low-res to high-res)
6. Cache invalidation and cleanup mechanisms
7. Performance metrics tracking and optimization

Core caching implementation:
```typescript
interface CacheStrategy {
  memory: {
    maxSize: number; // MB
    maxAge: number; // milliseconds
    priority: 'lru' | 'lfu' | 'fifo';
  };
  indexedDB: {
    maxSize: number; // MB
    maxAge: number;
    compression: boolean;
  };
  serviceWorker: {
    maxSize: number;
    strategies: ('cacheFirst' | 'networkFirst' | 'staleWhileRevalidate')[];
  };
}

class ImageCacheService {
  private memoryCache: Map<string, CachedImage>;
  private dbCache: IDBDatabase;
  private loadingQueue: Map<string, Promise<HTMLImageElement>>;
  private preloadQueue: PriorityQueue<string>;
  
  async loadImage(url: string, priority: 'high' | 'normal' | 'low'): Promise<HTMLImageElement>;
  async preloadImages(urls: string[], strategy: 'sequential' | 'parallel'): Promise<void>;
  async invalidateCache(pattern?: string): Promise<void>;
  getPerformanceMetrics(): CacheMetrics;
}
```

Lazy loading features:

* Responsive image loading based on viewport size
* Connection-aware loading (slow 3G vs WiFi optimization)
* Progressive JPEG and WebP support with fallbacks
* Blur-to-focus loading transition animations
* Batch loading optimization for gallery views
* Error handling with retry mechanisms and fallback images

Advanced optimizations:

* Image resizing and format conversion in service worker
* Predictive preloading based on user behavior patterns
* Memory pressure monitoring with adaptive cache limits
* Network bandwidth detection and adaptive quality
* Background sync for offline image processing
* Critical resource prioritization during page load

Performance monitoring:

* Cache hit/miss ratio tracking
* Loading time metrics per image size
* Memory usage monitoring and alerting
* Network transfer size optimization reporting
* User experience impact measurement

```

### Task 5.1.2: Bundle Size Optimization with Code Splitting
**Prompt for Cascade:**
```

Implement comprehensive code splitting and bundle optimization strategies.

Location: `frontend/vite.config.ts` and related optimization files

Requirements:

1. Route-based code splitting for major application sections
2. Component-level lazy loading for heavy UI components
3. Tool-specific code splitting for image processing modules
4. Library code splitting and vendor chunk optimization
5. Dynamic imports for conditionally used features
6. Bundle analysis and size monitoring
7. Tree shaking optimization for unused code elimination

Vite configuration for optimal splitting:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
        
          // Image processing
          'image-processing': ['fabric', 'konva', 'image-js'],
          'ai-tools': ['@tensorflow/tfjs', 'onnxjs'],
        
          // Utilities
          'utils': ['lodash', 'date-fns', 'uuid'],
          'charts': ['recharts', 'd3'],
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop() 
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@tensorflow/tfjs'], // Large libraries
  },
});
```

Dynamic loading strategies:

```typescript
// Lazy component loading
const ImageEditor = lazy(() => import('./components/ImageEditor'));
const AITools = lazy(() => import('./components/tools/AITools'));

// Tool-specific loading
const loadCropTool = () => import('./tools/CropTool');
const loadFilterTool = () => import('./tools/FilterTool');

// Feature-based loading
const loadAdvancedFeatures = async () => {
  if (userHasPremium) {
    const { AdvancedExport } = await import('./features/AdvancedExport');
    const { CloudSync } = await import('./features/CloudSync');
    return { AdvancedExport, CloudSync };
  }
};
```

Bundle optimization techniques:

* Webpack Bundle Analyzer integration for size monitoring
* Automatic vendor chunk splitting based on usage patterns
* CSS code splitting with critical CSS inlining
* Asset optimization (images, fonts, icons)
* Dead code elimination with ESLint unused imports detection
* Production build optimization with minification and compression

Performance targets:

* Initial bundle size under 500KB (gzipped)
* Total bundle size under 2MB for full application
* Lazy chunks under 200KB each
* First Contentful Paint under 1.5 seconds
* Time to Interactive under 3 seconds on 3G networks

```

### Task 5.1.3: Service Worker for Offline Functionality
**Prompt for Cascade:**
```

Implement a comprehensive service worker for offline capabilities and performance enhancement.

Location: `frontend/public/sw.js` and `frontend/src/services/ServiceWorkerManager.ts`

Requirements:

1. Offline-first caching strategy for core application functionality
2. Background image processing capabilities
3. Automatic app updates with user notification
4. Network-aware caching strategies
5. Push notification support for processing completion
6. Offline queue for deferred operations
7. Cache management and storage quota monitoring

Service worker implementation:

```javascript
// public/sw.js
const CACHE_NAME = 'omnimage-v1';
const RUNTIME_CACHE = 'omnimage-runtime';
const IMAGE_CACHE = 'omnimage-images';

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        '/',
        '/static/js/main.js',
        '/static/css/main.css',
        '/manifest.json',
        // Core tools that work offline
        '/tools/crop.js',
        '/tools/resize.js',
        '/tools/filters.js'
      ]))
  );
});

// Fetch event - network strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Images: Cache first with network fallback
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  }
  
  // API calls: Network first with cache fallback
  else if (request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
  }
  
  // App shell: Cache first
  else {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
  }
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'image-processing') {
    event.waitUntil(processOfflineQueue());
  }
});
```

TypeScript service manager:

```typescript
class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private offlineQueue: OfflineOperation[] = [];
  
  async register(): Promise<void>;
  async updateApp(): Promise<boolean>;
  async queueOfflineOperation(operation: OfflineOperation): Promise<void>;
  async syncWhenOnline(): Promise<void>;
  getStorageUsage(): Promise<StorageEstimate>;
  clearCache(pattern?: string): Promise<void>;
}

interface OfflineOperation {
  id: string;
  type: 'image-process' | 'export' | 'save';
  data: any;
  timestamp: number;
  retryCount: number;
}
```

Offline capabilities:

* Core image editing tools available offline
* Automatic background sync when connection restored
* Offline operation queue with persistent storage
* Progressive web app installation prompts
* Update notifications with seamless app refresh
* Storage quota management and cleanup

Network-aware features:

* Connection quality detection (4G, 3G, offline)
* Adaptive caching strategies based on connection speed
* Background prefetching on fast connections
* Reduced functionality graceful degradation on slow connections
* Smart resource loading priority adjustment

```

### Task 5.1.4: Memory Management for Large Images
**Prompt for Cascade:**
```

Implement robust memory management for handling large images efficiently.

Location: `frontend/src/services/MemoryManager.ts`

Requirements:

1. Memory usage monitoring and automatic cleanup
2. Image downsampling for preview operations
3. Tile-based processing for extremely large images
4. WebGL texture management and garbage collection
5. Worker thread isolation for memory-intensive operations
6. Memory pressure detection and adaptive behavior
7. Efficient data structures for image manipulation

Memory management system:

```typescript
interface MemoryManager {
  getCurrentUsage(): Promise<number>;
  setMemoryLimit(limitMB: number): void;
  requestMemoryCleanup(): Promise<void>;
  monitorMemoryPressure(callback: (pressure: MemoryPressure) => void): void;
  
  // Image-specific memory management
  createImageBuffer(width: number, height: number): ImageBuffer;
  releaseImageBuffer(buffer: ImageBuffer): void;
  downsampleImage(image: HTMLImageElement, maxDimension: number): Promise<HTMLCanvasElement>;
  processImageInTiles(image: HTMLImageElement, tileSize: number, processor: TileProcessor): Promise<HTMLCanvasElement>;
}

class ImageBuffer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private webglTexture?: WebGLTexture;
  private lastAccessed: number;
  
  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.context = this.canvas.getContext('2d')!;
    this.lastAccessed = Date.now();
  }
  
  getImageData(): ImageData;
  putImageData(data: ImageData): void;
  toBlob(quality?: number): Promise<Blob>;
  dispose(): void;
}
```

Large image handling strategies:

* Progressive loading with multiple resolution levels
* Virtual canvas for images larger than device memory
* Streaming processing for operations that don't require full image in memory
* Efficient crop operations without full image loading
* Memory pool management for frequent allocations
* Automatic downsampling based on viewport size

WebGL optimizations:

* Texture atlas management for efficient GPU memory usage
* Automatic texture compression when supported
* Render target pooling and reuse
* GPU memory monitoring and cleanup
* Fallback to 2D canvas when GPU memory insufficient

Worker thread integration:

```typescript
// Isolate memory-intensive operations in workers
class ImageProcessingWorker {
  private worker: Worker;
  private jobQueue: Map<string, ProcessingJob>;
  
  async processImage(imageData: ImageData, operation: ProcessingOperation): Promise<ImageData> {
    const jobId = generateId();
    const job = new ProcessingJob(jobId, imageData, operation);
  
    return new Promise((resolve, reject) => {
      this.jobQueue.set(jobId, job);
      this.worker.postMessage({
        type: 'process',
        jobId,
        imageData: imageData.data.buffer, // Transfer ownership
        operation
      }, [imageData.data.buffer]);
    
      job.onComplete = resolve;
      job.onError = reject;
    });
  }
}
```

Performance monitoring:

* Real-time memory usage dashboard
* Memory leak detection and alerting
* Performance bottleneck identification
* Automatic optimization suggestions
* Memory usage reporting and analytics

```

## 5.2 Advanced UI Features

### Task 5.2.1: Comprehensive Keyboard Shortcuts System
**Prompt for Cascade:**
```

Implement a complete keyboard shortcuts system covering all major application functions.

Location: `frontend/src/hooks/useKeyboardShortcuts.ts`

Requirements:

1. Global shortcut registration and management
2. Context-aware shortcuts (tool-specific, panel-specific)
3. Customizable shortcut mapping with user preferences
4. Shortcut conflict detection and resolution
5. Visual shortcut hints and help overlay
6. Accessibility compliance with screen readers
7. Cross-platform compatibility (Windows, Mac, Linux)

Keyboard shortcut system:

```typescript
interface ShortcutDefinition {
  id: string;
  key: string; // e.g., 'Ctrl+C', 'Cmd+S', 'Space'
  description: string;
  category: ShortcutCategory;
  action: () => void | Promise<void>;
  context?: string; // Scope where shortcut is active
  preventDefault?: boolean;
  enabled?: boolean;
}

type ShortcutCategory = 
  | 'navigation' | 'editing' | 'tools' | 'view' 
  | 'file' | 'selection' | 'export' | 'system';

class ShortcutManager {
  private shortcuts: Map<string, ShortcutDefinition>;
  private contexts: Set<string>;
  private enabled: boolean = true;
  
  register(shortcut: ShortcutDefinition): void;
  unregister(id: string): void;
  setContext(context: string): void;
  getShortcutsForCategory(category: ShortcutCategory): ShortcutDefinition[];
  getUserCustomizations(): Record<string, string>;
  setUserCustomization(shortcutId: string, newKey: string): void;
}
```

Default shortcut mappings:

```typescript
const DEFAULT_SHORTCUTS: ShortcutDefinition[] = [
  // File operations
  { id: 'file.open', key: 'Ctrl+O', description: 'Open images', category: 'file' },
  { id: 'file.save', key: 'Ctrl+S', description: 'Save current image', category: 'file' },
  { id: 'file.export', key: 'Ctrl+E', description: 'Export image', category: 'file' },
  
  // Editing
  { id: 'edit.undo', key: 'Ctrl+Z', description: 'Undo last action', category: 'editing' },
  { id: 'edit.redo', key: 'Ctrl+Y', description: 'Redo last undone action', category: 'editing' },
  { id: 'edit.copy', key: 'Ctrl+C', description: 'Copy selection', category: 'editing' },
  { id: 'edit.paste', key: 'Ctrl+V', description: 'Paste', category: 'editing' },
  
  // Tools
  { id: 'tool.crop', key: 'C', description: 'Activate crop tool', category: 'tools' },
  { id: 'tool.brush', key: 'B', description: 'Activate brush tool', category: 'tools' },
  { id: 'tool.move', key: 'V', description: 'Activate move tool', category: 'tools' },
  
  // View
  { id: 'view.zoomIn', key: '+', description: 'Zoom in', category: 'view' },
  { id: 'view.zoomOut', key: '-', description: 'Zoom out', category: 'view' },
  { id: 'view.fitScreen', key: '0', description: 'Fit to screen', category: 'view' },
  { id: 'view.actualSize', key: '1', description: 'Actual size', category: 'view' },
  
  // Navigation
  { id: 'nav.nextImage', key: 'ArrowRight', description: 'Next image', category: 'navigation' },
  { id: 'nav.prevImage', key: 'ArrowLeft', description: 'Previous image', category: 'navigation' },
  { id: 'nav.togglePanels', key: 'Tab', description: 'Toggle panels', category: 'navigation' },
  
  // Selection
  { id: 'select.all', key: 'Ctrl+A', description: 'Select all', category: 'selection' },
  { id: 'select.none', key: 'Ctrl+D', description: 'Deselect all', category: 'selection' },
  { id: 'select.invert', key: 'Ctrl+Shift+I', description: 'Invert selection', category: 'selection' },
];
```

Advanced features:

* Chord shortcuts (sequences like 'G then H' for specific actions)
* Modal shortcuts (different mappings in different modes)
* Shortcut recording for easy customization
* Conflict resolution with automatic suggestions
* Help overlay with searchable shortcuts
* Accessibility announcements for screen readers

Integration components:

```typescript
// Hook for component-level shortcut handling
const useKeyboardShortcuts = (shortcuts: ShortcutDefinition[], context?: string) => {
  useEffect(() => {
    shortcuts.forEach(shortcut => {
      shortcutManager.register({ ...shortcut, context });
    });
  
    return () => {
      shortcuts.forEach(shortcut => {
        shortcutManager.unregister(shortcut.id);
      });
    };
  }, [shortcuts, context]);
};

// Shortcut help overlay component
const ShortcutHelpOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const shortcuts = shortcutManager.getAllShortcuts();
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <KeyboardIcon className="w-4 h-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <ShortcutGrid shortcuts={shortcuts} />
      </DialogContent>
    </Dialog>
  );
};
```

```

### Task 5.2.2: Advanced Drag & Drop Between Panels
**Prompt for Cascade:**
```

Implement sophisticated drag and drop functionality for seamless content transfer between panels.

Location: `frontend/src/hooks/useDragDrop.ts`

Requirements:

1. Multi-directional drag and drop between all panels
2. Visual feedback during drag operations (ghost images, drop zones)
3. Data transfer support (images, tools, configurations, folders)
4. Batch drag operations for multiple items
5. Smart drop zone detection with auto-scroll
6. Undo/redo integration for drag operations
7. Touch device support with gesture recognition

Drag and drop system architecture:

```typescript
interface DragDropManager {
  startDrag(data: DragData, source: DragSource): void;
  handleDragOver(target: DropTarget, event: DragEvent): void;
  handleDrop(target: DropTarget, event: DragEvent): void;
  addDropZone(zone: DropZone): void;
  removeDropZone(zoneId: string): void;
  setDragPreview(element: HTMLElement): void;
}

interface DragData {
  type: 'image' | 'tool' | 'preset' | 'folder' | 'selection';
  payload: any;
  metadata?: Record<string, any>;
  preview?: string; // Base64 image or URL
}

interface DropZone {
  id: string;
  element: HTMLElement;
  accepts: string[]; // Data types accepted
  onDrop: (data: DragData) => void | Promise<void>;
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  canAccept?: (data: DragData) => boolean;
  highlight?: boolean;
}
```

Panel-specific drag operations:

```typescript
// Gallery to Image Viewer
const galleryDragConfig = {
  draggable: true,
  onDragStart: (image: ImageMetadata) => ({
    type: 'image',
    payload: { id: image.id, url: image.url },
    preview: image.thumbnail
  }),
  dropZones: ['image-viewer', 'tool-panel', 'export-queue']
};

// Tool Panel configurations
const toolDragConfig = {
  draggable: true,
  onDragStart: (tool: ToolDefinition) => ({
    type: 'tool',
    payload: { toolId: tool.id, config: tool.defaultConfig },
    metadata: { category: tool.category }
  }),
  dropZones: ['image-viewer', 'batch-queue', 'preset-panel']
};

// Cross-panel operations
const crossPanelOperations = {
  'gallery -> viewer': (imageData: DragData) => {
    imageStore.setCurrentImage(imageData.payload);
  },
  'tool -> viewer': (toolData: DragData) => {
    toolStore.activateTool(toolData.payload.toolId);
  },
  'image -> export': (imageData: DragData) => {
    exportStore.addToQueue(imageData.payload);
  },
  'preset -> tool': (presetData: DragData) => {
    toolStore.applyPreset(presetData.payload);
  }
};
```

Advanced drag features:

* Multi-select drag with batch operations
* Nested drag operations (drag folder with contents)
* Intelligent drop prediction based on drag trajectory
* Auto-scroll when dragging near panel edges
* Drag cancellation with escape key
* Visual feedback with drop zone highlighting

Touch support:

```typescript
class TouchDragHandler {
  private touchStartPos: { x: number; y: number } | null = null;
  private dragThreshold = 10; // pixels
  private longPressDelay = 500; // ms
  
  handleTouchStart(event: TouchEvent, dragData: DragData): void {
    const touch = event.touches[0];
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
  
    // Start long press timer for drag initiation
    setTimeout(() => {
      if (this.touchStartPos) {
        this.startTouchDrag(dragData);
      }
    }, this.longPressDelay);
  }
  
  handleTouchMove(event: TouchEvent): void {
    if (!this.touchStartPos) return;
  
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartPos.x;
    const deltaY = touch.clientY - this.touchStartPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
    if (distance > this.dragThreshold) {
      this.updateDragPosition(touch.clientX, touch.clientY);
    }
  }
}
```

Visual feedback system:

* Custom drag previews with transparency
* Drop zone highlighting with animated borders
* Invalid drop indication with visual cues
* Progress indicators for async drop operations
* Undo notification for completed operations

```

### Task 5.2.3: Context Menus and Right-Click Actions
**Prompt for Cascade:**
```

Implement comprehensive context menu system for efficient right-click operations.

Location: `frontend/src/components/ui/ContextMenu.tsx`

Requirements:

1. Context-aware menu items based on selected content
2. Nested submenu support with keyboard navigation
3. Dynamic menu generation based on available actions
4. Keyboard shortcuts display in menu items
5. Icon support for visual menu identification
6. Custom menu item components for complex actions
7. Touch device support with long-press activation

Context menu system:

```typescript
interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action?: () => void | Promise<void>;
  submenu?: ContextMenuItem[];
  separator?: boolean;
  disabled?: boolean;
  visible?: boolean;
  tooltip?: string;
}

interface ContextMenuConfig {
  id: string;
  items: ContextMenuItem[];
  position?: { x: number; y: number };
  target?: HTMLElement;
  onClose?: () => void;
}

class ContextMenuManager {
  private activeMenu: ContextMenuConfig | null = null;
  private menuStack: ContextMenuConfig[] = [];
  
  show(config: ContextMenuConfig): void;
  hide(): void;
  addMenuItem(menuId: string, item: ContextMenuItem): void;
  removeMenuItem(menuId: string, itemId: string): void;
  updateMenuItem(menuId: string, itemId: string, updates: Partial<ContextMenuItem>): void;
}
```

Context-specific menu configurations:

```typescript
// Image Gallery context menu
const galleryContextMenu = (image: ImageMetadata): ContextMenuItem[] => [
  {
    id: 'open',
    label: 'Open in Editor',
    icon: 'edit',
    shortcut: 'Enter',
    action: () => openInEditor(image.id)
  },
  {
    id: 'preview',
    label: 'Quick Preview',
    icon: 'eye',
    shortcut: 'Space',
    action: () => showPreview(image.id)
  },
  { id: 'sep1', separator: true },
  {
    id: 'edit',
    label: 'Edit',
    icon: 'edit',
    submenu: [
      { id: 'crop', label: 'Crop', action: () => applyTool('crop', image.id) },
      { id: 'resize', label: 'Resize', action: () => applyTool('resize', image.id) },
      { id: 'rotate', label: 'Rotate', action: () => applyTool('rotate', image.id) }
    ]
  },
  {
    id: 'organize',
    label: 'Organize',
    icon: 'folder',
    submenu: [
      { id: 'move', label: 'Move to Folder...', action: () => showMoveDialog(image.id) },
      { id: 'copy', label: 'Copy to Folder...', action: () => showCopyDialog(image.id) },
      { id: 'tag', label: 'Add Tags...', action: () => showTagDialog(image.id) }
    ]
  },
  { id: 'sep2', separator: true },
  {
    id: 'export',
    label: 'Export',
    icon: 'download',
    submenu: [
      { id: 'jpg', label: 'Export as JPG', action: () => exportAs(image.id, 'jpg') },
      { id: 'png', label: 'Export as PNG', action: () => exportAs(image.id, 'png') },
      { id: 'webp', label: 'Export as WebP', action: () => exportAs(image.id, 'webp') }
    ]
  },
  {
    id: 'share',
    label: 'Share',
    icon: 'share',
    submenu: [
      { id: 'social', label: 'Social Media...', action: () => shareToSocial(image.id) },
      { id: 'email', label: 'Email...', action: () => shareByEmail(image.id) },
      { id: 'link', label: 'Copy Link', action: () => copyShareLink(image.id) }
    ]
  },
  { id: 'sep3', separator: true },
  {
    id: 'info',
    label: 'Properties',
    icon: 'info',
    shortcut: 'Ctrl+I',
    action: () => showImageInfo(image.id)
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: 'trash',
    shortcut: 'Delete',
    action: () => deleteImage(image.id)
  }
];

// Image Viewer context menu
const viewerContextMenu = (transform: ViewerTransform): ContextMenuItem[] => [
  {
    id: 'zoom',
    label: 'Zoom',
    icon: 'zoom-in',
    submenu: [
      { id: 'zoom-in', label: 'Zoom In', shortcut: '+', action: () => zoomIn() },
      { id: 'zoom-out', label: 'Zoom Out', shortcut: '-', action: () => zoomOut() },
      { id: 'fit', label: 'Fit to Screen', shortcut: '0', action: () => fitToScreen() },
      { id: 'actual', label: 'Actual Size', shortcut: '1', action: () => actualSize() }
    ]
  },
  {
    id: 'rotate',
    label: 'Rotate',
    icon: 'rotate-cw',
    submenu: [
      { id: 'rotate-left', label: 'Rotate Left', shortcut: 'Ctrl+[', action: () => rotate(-90) },
      { id: 'rotate-right', label: 'Rotate Right', shortcut: 'Ctrl+]', action: () => rotate(90) },
      { id: 'flip-h', label: 'Flip Horizontal', action: () => flipHorizontal() },
      { id: 'flip-v', label: 'Flip Vertical', action: () => flipVertical() }
    ]
  },
  { id: 'sep1', separator: true },
  {
    id: 'tools',
    label: 'Quick Tools',
    icon: 'tool',
    submenu: [
      { id: 'crop', label: 'Crop', shortcut: 'C', action: () => activateTool('crop') },
      { id: 'adjust', label: 'Adjust Colors', shortcut: 'Ctrl+L', action: () => activateTool('adjust') },
      { id: 'filter', label: 'Apply Filter...', action: () => showFilterDialog() }
    ]
  }
];

// Tool Panel context menu
const toolContextMenu = (tool: ToolDefinition): ContextMenuItem[] => [
  {
    id: 'apply',
    label: 'Apply Tool',
    icon: 'check',
    shortcut: 'Enter',
    action: () => applyTool(tool.id),
    disabled: !tool.canApply
  },
  {
    id: 'reset',
    label: 'Reset Settings',
    icon: 'refresh',
    action: () => resetToolSettings(tool.id)
  },
  { id: 'sep1', separator: true },
  {
    id: 'presets',
    label: 'Presets',
    icon: 'bookmark',
    submenu: [
      { id: 'save-preset', label: 'Save Current as Preset...', action: () => savePreset(tool.id) },
      { id: 'manage-presets', label: 'Manage Presets...', action: () => managePresets(tool.id) }
    ]
  },
  {
    id: 'help',
    label: 'Tool Help',
    icon: 'help-circle',
    shortcut: 'F1',
    action: () => showToolHelp(tool.id)
  }
];
```

Advanced menu features:

* Smart menu positioning to stay within viewport
* Keyboard navigation with arrow keys and Enter
* Search within large menus
* Recent actions quick access
* Customizable menu layouts
* Accessibility support with ARIA attributes

```

### Task 5.2.4: Mobile-Responsive Design Implementation
**Prompt for Cascade:**
```

Implement comprehensive mobile-responsive design for touch-based interaction.

Location: `frontend/src/styles/responsive.css` and mobile-specific components

Requirements:

1. Adaptive layout that works on phones, tablets, and desktops
2. Touch-optimized controls with appropriate sizing
3. Gesture support for common operations (pinch, swipe, tap)
4. Mobile-specific navigation patterns
5. Optimized performance for mobile devices
6. Offline-first mobile experience
7. Progressive Web App features for mobile installation

Responsive breakpoint system:

```css
/* Mobile-first responsive design */
:root {
  --mobile-sm: 320px;
  --mobile-md: 375px;
  --mobile-lg: 414px;
  --tablet-sm: 768px;
  --tablet-lg: 1024px;
  --desktop-sm: 1280px;
  --desktop-lg: 1920px;
}

/* Base mobile styles */
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Tablet and larger */
@media (min-width: 768px) {
  .app-layout {
    flex-direction: row;
  }
  
  .panel-container {
    flex-direction: row;
  }
}

/* Mobile-specific panel behavior */
@media (max-width: 767px) {
  .left-panel,
  .right-panel {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 80vw;
    max-width: 320px;
  }
  
  .left-panel.open {
    transform: translateX(0);
  }
  
  .right-panel {
    right: 0;
    transform: translateX(100%);
  }
  
  .right-panel.open {
    transform: translateX(0);
  }
  
  .middle-panel {
    flex: 1;
    width: 100%;
  }
}
```

Mobile-optimized components:

```typescript
// Mobile navigation bar
const MobileNavBar: React.FC = () => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  
  return (
    <div className="mobile-nav-bar">
      <button
        className="nav-button"
        onClick={() => setLeftPanelOpen(true)}
        aria-label="Open tools panel"
      >
        <ToolIcon className="w-6 h-6" />
      </button>
    
      <div className="nav-title">
        <h1>Omnimage</h1>
      </div>
    
      <div className="nav-actions">
        <button className="nav-button" aria-label="Export">
          <DownloadIcon className="w-6 h-6" />
        </button>
        <button
          className="nav-button"
          onClick={() => setRightPanelOpen(true)}
          aria-label="Open gallery"
        >
          <GalleryIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// Touch-optimized image viewer
const MobileImageViewer: React.FC<ImageViewerProps> = ({ imageUrl }) => {
  const [transform, setTransform] = useState<ViewerTransform>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0
  });
  
  const handleGesture = useCallback((gesture: GestureEvent) => {
    switch (gesture.type) {
      case 'pinch':
        setTransform(prev => ({
          ...prev,
          zoom: Math.max(0.1, Math.min(5, prev.zoom * gesture.scale))
        }));
        break;
      
      case 'pan':
        setTransform(prev => ({
          ...prev,
          panX: prev.panX + gesture.deltaX,
          panY: prev.panY + gesture.deltaY
        }));
        break;
      
      case 'double-tap':
        setTransform(prev => ({
          ...prev,
          zoom: prev.zoom === 1 ? 2 : 1,
          panX: 0,
          panY: 0
        }));
        break;
    }
  }, []);
  
  return (
    <div className="mobile-image-viewer">
      <GestureDetector onGesture={handleGesture}>
        <canvas
          ref={canvasRef}
          className="image-canvas"
          style={{
            transform: `scale(${transform.zoom}) translate(${transform.panX}px, ${transform.panY}px) rotate(${transform.rotation}deg)`
          }}
        />
      </GestureDetector>
    
      <MobileViewerControls transform={transform} onChange={setTransform} />
    </div>
  );
};
```

Gesture handling system:

```typescript
interface GestureEvent {
  type: 'tap' | 'double-tap' | 'long-press' | 'pinch' | 'pan' | 'swipe';
  deltaX?: number;
  deltaY?: number;
  scale?: number;
  velocity?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

class GestureDetector {
  private touchStart: TouchList | null = null;
  private lastTouchTime = 0;
  private tapCount = 0;
  
  private detectPinch(touches: TouchList): GestureEvent | null {
    if (touches.length !== 2) return null;
  
    const touch1 = touches[0];
    const touch2 = touches[1];
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  
    if (this.initialDistance) {
      const scale = distance / this.initialDistance;
      return { type: 'pinch', scale };
    }
  
    this.initialDistance = distance;
    return null;
  }
  
  private detectSwipe(startTouch: Touch, endTouch: Touch): GestureEvent | null {
    const deltaX = endTouch.clientX - startTouch.clientX;
    const deltaY = endTouch.clientY - startTouch.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
    if (distance < 30) return null; // Minimum swipe distance
  
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    let direction: 'up' | 'down' | 'left' | 'right';
  
    if (angle >= -45 && angle <= 45) direction = 'right';
    else if (angle >= 45 && angle <= 135) direction = 'down';
    else if (angle >= -135 && angle <= -45) direction = 'up';
    else direction = 'left';
  
    return { type: 'swipe', direction, deltaX, deltaY };
  }
}
```

Progressive Web App features:

* App manifest for mobile installation
* Splash screen customization
* Status bar styling
* Fullscreen mode support
* App shortcuts for quick actions
* Share target integration
* Background sync for mobile data efficiency

```

## 5.3 Export & Integration

### Task 5.3.1: Multiple Format Export System
**Prompt for Cascade:**
```

Implement comprehensive export system supporting multiple formats with quality optimization.

Location: `frontend/src/services/ExportService.ts`

Requirements:

1. Support for all major image formats (JPEG, PNG, WebP, TIFF, BMP, SVG)
2. Quality and compression settings per format
3. Metadata preservation and custom metadata injection
4. Color profile management and conversion
5. Batch export with progress tracking
6. Export presets for different use cases
7. Format-specific optimization (progressive JPEG, PNG compression levels)

Export service architecture:

```typescript
interface ExportFormat {
  type: 'jpeg' | 'png' | 'webp' | 'tiff' | 'bmp' | 'svg' | 'pdf';
  quality?: number; // 0-100
  compression?: number; // Format-specific
  progressive?: boolean; // JPEG
  lossless?: boolean; // WebP
  preserveMetadata?: boolean;
  colorProfile?: string;
  dpi?: number;
}

interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  resize?: {
    width?: number;
    height?: number;
    maintainAspectRatio: boolean;
    interpolation: 'nearest' | 'bilinear' | 'bicubic' | 'lanczos';
  };
  watermark?: WatermarkOptions;
  metadata?: CustomMetadata;
  destination?: ExportDestination;
}

class ExportService {
  async exportImage(imageId: string, options: ExportOptions): Promise<ExportResult>;
  async exportBatch(imageIds: string[], options: ExportOptions): Promise<BatchExportResult>;
  async generatePreview(imageId: string, options: ExportOptions): Promise<string>;
  getOptimalSettings(imageId: string, targetUse: ExportUseCase): ExportOptions;
  createExportPreset(name: string, options: ExportOptions): void;
  getExportPresets(): ExportPreset[];
}
```

Format-specific implementations:

```typescript
// JPEG export with optimization
class JPEGExporter {
  async export(imageData: ImageData, options: ExportFormat): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
  
    // Apply color profile conversion if needed
    if (options.colorProfile && options.colorProfile !== 'sRGB') {
      imageData = await this.convertColorProfile(imageData, options.colorProfile);
    }
  
    // Create progressive JPEG if requested
    if (options.progressive) {
      return this.createProgressiveJPEG(imageData, options.quality || 85);
    }
  
    // Standard JPEG export
    ctx.putImageData(imageData, 0, 0);
    return new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', (options.quality || 85) / 100);
    });
  }
}

// WebP export with modern features
class WebPExporter {
  async export(imageData: ImageData, options: ExportFormat): Promise<Blob> {
    // Check WebP support
    if (!this.isWebPSupported()) {
      throw new Error('WebP format not supported in this browser');
    }
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);
  
    // Use lossless compression if specified
    const quality = options.lossless ? 1 : (options.quality || 80) / 100;
  
    return new Promise(resolve => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });
  }
}

// TIFF export for professional workflows
class TIFFExporter {
  async export(imageData: ImageData, options: ExportFormat): Promise<Blob> {
    // Use TIFF.js library for proper TIFF generation
    const tiff = new TIFFWriter();
  
    tiff.writeImageData(imageData, {
      compression: options.compression || 'lzw',
      photometric: 'rgb',
      resolution: [options.dpi || 300, options.dpi || 300],
      resolutionUnit: 'inch'
    });
  
    return tiff.getBuffer();
  }
}
```

Export presets for common use cases:

```typescript
const EXPORT_PRESETS: Record<string, ExportOptions> = {
  'web-optimized': {
    format: { type: 'jpeg', quality: 85, progressive: true },
    resize: { width: 1920, maintainAspectRatio: true }
  },
  'social-media': {
    format: { type: 'jpeg', quality: 90 },
    resize: { width: 1080, height: 1080, maintainAspectRatio: false }
  },
  'print-300dpi': {
    format: { type: 'tiff', compression: 'lzw', dpi: 300 },
    preserveMetadata: true
  },
  'email-attachment': {
    format: { type: 'jpeg', quality: 75 },
    resize: { width: 800, maintainAspectRatio: true }
  },
  'archive-quality': {
    format: { type: 'png', preserveMetadata: true },
    metadata: { purpose: 'archive', quality: 'lossless' }
  }
};
```

Batch export with progress tracking:

* Queue-based processing with priority management
* Progress tracking with individual file status
* Error handling and recovery for failed exports
* Resume capability for interrupted batch operations
* Memory management for large batch exports
* Parallel processing optimization

```

### Task 5.3.2: Batch Export Management System
**Prompt for Cascade:**
```

Create advanced batch export functionality with queue management and progress tracking.

Location: `frontend/src/components/export/BatchExportManager.tsx`

Requirements:

1. Batch export queue with priority management
2. Progress tracking for individual and overall progress
3. Export job scheduling and resource management
4. Error handling and retry mechanisms
5. Export templates and workflow automation
6. Resume capability for interrupted exports
7. Export history and result management

Batch export system:

```typescript
interface BatchExportJob {
  id: string;
  name: string;
  imageIds: string[];
  exportOptions: ExportOptions;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: BatchExportProgress;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

interface BatchExportProgress {
  totalImages: number;
  processedImages: number;
  failedImages: number;
  currentImage?: string;
  estimatedTimeRemaining: number;
  averageProcessingTime: number;
}

class BatchExportManager {
  private jobQueue: BatchExportJob[] = [];
  private activeJobs: Map<string, BatchExportJob> = new Map();
  private maxConcurrentJobs = 3;
  
  async addJob(job: Omit<BatchExportJob, 'id' | 'status' | 'progress' | 'createdAt'>): Promise<string>;
  async startJob(jobId: string): Promise<void>;
  async pauseJob(jobId: string): Promise<void>;
  async resumeJob(jobId: string): Promise<void>;
  async cancelJob(jobId: string): Promise<void>;
  async retryFailedImages(jobId: string): Promise<void>;
  getJobStatus(jobId: string): BatchExportJob | null;
  getAllJobs(): BatchExportJob[];
}
```

Export workflow templates:

```typescript
interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  steps: ExportStep[];
  defaultOptions: ExportOptions;
  category: 'social' | 'print' | 'web' | 'archive' | 'custom';
}

interface ExportStep {
  id: string;
  type: 'resize' | 'watermark' | 'format' | 'organize';
  options: any;
  conditional?: {
    field: string;
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
    value: any;
  };
}

const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'social-media-suite',
    name: 'Social Media Suite',
    description: 'Export multiple sizes for different social platforms',
    category: 'social',
    steps: [
      {
        id: 'instagram-square',
        type: 'resize',
        options: { width: 1080, height: 1080 }
      },
      {
        id: 'facebook-cover',
        type: 'resize',
        options: { width: 1200, height: 630 }
      },
      {
        id: 'twitter-header',
        type: 'resize',
        options: { width: 1500, height: 500 }
      }
    ],
    defaultOptions: {
      format: { type: 'jpeg', quality: 90 }
    }
  },
  {
    id: 'print-ready',
    name: 'Print Ready',
    description: 'High-quality export for professional printing',
    category: 'print',
    steps: [
      {
        id: 'color-profile',
        type: 'format',
        options: { colorProfile: 'Adobe RGB' }
      },
      {
        id: 'high-res',
        type: 'resize',
        options: { dpi: 300 },
        conditional: {
          field: 'currentDPI',
          operator: 'lessThan',
          value: 300
        }
      }
    ],
    defaultOptions: {
      format: { type: 'tiff', compression: 'lzw', dpi: 300 }
    }
  }
];
```

UI components for batch management:

```typescript
const BatchExportQueue: React.FC = () => {
  const jobs = useBatchExportStore(state => state.jobs);
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  
  return (
    <div className="batch-export-queue">
      <div className="queue-header">
        <h3>Export Queue</h3>
        <div className="queue-actions">
          <Button onClick={() => pauseAllJobs()}>Pause All</Button>
          <Button onClick={() => clearCompletedJobs()}>Clear Completed</Button>
        </div>
      </div>
    
      <div className="job-list">
        {jobs.map(job => (
          <BatchExportJobCard
            key={job.id}
            job={job}
            selected={selectedJobs.has(job.id)}
            onSelect={(selected) => {
              const newSelection = new Set(selectedJobs);
              if (selected) {
                newSelection.add(job.id);
              } else {
                newSelection.delete(job.id);
              }
              setSelectedJobs(newSelection);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const BatchExportJobCard: React.FC<{ job: BatchExportJob }> = ({ job }) => {
  const progress = (job.progress.processedImages / job.progress.totalImages) * 100;
  
  return (
    <div className={`job-card status-${job.status}`}>
      <div className="job-header">
        <h4>{job.name}</h4>
        <div className="job-status">
          <StatusIcon status={job.status} />
          <span>{job.status}</span>
        </div>
      </div>
    
      <div className="job-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">
          {job.progress.processedImages} / {job.progress.totalImages} images
        </div>
      </div>
    
      <div className="job-actions">
        {job.status === 'running' && (
          <Button size="sm" onClick={() => pauseJob(job.id)}>
            Pause
          </Button>
        )}
        {job.status === 'paused' && (
          <Button size="sm" onClick={() => resumeJob(job.id)}>
            Resume
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => cancelJob(job.id)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
```

Advanced features:

* Conditional export steps based on image properties
* Resource usage monitoring and adaptive processing
* Export result preview and quality validation
* Automatic retry with exponential backoff
* Export analytics and performance metrics

```

### Task 5.3.3: Cloud Storage Integration
**Prompt for Cascade:**
```

Implement cloud storage integration for seamless file synchronization and sharing.

Location: `frontend/src/services/CloudStorageService.ts`

Requirements:

1. Multiple cloud provider support (Google Drive, Dropbox, OneDrive, AWS S3)
2. Automatic sync for processed images
3. Shared folder management and collaboration
4. Offline queue with sync when connection restored
5. Conflict resolution for simultaneous edits
6. Storage quota monitoring and management
7. Secure authentication with OAuth 2.0

Cloud storage architecture:

```typescript
interface CloudProvider {
  id: string;
  name: string;
  icon: string;
  authUrl: string;
  capabilities: CloudCapability[];
  quotaLimit?: number;
  rateLimits: RateLimit[];
}

interface CloudCapability {
  type: 'upload' | 'download' | 'share' | 'sync' | 'versioning' | 'collaboration';
  supported: boolean;
  limitations?: string[];
}

abstract class CloudStorageAdapter {
  abstract authenticate(): Promise<AuthResult>;
  abstract uploadFile(file: File, path: string): Promise<CloudFile>;
  abstract downloadFile(fileId: string): Promise<Blob>;
  abstract createFolder(name: string, parentId?: string): Promise<CloudFolder>;
  abstract shareFile(fileId: string, permissions: SharePermissions): Promise<ShareLink>;
  abstract getQuotaUsage(): Promise<QuotaInfo>;
  abstract syncFolder(localPath: string, remotePath: string): Promise<SyncResult>;
}

class GoogleDriveAdapter extends CloudStorageAdapter {
  private client: GoogleApiClient;
  
  async authenticate(): Promise<AuthResult> {
    return await this.client.auth2.signIn({
      scope: 'https://www.googleapis.com/auth/drive.file'
    });
  }
  
  async uploadFile(file: File, path: string): Promise<CloudFile> {
    const metadata = {
      name: file.name,
      parents: [await this.getOrCreateFolder(path)]
    };
  
    const response = await gapi.client.request({
      path: 'https://www.googleapis.com/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      headers: { 'Content-Type': 'multipart/related; boundary="foo_bar_baz"' },
      body: this.createMultipartBody(metadata, file)
    });
  
    return this.parseCloudFile(response.result);
  }
}
```

Sync management system:

```typescript
interface SyncOperation {
  id: string;
  type: 'upload' | 'download' | 'delete' | 'move';
  localPath: string;
  remotePath: string;
  fileId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  error?: string;
  retryCount: number;
  lastAttempt: Date;
}

class CloudSyncManager {
  private syncQueue: SyncOperation[] = [];
  private activeSyncs: Map<string, SyncOperation> = new Map();
  private providers: Map<string, CloudStorageAdapter> = new Map();
  
  async addSyncOperation(operation: Omit<SyncOperation, 'id' | 'status' | 'progress'>): Promise<string>;
  async processSyncQueue(): Promise<void>;
  async resolveConflict(localFile: File, remoteFile: CloudFile): Promise<ConflictResolution>;
  async setupAutoSync(folderId: string, provider: string): Promise<void>;
  getConnectionStatus(): ConnectionStatus;
}

// Conflict resolution strategies
type ConflictResolution = 
  | { action: 'use-local'; backup?: boolean }
  | { action: 'use-remote'; backup?: boolean }
  | { action: 'merge'; strategy: string }
  | { action: 'keep-both'; rename?: string };

class ConflictResolver {
  async resolveConflict(
    localFile: File, 
    remoteFile: CloudFile, 
    strategy: 'auto' | 'manual'
  ): Promise<ConflictResolution> {
    if (strategy === 'auto') {
      // Use timestamp and file size to determine resolution
      if (localFile.lastModified > remoteFile.modifiedTime.getTime()) {
        return { action: 'use-local', backup: true };
      } else {
        return { action: 'use-remote', backup: true };
      }
    }
  
    // Manual resolution - show UI for user choice
    return await this.showConflictDialog(localFile, remoteFile);
  }
}
```

Cloud storage UI components:

```typescript
const CloudStoragePanel: React.FC = () => {
  const [connectedProviders, setConnectedProviders] = useState<CloudProvider[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  
  return (
    <div className="cloud-storage-panel">
      <div className="provider-list">
        {SUPPORTED_PROVIDERS.map(provider => (
          <CloudProviderCard
            key={provider.id}
            provider={provider}
            connected={connectedProviders.some(p => p.id === provider.id)}
            onConnect={() => connectProvider(provider.id)}
            onDisconnect={() => disconnectProvider(provider.id)}
          />
        ))}
      </div>
    
      <div className="sync-controls">
        <Button onClick={() => triggerSync()}>
          Sync Now
        </Button>
        <div className="sync-status">
          <SyncStatusIcon status={syncStatus} />
          <span>{getSyncStatusText(syncStatus)}</span>
        </div>
      </div>
    
      <CloudFolderBrowser />
    </div>
  );
};

const CloudFolderBrowser: React.FC = () => {
  const [folders, setFolders] = useState<CloudFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  return (
    <div className="cloud-folder-browser">
      <div className="folder-tree">
        {folders.map(folder => (
          <FolderNode
            key={folder.id}
            folder={folder}
            selected={selectedFolder === folder.id}
            onSelect={setSelectedFolder}
          />
        ))}
      </div>
    
      <div className="folder-actions">
        <Button onClick={() => createNewFolder()}>
          New Folder
        </Button>
        <Button onClick={() => shareFolder(selectedFolder)}>
          Share
        </Button>
      </div>
    </div>
  );
};
```

Security and privacy features:

* End-to-end encryption for sensitive files
* Token refresh and secure credential storage
* Permission-based access control
* Audit logging for file operations
* GDPR compliance for data handling
* Secure sharing with expiration dates

```

### Task 5.3.4: Social Media Sharing Integration
**Prompt for Cascade:**
```

Implement direct social media sharing with platform-specific optimizations.

Location: `frontend/src/services/SocialSharingService.ts`

Requirements:

1. Native sharing APIs for major platforms (Facebook, Instagram, Twitter, LinkedIn)
2. Platform-specific image optimization and sizing
3. Automatic metadata generation for rich sharing
4. Batch sharing across multiple platforms
5. Scheduled sharing with queue management
6. Analytics tracking for shared content
7. Privacy controls and sharing permissions

Social sharing architecture:

```typescript
interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  apiUrl: string;
  authRequired: boolean;
  imageSizes: SocialImageSize[];
  capabilities: SharingCapability[];
  rateLimits: RateLimit[];
}

interface SocialImageSize {
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  description: string;
  recommended: boolean;
}

interface SharingOptions {
  platform: string;
  imageId: string;
  caption?: string;
  hashtags?: string[];
  location?: GeolocationData;
  privacy: 'public' | 'friends' | 'private';
  scheduledTime?: Date;
  crossPost?: string[]; // Other platforms to share to
}

abstract class SocialPlatformAdapter {
  abstract authenticate(): Promise<AuthResult>;
  abstract shareImage(options: SharingOptions): Promise<ShareResult>;
  abstract schedulePost(options: SharingOptions): Promise<ScheduledPost>;
  abstract getOptimalImageSize(imageAspectRatio: number): SocialImageSize;
  abstract generateHashtags(imageMetadata: ImageMetadata): string[];
}

class InstagramAdapter extends SocialPlatformAdapter {
  private readonly imageSizes: SocialImageSize[] = [
    { name: 'square', width: 1080, height: 1080, aspectRatio: 1, description: 'Instagram Post', recommended: true },
    { name: 'portrait', width: 1080, height: 1350, aspectRatio: 0.8, description: 'Instagram Portrait', recommended: false },
    { name: 'landscape', width: 1080, height: 566, aspectRatio: 1.91, description: 'Instagram Landscape', recommended: false },
    { name: 'story', width: 1080, height: 1920, aspectRatio: 0.5625, description: 'Instagram Story', recommended: true }
  ];
  
  async shareImage(options: SharingOptions): Promise<ShareResult> {
    // Optimize image for Instagram
    const optimizedImage = await this.optimizeForInstagram(options.imageId);
  
    // Generate Instagram-appropriate caption
    const caption = this.formatCaption(options.caption, options.hashtags);
  
    // Use Instagram Basic Display API
    const response = await fetch(`${this.apiUrl}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: optimizedImage.url,
        caption: caption,
        access_token: this.accessToken
      })
    });
  
    return this.parseShareResult(response);
  }
  
  private async optimizeForInstagram(imageId: string): Promise<OptimizedImage> {
    // Get original image
    const image = await imageService.getImage(imageId);
  
    // Determine best size based on aspect ratio
    const optimalSize = this.getOptimalImageSize(image.aspectRatio);
  
    // Export with Instagram-optimized settings
    return await exportService.exportImage(imageId, {
      format: { type: 'jpeg', quality: 95 },
      resize: {
        width: optimalSize.width,
        height: optimalSize.height,
        maintainAspectRatio: false
      }
    });
  }
}
```

Multi-platform sharing manager:

```typescript
class SocialSharingManager {
  private platforms: Map<string, SocialPlatformAdapter> = new Map();
  private shareQueue: ScheduledShare[] = [];
  
  async shareToMultiplePlatforms(
    imageId: string,
    platforms: string[],
    options: Partial<SharingOptions>
  ): Promise<MultiShareResult> {
    const results: ShareResult[] = [];
  
    for (const platformId of platforms) {
      const platform = this.platforms.get(platformId);
      if (!platform) continue;
    
      try {
        // Customize options for each platform
        const platformOptions = {
          ...options,
          platform: platformId,
          imageId,
          caption: this.customizeCaptionForPlatform(options.caption, platformId),
          hashtags: this.customizeHashtagsForPlatform(options.hashtags, platformId)
        };
      
        const result = await platform.shareImage(platformOptions);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          platform: platformId,
          error: error.message
        });
      }
    }
  
    return { results, overallSuccess: results.some(r => r.success) };
  }
  
  async scheduleShare(options: SharingOptions): Promise<ScheduledShare> {
    const scheduledShare: ScheduledShare = {
      id: generateId(),
      ...options,
      status: 'scheduled',
      createdAt: new Date()
    };
  
    this.shareQueue.push(scheduledShare);
    this.scheduleExecution(scheduledShare);
  
    return scheduledShare;
  }
  
  private customizeCaptionForPlatform(caption: string, platform: string): string {
    switch (platform) {
      case 'twitter':
        // Truncate for Twitter character limit
        return caption.length > 280 ? caption.substring(0, 277) + '...' : caption;
      case 'linkedin':
        // Add professional tone for LinkedIn
        return this.addProfessionalTone(caption);
      case 'instagram':
        // Add emojis for Instagram engagement
        return this.addEmojis(caption);
      default:
        return caption;
    }
  }
}
```

Sharing UI components:

```typescript
const SocialSharingDialog: React.FC<{ imageId: string; isOpen: boolean; onClose: () => void }> = ({
  imageId, isOpen, onClose
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  
  const handleShare = async () => {
    const options: SharingOptions = {
      platform: '', // Will be set for each platform
      imageId,
      caption,
      hashtags,
      privacy: 'public',
      scheduledTime: scheduledTime || undefined
    };
  
    if (scheduledTime) {
      await socialSharingManager.scheduleShare(options);
    } else {
      await socialSharingManager.shareToMultiplePlatforms(
        imageId,
        Array.from(selectedPlatforms),
        options
      );
    }
  
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share to Social Media</DialogTitle>
        </DialogHeader>
      
        <div className="space-y-6">
          <PlatformSelector
            platforms={SUPPORTED_PLATFORMS}
            selected={selectedPlatforms}
            onChange={setSelectedPlatforms}
          />
        
          <ImagePreviewGrid
            imageId={imageId}
            platforms={Array.from(selectedPlatforms)}
          />
        
          <CaptionEditor
            value={caption}
            onChange={setCaption}
            suggestions={await generateCaptionSuggestions(imageId)}
          />
        
          <HashtagEditor
            value={hashtags}
            onChange={setHashtags}
            suggestions={await generateHashtagSuggestions(imageId)}
          />
        
          <SchedulingOptions
            scheduledTime={scheduledTime}
            onChange={setScheduledTime}
          />
        </div>
      
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleShare}>
            {scheduledTime ? 'Schedule' : 'Share Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PlatformSelector: React.FC<{
  platforms: SocialPlatform[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
}> = ({ platforms, selected, onChange }) => {
  return (
    <div className="platform-selector">
      <h3>Select Platforms</h3>
      <div className="platform-grid">
        {platforms.map(platform => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            selected={selected.has(platform.id)}
            onToggle={(checked) => {
              const newSelected = new Set(selected);
              if (checked) {
                newSelected.add(platform.id);
              } else {
                newSelected.delete(platform.id);
              }
              onChange(newSelected);
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

Analytics and tracking:

* Share performance metrics
* Engagement tracking across platforms
* A/B testing for captions and hashtags
* Optimal posting time analysis
* Audience insights and demographics
* ROI tracking for business accounts

```

## 5.4 Security & Validation

### Task 5.4.1: Comprehensive File Validation System
**Prompt for Cascade:**
```

Implement robust file validation and security scanning for all uploaded content.

Location: `backend/app/security/FileValidator.py`

Requirements:

1. Multi-layer file type validation (magic bytes, extension, MIME type)
2. Malware scanning integration with multiple engines
3. Content validation for embedded metadata and scripts
4. File size and dimension limits with configurable policies
5. Image integrity validation and corruption detection
6. Virus signature database updates and management
7. Quarantine system for suspicious files

File validation architecture:

```python
from typing import Dict, List, Optional, Tuple
import magic
import hashlib
import struct
from pathlib import Path

class FileValidationError(Exception):
    def __init__(self, message: str, severity: str = 'error'):
        self.message = message
        self.severity = severity
        super().__init__(message)

class SecurityScanResult:
    def __init__(self, is_safe: bool, threats: List[str] = None, confidence: float = 1.0):
        self.is_safe = is_safe
        self.threats = threats or []
        self.confidence = confidence
        self.scan_time = datetime.utcnow()

class FileValidator:
    def __init__(self, config: ValidationConfig):
        self.config = config
        self.magic_detector = magic.Magic(mime=True)
        self.scanners = self._initialize_scanners()
        self.quarantine_dir = Path(config.quarantine_path)
      
    def validate_file(self, file_path: Path) -> ValidationResult:
        """Comprehensive file validation pipeline."""
        result = ValidationResult(file_path)
      
        try:
            # Stage 1: Basic file validation
            self._validate_file_basics(file_path, result)
          
            # Stage 2: File type validation
            self._validate_file_type(file_path, result)
          
            # Stage 3: Content validation
            self._validate_file_content(file_path, result)
          
            # Stage 4: Security scanning
            self._scan_for_malware(file_path, result)
          
            # Stage 5: Image-specific validation
            if self._is_image_file(file_path):
                self._validate_image_content(file_path, result)
              
        except Exception as e:
            result.add_error(f"Validation failed: {str(e)}", severity='critical')
          
        return result
  
    def _validate_file_basics(self, file_path: Path, result: ValidationResult):
        """Basic file existence, size, and permissions validation."""
        if not file_path.exists():
            result.add_error("File does not exist", severity='critical')
            return
          
        file_size = file_path.stat().st_size
      
        # Size validation
        if file_size == 0:
            result.add_error("File is empty", severity='error')
        elif file_size > self.config.max_file_size:
            result.add_error(f"File too large: {file_size} bytes", severity='error')
      
        # Check for reasonable file size for images
        if file_size > 100 * 1024 * 1024:  # 100MB
            result.add_warning("Unusually large file size, may cause performance issues")
  
    def _validate_file_type(self, file_path: Path, result: ValidationResult):
        """Multi-layer file type validation."""
        # Extension validation
        extension = file_path.suffix.lower()
        if extension not in self.config.allowed_extensions:
            result.add_error(f"File extension '{extension}' not allowed", severity='error')
            return
      
        # MIME type validation
        mime_type = self.magic_detector.from_file(str(file_path))
        if mime_type not in self.config.allowed_mime_types:
            result.add_error(f"MIME type '{mime_type}' not allowed", severity='error')
            return
          
        # Magic bytes validation
        if not self._validate_magic_bytes(file_path, extension):
            result.add_error("File signature doesn't match extension", severity='error')
  
    def _validate_magic_bytes(self, file_path: Path, expected_extension: str) -> bool:
        """Validate file magic bytes against expected type."""
        magic_signatures = {
            '.jpg': [b'\xff\xd8\xff'],
            '.jpeg': [b'\xff\xd8\xff'],
            '.png': [b'\x89\x50\x4e\x47\x0d\x0a\x1a\x0a'],
            '.gif': [b'GIF87a', b'GIF89a'],
            '.webp': [b'RIFF', b'WEBP'],
            '.tiff': [b'II*\x00', b'MM\x00*'],
            '.bmp': [b'BM']
        }
      
        if expected_extension not in magic_signatures:
            return True  # Unknown type, skip magic byte validation
          
        with open(file_path, 'rb') as f:
            file_header = f.read(16)
          
        for signature in magic_signatures[expected_extension]:
            if file_header.startswith(signature):
                return True
              
        return False
  
    def _scan_for_malware(self, file_path: Path, result: ValidationResult):
        """Multi-engine malware scanning."""
        for scanner_name, scanner in self.scanners.items():
            try:
                scan_result = scanner.scan_file(file_path)
              
                if not scan_result.is_safe:
                    result.add_error(
                        f"Malware detected by {scanner_name}: {', '.join(scan_result.threats)}",
                        severity='critical'
                    )
                    self._quarantine_file(file_path, scan_result.threats)
                  
            except Exception as e:
                result.add_warning(f"Scanner {scanner_name} failed: {str(e)}")
  
    def _validate_image_content(self, file_path: Path, result: ValidationResult):
        """Image-specific content validation."""
        try:
            from PIL import Image
            import piexif
          
            # Open and validate image
            with Image.open(file_path) as img:
                # Check image dimensions
                width, height = img.size
              
                if width > self.config.max_image_width or height > self.config.max_image_height:
                    result.add_error(f"Image dimensions too large: {width}x{height}", severity='error')
              
                if width < self.config.min_image_width or height < self.config.min_image_height:
                    result.add_warning(f"Image dimensions very small: {width}x{height}")
              
                # Validate image can be processed
                try:
                    img.verify()
                except Exception:
                    result.add_error("Image file is corrupted", severity='error')
                    return
              
                # Check for embedded scripts in EXIF data
                if hasattr(img, '_getexif') and img._getexif():
                    exif_data = img._getexif()
                    self._scan_exif_for_threats(exif_data, result)
                  
        except Exception as e:
            result.add_error(f"Image validation failed: {str(e)}", severity='error')
  
    def _scan_exif_for_threats(self, exif_data: dict, result: ValidationResult):
        """Scan EXIF data for potential security threats."""
        dangerous_patterns = [
            b'<script', b'javascript:', b'data:text/html',
            b'<?php', b'<%', b'<iframe', b'<object'
        ]
      
        for tag, value in exif_data.items():
            if isinstance(value, (str, bytes)):
                value_bytes = value.encode() if isinstance(value, str) else value
              
                for pattern in dangerous_patterns:
                    if pattern in value_bytes.lower():
                        result.add_error(
                            f"Suspicious content in EXIF tag {tag}",
                            severity='high'
                        )
```

Malware scanner integration:

```python
class MalwareScannerInterface:
    """Abstract interface for malware scanners."""
  
    @abstractmethod
    def scan_file(self, file_path: Path) -> SecurityScanResult:
        pass
  
    @abstractmethod
    def update_signatures(self) -> bool:
        pass

class ClamAVScanner(MalwareScannerInterface):
    """ClamAV antivirus scanner integration."""
  
    def __init__(self, config: dict):
        self.clamd_socket = config.get('socket_path', '/var/run/clamav/clamd.ctl')
        self.timeout = config.get('timeout', 30)
      
    def scan_file(self, file_path: Path) -> SecurityScanResult:
        import pyclamd
      
        try:
            cd = pyclamd.ClamdUnixSocket(self.clamd_socket)
            scan_result = cd.scan_file(str(file_path))
          
            if scan_result is None:
                return SecurityScanResult(is_safe=True)
          
            threats = list(scan_result.values())
            return SecurityScanResult(
                is_safe=False,
                threats=threats,
                confidence=0.95
            )
          
        except Exception as e:
            raise ScannerError(f"ClamAV scan failed: {str(e)}")

class VirusTotalScanner(MalwareScannerInterface):
    """VirusTotal API scanner integration."""
  
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://www.virustotal.com/vtapi/v2"
      
    def scan_file(self, file_path: Path) -> SecurityScanResult:
        # Calculate file hash
        file_hash = self._calculate_sha256(file_path)
      
        # Check existing scan results
        report = self._get_file_report(file_hash)
      
        if report and report.get('response_code') == 1:
            positives = report.get('positives', 0)
            total = report.get('total', 1)
          
            is_safe = positives == 0
            threats = []
          
            if not is_safe:
                # Extract threat names from scan results
                scans = report.get('scans', {})
                threats = [
                    f"{engine}: {result['result']}"
                    for engine, result in scans.items()
                    if result.get('detected')
                ]
          
            confidence = 1.0 - (positives / total) if total > 0 else 1.0
          
            return SecurityScanResult(
                is_safe=is_safe,
                threats=threats,
                confidence=confidence
            )
      
        # No existing report, upload for scanning
        return self._upload_and_scan(file_path)
```

Quarantine and incident response:

```python
class QuarantineManager:
    """Manages quarantined files and incident response."""
  
    def __init__(self, quarantine_dir: Path, retention_days: int = 30):
        self.quarantine_dir = quarantine_dir
        self.retention_days = retention_days
        self.quarantine_db = SQLiteDatabase(quarantine_dir / 'quarantine.db')
      
    def quarantine_file(self, file_path: Path, threats: List[str], metadata: dict = None):
        """Move file to quarantine and log incident."""
        quarantine_id = str(uuid.uuid4())
        quarantine_path = self.quarantine_dir / f"{quarantine_id}.quarantined"
      
        # Move file to quarantine
        shutil.move(str(file_path), str(quarantine_path))
      
        # Log quarantine event
        incident_record = {
            'quarantine_id': quarantine_id,
            'original_path': str(file_path),
            'quarantine_path': str(quarantine_path),
            'threats': json.dumps(threats),
            'metadata': json.dumps(metadata or {}),
            'quarantine_time': datetime.utcnow().isoformat(),
            'status': 'quarantined'
        }
      
        self.quarantine_db.insert('incidents', incident_record)
      
        # Send notification to security team
        self._notify_security_team(incident_record)
      
    def cleanup_expired_quarantine(self):
        """Remove quarantined files older than retention period."""
        cutoff_date = datetime.utcnow() - timedelta(days=self.retention_days)
      
        expired_files = self.quarantine_db.query(
            "SELECT * FROM incidents WHERE quarantine_time < ? AND status = 'quarantined'",
            (cutoff_date.isoformat(),)
        )
      
        for record in expired_files:
            quarantine_path = Path(record['quarantine_path'])
            if quarantine_path.exists():
                quarantine_path.unlink()
              
            self.quarantine_db.update(
                'incidents',
                {'status': 'expired'},
                {'quarantine_id': record['quarantine_id']}
            )
```

Real-time threat monitoring:

* Continuous monitoring of uploaded files
* Automatic signature updates for scanners
* Integration with threat intelligence feeds
* Incident response workflow automation
* Security metrics and reporting dashboard

```

### Task 5.4.2: Rate Limiting and Abuse Prevention
**Prompt for Cascade:**
```

Implement comprehensive rate limiting and abuse prevention system.

Location: `backend/app/security/RateLimiter.py`

Requirements:

1. Multi-level rate limiting (IP, user, API endpoint, operation type)
2. Adaptive rate limiting based on user behavior and system load
3. DDoS protection with automatic IP blocking
4. Resource-based limiting (CPU, memory, storage usage)
5. Geographic and temporal access controls
6. Abuse pattern detection with machine learning
7. Integration with external threat intelligence services

Rate limiting architecture:

```python
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import redis
import time
import hashlib
from collections import defaultdict
import numpy as np

class LimitType(Enum):
    REQUESTS_PER_SECOND = "rps"
    REQUESTS_PER_MINUTE = "rpm"
    REQUESTS_PER_HOUR = "rph"
    REQUESTS_PER_DAY = "rpd"
    CONCURRENT_CONNECTIONS = "concurrent"
    DATA_TRANSFER = "data_transfer"
    PROCESSING_TIME = "processing_time"

@dataclass
class RateLimit:
    limit_type: LimitType
    threshold: int
    window_size: int  # seconds
    burst_allowance: int = 0
    recovery_time: int = 300  # seconds

@dataclass
class LimitViolation:
    client_id: str
    limit_type: LimitType
    current_value: int
    threshold: int
    timestamp: float
    severity: str  # 'warning', 'violation', 'critical'

class RateLimiter:
    def __init__(self, redis_client: redis.Redis, config: Dict):
        self.redis = redis_client
        self.config = config
        self.rate_limits = self._load_rate_limits()
        self.violation_handlers = {}
        self.abuse_detector = AbuseDetector(redis_client)
      
    def check_rate_limit(self, client_id: str, endpoint: str, 
                        operation_type: str = None) -> Tuple[bool, Optional[LimitViolation]]:
        """Check if request is within rate limits."""
      
        # Get applicable rate limits
        limits = self._get_applicable_limits(client_id, endpoint, operation_type)
      
        for limit in limits:
            violation = self._check_single_limit(client_id, limit, endpoint)
            if violation:
                # Log violation
                self._log_violation(violation)
              
                # Check for abuse patterns
                if self.abuse_detector.is_abuse_pattern(client_id, violation):
                    self._handle_abuse(client_id, violation)
              
                return False, violation
              
        # All limits passed, increment counters
        self._increment_counters(client_id, endpoint, limits)
        return True, None
  
    def _check_single_limit(self, client_id: str, limit: RateLimit, 
                           endpoint: str) -> Optional[LimitViolation]:
        """Check a single rate limit."""
      
        key = f"rate_limit:{client_id}:{limit.limit_type.value}:{endpoint}"
        current_time = time.time()
        window_start = current_time - limit.window_size
      
        if limit.limit_type in [LimitType.REQUESTS_PER_SECOND, 
                               LimitType.REQUESTS_PER_MINUTE,
                               LimitType.REQUESTS_PER_HOUR]:
            return self._check_sliding_window_limit(key, limit, current_time, window_start)
        elif limit.limit_type == LimitType.CONCURRENT_CONNECTIONS:
            return self._check_concurrent_limit(key, limit, client_id)
        elif limit.limit_type == LimitType.DATA_TRANSFER:
            return self._check_data_transfer_limit(key, limit, client_id)
          
        return None
  
    def _check_sliding_window_limit(self, key: str, limit: RateLimit, 
                                   current_time: float, window_start: float) -> Optional[LimitViolation]:
        """Sliding window rate limit check using Redis sorted sets."""
      
        pipe = self.redis.pipeline()
      
        # Remove expired entries
        pipe.zremrangebyscore(key, 0, window_start)
      
        # Count current entries
        pipe.zcard(key)
      
        # Execute pipeline
        results = pipe.execute()
        current_count = results[1]
      
        # Check burst allowance
        burst_key = f"{key}:burst"
        burst_count = self.redis.get(burst_key)
        burst_count = int(burst_count) if burst_count else 0
      
        effective_threshold = limit.threshold + limit.burst_allowance - burst_count
      
        if current_count >= effective_threshold:
            return LimitViolation(
                client_id=key.split(':')[1],
                limit_type=limit.limit_type,
                current_value=current_count,
                threshold=effective_threshold,
                timestamp=current_time,
                severity='violation' if current_count > limit.threshold else 'warning'
            )
          
        return None
  
    def _get_applicable_limits(self, client_id: str, endpoint: str, 
                              operation_type: str = None) -> List[RateLimit]:
        """Get rate limits applicable to this request."""
      
        limits = []
      
        # Base limits for all users
        limits.extend(self.rate_limits.get('default', []))
      
        # User-specific limits
        user_tier = self._get_user_tier(client_id)
        limits.extend(self.rate_limits.get(user_tier, []))
      
        # Endpoint-specific limits
        endpoint_limits = self.rate_limits.get('endpoints', {}).get(endpoint, [])
        limits.extend(endpoint_limits)
      
        # Operation-specific limits
        if operation_type:
            op_limits = self.rate_limits.get('operations', {}).get(operation_type, [])
            limits.extend(op_limits)
          
        return limits

class AdaptiveRateLimiter(RateLimiter):
    """Rate limiter that adapts based on system load and user behavior."""
  
    def __init__(self, redis_client: redis.Redis, config: Dict):
        super().__init__(redis_client, config)
        self.system_monitor = SystemMonitor()
        self.user_profiler = UserBehaviorProfiler(redis_client)
      
    def get_adaptive_limit(self, base_limit: RateLimit, client_id: str) -> RateLimit:
        """Adjust rate limit based on current conditions."""
      
        # System load adjustment
        system_load = self.system_monitor.get_load_factor()
        load_multiplier = max(0.1, 1.0 - system_load)  # Reduce limits under high load
      
        # User behavior adjustment
        user_score = self.user_profiler.get_trust_score(client_id)
        user_multiplier = 0.5 + (user_score * 0.5)  # 0.5x to 1.0x based on trust
      
        # Time-based adjustment
        time_multiplier = self._get_time_based_multiplier()
      
        adjusted_threshold = int(
            base_limit.threshold * load_multiplier * user_multiplier * time_multiplier
        )
      
        return RateLimit(
            limit_type=base_limit.limit_type,
            threshold=max(1, adjusted_threshold),  # Minimum 1 request
            window_size=base_limit.window_size,
            burst_allowance=base_limit.burst_allowance,
            recovery_time=base_limit.recovery_time
        )
  
    def _get_time_based_multiplier(self) -> float:
        """Adjust limits based on time of day and day of week."""
        current_time = datetime.now()
        hour = current_time.hour
        weekday = current_time.weekday()
      
        # Reduce limits during peak hours (9 AM - 5 PM weekdays)
        if weekday < 5 and 9 <= hour <= 17:
            return 0.8  # 80% of normal limits
      
        # Higher limits during off-peak hours
        elif hour < 6 or hour > 22:
            return 1.2  # 120% of normal limits
          
        return 1.0  # Normal limits

class AbuseDetector:
    """Detects abuse patterns and implements countermeasures."""
  
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.patterns = {
            'rapid_burst': self._detect_rapid_burst,
            'distributed_attack': self._detect_distributed_attack,
            'resource_exhaustion': self._detect_resource_exhaustion,
            'unusual_endpoints': self._detect_unusual_endpoints
        }
      
    def is_abuse_pattern(self, client_id: str, violation: LimitViolation) -> bool:
        """Check if violation indicates abuse pattern."""
      
        for pattern_name, detector in self.patterns.items():
            if detector(client_id, violation):
                self._log_abuse_pattern(client_id, pattern_name, violation)
                return True
              
        return False
  
    def _detect_rapid_burst(self, client_id: str, violation: LimitViolation) -> bool:
        """Detect rapid burst of requests."""
      
        # Check if multiple violations in short time
        violation_key = f"violations:{client_id}"
        current_time = time.time()
        burst_window = 60  # 1 minute
      
        # Count recent violations
        recent_violations = self.redis.zcount(
            violation_key, 
            current_time - burst_window, 
            current_time
        )
      
        # Record current violation
        self.redis.zadd(violation_key, {str(current_time): current_time})
        self.redis.expire(violation_key, 3600)  # 1 hour TTL
      
        # Threshold for burst detection
        return recent_violations >= 5
  
    def _detect_distributed_attack(self, client_id: str, violation: LimitViolation) -> bool:
        """Detect coordinated distributed attacks."""
      
        # Check for similar patterns from multiple IPs
        ip_prefix = '.'.join(client_id.split('.')[:3])  # Class C network
        pattern_key = f"attack_pattern:{ip_prefix}:{violation.limit_type.value}"
      
        current_time = time.time()
        attack_window = 300  # 5 minutes
      
        # Count violations from same network
        network_violations = self.redis.zcount(
            pattern_key,
            current_time - attack_window,
            current_time
        )
      
        self.redis.zadd(pattern_key, {client_id: current_time})
        self.redis.expire(pattern_key, 3600)
      
        return network_violations >= 10  # 10+ IPs from same network
  
    def _detect_resource_exhaustion(self, client_id: str, violation: LimitViolation) -> bool:
        """Detect attempts to exhaust system resources."""
      
        if violation.limit_type not in [LimitType.DATA_TRANSFER, LimitType.PROCESSING_TIME]:
            return False
          
        # Check resource usage patterns
        resource_key = f"resource_usage:{client_id}"
        usage_data = self.redis.hgetall(resource_key)
      
        if not usage_data:
            return False
          
        # Calculate resource usage velocity
        total_usage = sum(float(v) for v in usage_data.values())
        time_span = max(1, len(usage_data))
        usage_velocity = total_usage / time_span
      
        # Threshold based on violation type
        thresholds = {
            LimitType.DATA_TRANSFER: 1000000,  # 1MB/request average
            LimitType.PROCESSING_TIME: 30      # 30 seconds/request average
        }
      
        return usage_velocity > thresholds.get(violation.limit_type, float('inf'))

class DDoSProtector:
    """Advanced DDoS protection system."""
  
    def __init__(self, redis_client: redis.Redis, config: Dict):
        self.redis = redis_client
        self.config = config
        self.blocked_ips = set()
        self.challenge_responses = {}
      
    def check_ddos_patterns(self, client_ip: str, request_data: Dict) -> Dict:
        """Check for DDoS attack patterns."""
      
        current_time = time.time()
      
        # Check connection rate
        conn_rate = self._get_connection_rate(client_ip)
        if conn_rate > self.config.get('max_connections_per_second', 100):
            return self._initiate_challenge(client_ip, 'high_connection_rate')
      
        # Check request patterns
        if self._is_suspicious_pattern(client_ip, request_data):
            return self._initiate_challenge(client_ip, 'suspicious_pattern')
      
        # Check for bot-like behavior
        if self._is_bot_behavior(client_ip, request_data):
            return self._initiate_challenge(client_ip, 'bot_behavior')
      
        return {'status': 'allowed'}
  
    def _initiate_challenge(self, client_ip: str, reason: str) -> Dict:
        """Initiate challenge-response for suspicious clients."""
      
        # Generate challenge
        challenge_id = hashlib.sha256(f"{client_ip}:{time.time()}".encode()).hexdigest()[:16]
      
        challenge_data = {
            'challenge_id': challenge_id,
            'client_ip': client_ip,
            'reason': reason,
            'timestamp': time.time(),
            'attempts': 0
        }
      
        # Store challenge
        challenge_key = f"challenge:{challenge_id}"
        self.redis.hset(challenge_key, mapping=challenge_data)
        self.redis.expire(challenge_key, 300)  # 5 minute expiry
      
        return {
            'status': 'challenge_required',
            'challenge_id': challenge_id,
            'challenge_type': 'captcha',  # or 'proof_of_work'
            'reason': reason
        }
  
    def verify_challenge_response(self, challenge_id: str, response: str) -> bool:
        """Verify challenge response."""
      
        challenge_key = f"challenge:{challenge_id}"
        challenge_data = self.redis.hgetall(challenge_key)
      
        if not challenge_data:
            return False
      
        # Increment attempt counter
        attempts = int(challenge_data.get('attempts', 0)) + 1
        self.redis.hset(challenge_key, 'attempts', attempts)
      
        # Too many attempts
        if attempts > 3:
            self._block_ip(challenge_data['client_ip'], 'failed_challenge')
            return False
      
        # Verify response (simplified - in production use proper CAPTCHA verification)
        if self._verify_captcha_response(response):
            # Remove challenge and whitelist temporarily
            self.redis.delete(challenge_key)
            self._add_to_whitelist(challenge_data['client_ip'], duration=3600)
            return True
      
        return False

# Flask middleware integration
class RateLimitMiddleware:
    """Flask middleware for rate limiting."""
  
    def __init__(self, app, rate_limiter: RateLimiter, ddos_protector: DDoSProtector):
        self.app = app
        self.rate_limiter = rate_limiter
        self.ddos_protector = ddos_protector
        self.app.before_request(self._before_request)
      
    def _before_request(self):
        """Check rate limits before processing request."""
      
        client_ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
        endpoint = request.endpoint or 'unknown'
      
        # DDoS protection check
        ddos_result = self.ddos_protector.check_ddos_patterns(client_ip, {
            'endpoint': endpoint,
            'method': request.method,
            'user_agent': request.headers.get('User-Agent', ''),
            'referer': request.headers.get('Referer', '')
        })
      
        if ddos_result['status'] == 'challenge_required':
            return jsonify(ddos_result), 429
      
        # Rate limit check
        is_allowed, violation = self.rate_limiter.check_rate_limit(
            client_ip, endpoint, request.method
        )
      
        if not is_allowed:
            response_data = {
                'error': 'Rate limit exceeded',
                'limit_type': violation.limit_type.value,
                'current': violation.current_value,
                'threshold': violation.threshold,
                'retry_after': self._calculate_retry_after(violation)
            }
          
            response = jsonify(response_data)
            response.status_code = 429
            response.headers['Retry-After'] = str(self._calculate_retry_after(violation))
            return response
  
    def _calculate_retry_after(self, violation: LimitViolation) -> int:
        """Calculate retry-after header value."""
      
        if violation.limit_type == LimitType.REQUESTS_PER_SECOND:
            return 1
        elif violation.limit_type == LimitType.REQUESTS_PER_MINUTE:
            return 60
        elif violation.limit_type == LimitType.REQUESTS_PER_HOUR:
            return 3600
        else:
            return 300  # Default 5 minutes
```

Security monitoring and analytics:

* Real-time abuse pattern visualization
* Geolocation-based threat analysis
* Machine learning for behavior anomaly detection
* Integration with external threat intelligence feeds
* Automated incident response workflows

```

### Task 5.4.3: User Session Management
**Prompt for Cascade:**
```

Implement secure user session management with advanced security features.

Location: `backend/app/auth/SessionManager.py`

Requirements:

1. Secure session creation with cryptographically strong tokens
2. Session expiration and automatic renewal mechanisms
3. Concurrent session management and device tracking
4. Session hijacking detection and prevention
5. Role-based access control integration
6. Session analytics and security monitoring
7. Multi-factor authentication integration

Session management architecture:

```python
from typing import Dict, List, Optional, Tuple
import jwt
import secrets
import hashlib
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum
import redis
import bcrypt

class SessionStatus(Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"
    SUSPICIOUS = "suspicious"
    LOCKED = "locked"

@dataclass
class SessionInfo:
    session_id: str
    user_id: str
    device_id: str
    ip_address: str
    user_agent: str
    created_at: datetime
    last_activity: datetime
    expires_at: datetime
    status: SessionStatus
    permissions: List[str]
    security_flags: Dict[str, bool]

class SessionManager:
    def __init__(self, redis_client: redis.Redis, config: Dict):
        self.redis = redis_client
        self.config = config
        self.jwt_secret = config['jwt_secret']
        self.session_timeout = config.get('session_timeout', 3600)  # 1 hour
        self.max_concurrent_sessions = config.get('max_concurrent_sessions', 5)
        self.security_monitor = SessionSecurityMonitor(redis_client)
      
    def create_session(self, user_id: str, device_info: Dict, 
                      ip_address: str, permissions: List[str] = None) -> SessionInfo:
        """Create a new secure session."""
      
        # Generate secure session ID
        session_id = self._generate_session_id()
        device_id = self._generate_device_id(device_info)
      
        # Check concurrent session limit
        self._enforce_concurrent_session_limit(user_id)
      
        # Create session object
        session = SessionInfo(
            session_id=session_id,
            user_id=user_id,
            device_id=device_id,
            ip_address=ip_address,
            user_agent=device_info.get('user_agent', ''),
            created_at=datetime.utcnow(),
            last_activity=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(seconds=self.session_timeout),
            status=SessionStatus.ACTIVE,
            permissions=permissions or [],
            security_flags={
                'secure_connection': device_info.get('secure', False),
                'trusted_device': self._is_trusted_device(user_id, device_id),
                'geolocation_verified': self._verify_geolocation(user_id, ip_address)
            }
        )
      
        # Store session
        self._store_session(session)
      
        # Log session creation
        self.security_monitor.log_session_event(session.session_id, 'created', {
            'user_id': user_id,
            'device_id': device_id,
            'ip_address': ip_address
        })
      
        return session
  
    def validate_session(self, session_id: str, ip_address: str, 
                        user_agent: str) -> Tuple[bool, Optional[SessionInfo]]:
        """Validate session and check for security issues."""
      
        session = self._get_session(session_id)
        if not session:
            return False, None
      
        # Check expiration
        if datetime.utcnow() > session.expires_at:
            self._revoke_session(session_id, 'expired')
            return False, None
      
        # Check status
        if session.status != SessionStatus.ACTIVE:
            return False, session
      
        # Security checks
        security_issues = self._check_session_security(session, ip_address, user_agent)
        if security_issues:
            self._handle_security_issues(session, security_issues)
            return False, session
      
        # Update last activity
        self._update_session_activity(session_id)
      
        return True, session
  
    def _generate_session_id(self) -> str:
        """Generate cryptographically secure session ID."""
        # 256-bit random token
        random_bytes = secrets.token_bytes(32)
        timestamp = str(int(time.time())).encode()
      
        # Hash with timestamp to prevent timing attacks
        session_hash = hashlib.sha256(random_bytes + timestamp).hexdigest()
        return session_hash
  
    def _generate_device_id(self, device_info: Dict) -> str:
        """Generate stable device ID from device characteristics."""
        device_string = f"{device_info.get('user_agent', '')}" \
                       f"{device_info.get('screen_resolution', '')}" \
                       f"{device_info.get('timezone', '')}" \
                       f"{device_info.get('language', '')}"
      
        return hashlib.sha256(device_string.encode()).hexdigest()[:16]
  
    def _check_session_security(self, session: SessionInfo, 
                               current_ip: str, current_ua: str) -> List[str]:
        """Check for potential security issues."""
      
        issues = []
      
        # IP address change detection
        if session.ip_address != current_ip:
            if not self._is_ip_change_legitimate(session, current_ip):
                issues.append('suspicious_ip_change')
      
        # User agent change detection
        if session.user_agent != current_ua:
            if not self._is_ua_change_legitimate(session, current_ua):
                issues.append('user_agent_mismatch')
      
        # Session duration anomaly
        session_duration = (datetime.utcnow() - session.created_at).total_seconds()
        if session_duration > self.config.get('max_session_duration', 86400):  # 24 hours
            issues.append('excessive_session_duration')
      
        # Activity pattern analysis
        if self.security_monitor.is_suspicious_activity(session.session_id):
            issues.append('suspicious_activity_pattern')
      
        return issues
  
    def _handle_security_issues(self, session: SessionInfo, issues: List[str]):
        """Handle detected security issues."""
      
        for issue in issues:
            if issue in ['suspicious_ip_change', 'user_agent_mismatch']:
                # Require re-authentication
                self._mark_session_suspicious(session.session_id)
                self.security_monitor.trigger_security_alert(session.user_id, issue)
          
            elif issue == 'excessive_session_duration':
                # Force session renewal
                self._expire_session(session.session_id)
          
            elif issue == 'suspicious_activity_pattern':
                # Lock session and require additional verification
                self._lock_session(session.session_id)
                self.security_monitor.initiate_additional_verification(session.user_id)

class SessionSecurityMonitor:
    """Monitor session security and detect anomalies."""
  
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.activity_analyzer = ActivityPatternAnalyzer()
      
    def log_session_event(self, session_id: str, event_type: str, data: Dict):
        """Log session security events."""
      
        event_record = {
            'session_id': session_id,
            'event_type': event_type,
            'timestamp': time.time(),
            'data': json.dumps(data)
        }
      
        # Store in Redis with TTL
        event_key = f"session_events:{session_id}"
        self.redis.lpush(event_key, json.dumps(event_record))
        self.redis.ltrim(event_key, 0, 1000)  # Keep last 1000 events
        self.redis.expire(event_key, 86400 * 7)  # 7 days TTL
      
        # Real-time anomaly detection
        if self._is_anomalous_event(session_id, event_type, data):
            self.trigger_security_alert(data.get('user_id'), f'anomalous_{event_type}')
  
    def is_suspicious_activity(self, session_id: str) -> bool:
        """Analyze session activity patterns for suspicious behavior."""
      
        # Get recent activity
        event_key = f"session_events:{session_id}"
        recent_events = self.redis.lrange(event_key, 0, 100)
      
        if len(recent_events) < 10:
            return False  # Not enough data
      
        # Parse events
        events = [json.loads(event) for event in recent_events]
      
        # Check for rapid-fire requests
        if self._detect_rapid_requests(events):
            return True
      
        # Check for unusual access patterns
        if self._detect_unusual_patterns(events):
            return True
      
        # Check for automation indicators
        if self._detect_automation(events):
            return True
      
        return False
  
    def _detect_rapid_requests(self, events: List[Dict]) -> bool:
        """Detect unusually rapid request patterns."""
      
        # Count requests in last minute
        current_time = time.time()
        recent_requests = [
            e for e in events 
            if current_time - e['timestamp'] < 60 and e['event_type'] == 'request'
        ]
      
        return len(recent_requests) > 100  # More than 100 requests per minute
  
    def _detect_automation(self, events: List[Dict]) -> bool:
        """Detect signs of automated/bot behavior."""
      
        request_events = [e for e in events if e['event_type'] == 'request']
      
        if len(request_events) < 10:
            return False
      
        # Check timing patterns
        intervals = []
        for i in range(1, len(request_events)):
            interval = request_events[i]['timestamp'] - request_events[i-1]['timestamp']
            intervals.append(interval)
      
        # Very regular intervals suggest automation
        if len(set([round(i, 1) for i in intervals])) == 1:
            return True
      
        # Check for missing common human behaviors
        human_indicators = ['mouse_move', 'scroll', 'resize', 'focus_change']
        has_human_behavior = any(
            indicator in str(e.get('data', '')) for e in events 
            for indicator in human_indicators
        )
      
        return not has_human_behavior

class MultiFactorAuthManager:
    """Manage multi-factor authentication for sessions."""
  
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.totp_generator = TOTPGenerator()
        self.sms_service = SMSService()
      
    def require_mfa(self, session_id: str, user_id: str) -> Dict:
        """Require MFA verification for session."""
      
        # Get user's MFA methods
        mfa_methods = self._get_user_mfa_methods(user_id)
      
        if not mfa_methods:
            return {'status': 'no_mfa_configured'}
      
        # Generate MFA challenge
        challenge_id = secrets.token_urlsafe(32)
      
        challenge_data = {
            'challenge_id': challenge_id,
            'session_id': session_id,
            'user_id': user_id,
            'methods': mfa_methods,
            'attempts': 0,
            'created_at': time.time()
        }
      
        # Store challenge
        challenge_key = f"mfa_challenge:{challenge_id}"
        self.redis.hset(challenge_key, mapping=challenge_data)
        self.redis.expire(challenge_key, 300)  # 5 minutes
      
        # Send challenge to user
        self._send_mfa_challenge(user_id, mfa_methods[0])  # Use first method
      
        return {
            'status': 'mfa_required',
            'challenge_id': challenge_id,
            'methods': [m['type'] for m in mfa_methods]
        }
  
    def verify_mfa(self, challenge_id: str, method: str, response: str) -> bool:
        """Verify MFA response."""
      
        challenge_key = f"mfa_challenge:{challenge_id}"
        challenge_data = self.redis.hgetall(challenge_key)
      
        if not challenge_data:
            return False
      
        # Increment attempts
        attempts = int(challenge_data.get('attempts', 0)) + 1
        self.redis.hset(challenge_key, 'attempts', attempts)
      
        if attempts > 3:
            self.redis.delete(challenge_key)
            return False
      
        # Verify based on method
        if method == 'totp':
            is_valid = self.totp_generator.verify_token(
                challenge_data['user_id'], response
            )
        elif method == 'sms':
            is_valid = self._verify_sms_code(
                challenge_data['user_id'], response
            )
        else:
            return False
      
        if is_valid:
            # Mark session as MFA verified
            session_key = f"session:{challenge_data['session_id']}"
            self.redis.hset(session_key, 'mfa_verified', 'true')
            self.redis.delete(challenge_key)
            return True
      
        return False
```

Session management UI components:

```typescript
const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [currentSession, setCurrentSession] = useState<string>('');
  
  return (
    <div className="session-manager">
      <div className="current-session">
        <h3>Current Session</h3>
        <SessionCard session={getCurrentSession()} isCurrent={true} />
      </div>
    
      <div className="other-sessions">
        <h3>Other Active Sessions</h3>
        {sessions.filter(s => s.sessionId !== currentSession).map(session => (
          <SessionCard
            key={session.sessionId}
            session={session}
            isCurrent={false}
            onRevoke={() => revokeSession(session.sessionId)}
          />
        ))}
      </div>
    
      <div className="session-settings">
        <h3>Security Settings</h3>
        <SessionSecuritySettings />
      </div>
    </div>
  );
};

const SessionCard: React.FC<{
  session: SessionInfo;
  isCurrent: boolean;
  onRevoke?: () => void;
}> = ({ session, isCurrent, onRevoke }) => {
  return (
    <div className={`session-card ${isCurrent ? 'current' : ''}`}>
      <div className="session-info">
        <div className="device-info">
          <DeviceIcon device={session.deviceType} />
          <span>{session.deviceName}</span>
        </div>
        <div className="location-info">
          <LocationIcon />
          <span>{session.location}</span>
        </div>
        <div className="time-info">
          <ClockIcon />
          <span>Last active {formatTimeAgo(session.lastActivity)}</span>
        </div>
      </div>
    
      <div className="session-status">
        <StatusBadge status={session.status} />
        {session.securityFlags.map(flag => (
          <SecurityFlag key={flag} type={flag} />
        ))}
      </div>
    
      {!isCurrent && onRevoke && (
        <button 
          className="revoke-button"
          onClick={onRevoke}
          aria-label="Revoke session"
        >
          <RevokeIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
```

Advanced session features:

* Device fingerprinting for enhanced security
* Geolocation-based access controls
* Session transfer between devices
* Emergency session lockdown
* Session analytics and insights

```

### Task 5.4.4: Secure File Handling Implementation
**Prompt for Cascade:**
```

Implement comprehensive secure file handling with encryption and access controls.

Location: `backend/app/security/SecureFileHandler.py`

Requirements:

1. End-to-end file encryption with key management
2. Secure file storage with access logging
3. File integrity verification and checksums
4. Secure temporary file handling
5. Access control with fine-grained permissions
6. Audit logging for all file operations
7. Secure file deletion with data wiping

Secure file handling architecture:

```python
from typing import Dict, List, Optional, BinaryIO
import os
import hashlib
import secrets
from pathlib import Path
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import tempfile
import shutil
from dataclasses import dataclass
from enum import Enum

class FilePermission(Enum):
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    SHARE = "share"
    DOWNLOAD = "download"

@dataclass
class SecureFile:
    file_id: str
    original_name: str
    encrypted_path: str
    size: int
    checksum: str
    encryption_key_id: str
    owner_id: str
    permissions: Dict[str, List[FilePermission]]
    created_at: datetime
    accessed_at: Optional[datetime]
    metadata: Dict[str, any]

class FileEncryption:
    """Handle file encryption and decryption operations."""
  
    def __init__(self, key_manager: 'KeyManager'):
        self.key_manager = key_manager
      
    def encrypt_file(self, file_path: Path, owner_id: str) -> Tuple[str, str]:
        """Encrypt file and return encrypted path and key ID."""
      
        # Generate file-specific encryption key
        file_key = self.key_manager.generate_file_key(owner_id)
        key_id = self.key_manager.store_key(file_key, owner_id)
      
        # Create encrypted file path
        encrypted_filename = f"{secrets.token_hex(16)}.enc"
        encrypted_path = self.key_manager.get_secure_storage_path() / encrypted_filename
      
        # Encrypt file
        with open(file_path, 'rb') as infile, open(encrypted_path, 'wb') as outfile:
            # Write file header with metadata
            header = self._create_file_header(file_path, key_id)
            outfile.write(header)
          
            # Encrypt file content
            cipher = Cipher(
                algorithms.AES(file_key),
                modes.CBC(secrets.token_bytes(16))
            )
            encryptor = cipher.encryptor()
          
            # Write IV
            outfile.write(cipher.mode.initialization_vector)
          
            # Encrypt in chunks
            while True:
                chunk = infile.read(8192)
                if not chunk:
                    break
              
                # Pad last chunk if necessary
                if len(chunk) < 8192:
                    chunk = self._pad_chunk(chunk)
              
                encrypted_chunk = encryptor.update(chunk)
                outfile.write(encrypted_chunk)
          
            outfile.write(encryptor.finalize())
      
        return str(encrypted_path), key_id
  
    def decrypt_file(self, encrypted_path: str, key_id: str, 
                    output_path: Optional[Path] = None) -> Path:
        """Decrypt file and return decrypted file path."""
      
        # Get decryption key
        file_key = self.key_manager.get_key(key_id)
        if not file_key:
            raise FileDecryptionError(f"Decryption key {key_id} not found")
      
        # Create output path if not provided
        if output_path is None:
            output_path = self._create_temp_file()
      
        with open(encrypted_path, 'rb') as infile, open(output_path, 'wb') as outfile:
            # Read and verify header
            header = self._read_file_header(infile)
          
            # Read IV
            iv = infile.read(16)
          
            # Create cipher
            cipher = Cipher(algorithms.AES(file_key), modes.CBC(iv))
            decryptor = cipher.decryptor()
          
            # Decrypt in chunks
            while True:
                chunk = infile.read(8192)
                if not chunk:
                    break
              
                decrypted_chunk = decryptor.update(chunk)
                outfile.write(decrypted_chunk)
          
            final_chunk = decryptor.finalize()
            outfile.write(final_chunk)
          
            # Remove padding from last chunk
            self._remove_padding(output_path)
      
        return output_path
  
    def _create_file_header(self, file_path: Path, key_id: str) -> bytes:
        """Create encrypted file header with metadata."""
      
        header_data = {
            'version': 1,
            'key_id': key_id,
            'original_name': file_path.name,
            'original_size': file_path.stat().st_size,
            'checksum': self._calculate_file_checksum(file_path)
        }
      
        header_json = json.dumps(header_data).encode()
        header_size = len(header_json).to_bytes(4, 'big')
      
        return header_size + header_json

class SecureFileManager:
    """Manage secure file operations with access control."""
  
    def __init__(self, storage_path: Path, key_manager: 'KeyManager'):
        self.storage_path = storage_path
        self.key_manager = key_manager
        self.encryption = FileEncryption(key_manager)
        self.access_logger = FileAccessLogger()
        self.file_registry = {}  # In production, use database
      
    def store_file(self, file_path: Path, owner_id: str, 
                  metadata: Dict = None) -> SecureFile:
        """Securely store a file with encryption."""
      
        # Validate file
        self._validate_file(file_path)
      
        # Calculate file checksum
        checksum = self._calculate_file_checksum(file_path)
      
        # Encrypt file
        encrypted_path, key_id = self.encryption.encrypt_file(file_path, owner_id)
      
        # Create secure file record
        file_id = self._generate_file_id()
        secure_file = SecureFile(
            file_id=file_id,
            original_name=file_path.name,
            encrypted_path=encrypted_path,
            size=file_path.stat().st_size,
            checksum=checksum,
            encryption_key_id=key_id,
            owner_id=owner_id,
            permissions={owner_id: [FilePermission.READ, FilePermission.WRITE, 
                                  FilePermission.DELETE, FilePermission.SHARE]},
            created_at=datetime.utcnow(),
            accessed_at=None,
            metadata=metadata or {}
        )
      
        # Store in registry
        self.file_registry[file_id] = secure_file
      
        # Log file storage
        self.access_logger.log_operation(
            file_id, owner_id, 'store', 
            {'original_name': file_path.name, 'size': secure_file.size}
        )
      
        # Securely delete original file
        self._secure_delete(file_path)
      
        return secure_file
  
    def retrieve_file(self, file_id: str, user_id: str, 
                     temp_file: bool = True) -> Path:
        """Retrieve and decrypt a file."""
      
        # Check access permissions
        if not self._check_permission(file_id, user_id, FilePermission.READ):
            raise FileAccessDeniedError(f"User {user_id} cannot read file {file_id}")
      
        secure_file = self.file_registry.get(file_id)
        if not secure_file:
            raise FileNotFoundError(f"File {file_id} not found")
      
        # Create output path
        if temp_file:
            output_path = self._create_temp_file(secure_file.original_name)
        else:
            output_path = self.storage_path / 'decrypted' / secure_file.original_name
            output_path.parent.mkdir(parents=True, exist_ok=True)
      
        # Decrypt file
        decrypted_path = self.encryption.decrypt_file(
            secure_file.encrypted_path,
            secure_file.encryption_key_id,
            output_path
        )
      
        # Verify file integrity
        if not self._verify_file_integrity(decrypted_path, secure_file.checksum):
            self._secure_delete(decrypted_path)
            raise FileIntegrityError(f"File {file_id} integrity check failed")
      
        # Update access time
        secure_file.accessed_at = datetime.utcnow()
      
        # Log file access
        self.access_logger.log_operation(
            file_id, user_id, 'retrieve',
            {'temp_file': temp_file}
        )
      
        return decrypted_path
  
    def delete_file(self, file_id: str, user_id: str) -> bool:
        """Securely delete a file."""
      
        # Check delete permission
        if not self._check_permission(file_id, user_id, FilePermission.DELETE):
            raise FileAccessDeniedError(f"User {user_id} cannot delete file {file_id}")
      
        secure_file = self.file_registry.get(file_id)
        if not secure_file:
            return False
      
        # Secure delete encrypted file
        self._secure_delete(Path(secure_file.encrypted_path))
      
        # Remove encryption key
        self.key_manager.revoke_key(secure_file.encryption_key_id)
      
        # Remove from registry
        del self.file_registry[file_id]
      
        # Log deletion
        self.access_logger.log_operation(
            file_id, user_id, 'delete',
            {'original_name': secure_file.original_name}
        )
      
        return True
  
    def share_file(self, file_id: str, owner_id: str, target_user_id: str,
                  permissions: List[FilePermission]) -> bool:
        """Share file with another user."""
      
        # Check share permission
        if not self._check_permission(file_id, owner_id, FilePermission.SHARE):
            raise FileAccessDeniedError(f"User {owner_id} cannot share file {file_id}")
      
        secure_file = self.file_registry.get(file_id)
        if not secure_file:
            return False
      
        # Add permissions for target user
        secure_file.permissions[target_user_id] = permissions
      
        # Log sharing
        self.access_logger.log_operation(
            file_id, owner_id, 'share',
            {'target_user': target_user_id, 'permissions': [p.value for p in permissions]}
        )
      
        return True
  
    def _secure_delete(self, file_path: Path) -> None:
        """Securely delete file with multiple overwrite passes."""
      
        if not file_path.exists():
            return
      
        file_size = file_path.stat().st_size
      
        # Multiple overwrite passes
        patterns = [
            b'\x00',  # Zeros
            b'\xFF',  # Ones
            secrets.token_bytes(1)[0:1]  # Random
        ]
      
        for pattern in patterns:
            with open(file_path, 'r+b') as f:
                for _ in range(0, file_size, 4096):
                    chunk_size = min(4096, file_size)
                    f.write(pattern * chunk_size)
                f.flush()
                os.fsync(f.fileno())
      
        # Finally delete the file
        file_path.unlink()
  
    def _check_permission(self, file_id: str, user_id: str, 
                         permission: FilePermission) -> bool:
        """Check if user has specific permission for file."""
      
        secure_file = self.file_registry.get(file_id)
        if not secure_file:
            return False
      
        user_permissions = secure_file.permissions.get(user_id, [])
        return permission in user_permissions

class FileAccessLogger:
    """Log all file access operations for audit purposes."""
  
    def __init__(self, log_file: Path = None):
        self.log_file = log_file or Path('logs/file_access.log')
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
      
    def log_operation(self, file_id: str, user_id: str, operation: str, 
                     metadata: Dict = None):
        """Log file operation with full context."""
      
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'file_id': file_id,
            'user_id': user_id,
            'operation': operation,
            'ip_address': self._get_client_ip(),
            'user_agent': self._get_user_agent(),
            'metadata': metadata or {}
        }
      
        # Write to log file
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
      
        # Send to SIEM system if configured
        self._send_to_siem(log_entry)
  
    def _send_to_siem(self, log_entry: Dict):
        """Send log entry to SIEM system for analysis."""
        # Implementation depends on SIEM system
        pass

class KeyManager:
    """Manage encryption keys for secure file storage."""
  
    def __init__(self, key_storage_path: Path):
        self.key_storage_path = key_storage_path
        self.master_key = self._load_or_create_master_key()
      
    def generate_file_key(self, owner_id: str) -> bytes:
        """Generate unique encryption key for file."""
        return secrets.token_bytes(32)  # 256-bit key
  
    def store_key(self, key: bytes, owner_id: str) -> str:
        """Store encryption key securely."""
        key_id = secrets.token_hex(16)
      
        # Encrypt key with master key
        fernet = Fernet(self.master_key)
        encrypted_key = fernet.encrypt(key)
      
        # Store encrypted key
        key_file = self.key_storage_path / f"{key_id}.key"
        key_file.write_bytes(encrypted_key)
      
        return key_id
  
    def get_key(self, key_id: str) -> Optional[bytes]:
        """Retrieve and decrypt encryption key."""
        key_file = self.key_storage_path / f"{key_id}.key"
      
        if not key_file.exists():
            return None
      
        encrypted_key = key_file.read_bytes()
      
        # Decrypt with master key
        fernet = Fernet(self.master_key)
        try:
            return fernet.decrypt(encrypted_key)
        except Exception:
            return None
  
    def revoke_key(self, key_id: str) -> bool:
        """Securely delete encryption key."""
        key_file = self.key_storage_path / f"{key_id}.key"
      
        if key_file.exists():
            # Overwrite before deletion
            key_file.write_bytes(secrets.token_bytes(key_file.stat().st_size))
            key_file.unlink()
            return True
      
        return False
```

File handling security features:

* Hardware Security Module (HSM) integration for key storage
* File versioning with encrypted snapshots
* Automatic key rotation and re-encryption
* Data loss prevention (DLP) integration
* Compliance reporting for regulatory requirements
* Forensic analysis capabilities for security incidents

```

## Phase 5 Success Criteria

### 5.1 Performance Optimization
- [ ] Application loads within 2 seconds on 3G networks
- [ ] Bundle size reduced by 50% through code splitting
- [ ] Service worker provides offline functionality for core features
- [ ] Memory usage stays below 500MB during typical workflows
- [ ] Image lazy loading improves gallery scroll performance by 60%
- [ ] Cache hit rate exceeds 70% for frequently accessed content
- [ ] Progressive loading shows content within 1 second
- [ ] Large image handling (50MB+) works without browser crashes

### 5.2 Advanced UI Features
- [ ] All 50+ keyboard shortcuts work across browsers and platforms
- [ ] Drag and drop operations complete successfully 95%+ of the time
- [ ] Context menus appear within 100ms of right-click
- [ ] Mobile interface provides equivalent functionality to desktop
- [ ] Touch gestures work correctly on tablets and phones
- [ ] Responsive design adapts smoothly to all screen sizes
- [ ] Accessibility compliance passes WCAG 2.1 AA standards
- [ ] UI animations maintain 60fps on standard hardware

### 5.3 Export & Integration
- [ ] Export system supports all 7 major image formats
- [ ] Batch export completes 1000 images in under 10 minutes
- [ ] Cloud storage sync maintains 99.9% reliability
- [ ] Social media sharing maintains quality standards
- [ ] Export presets reduce configuration time by 80%
- [ ] File format conversion preserves image quality
- [ ] Export queue manages 100+ concurrent jobs
- [ ] Integration APIs respond within 2 seconds

### 5.4 Security & Validation
- [ ] File validation catches 100% of known malware samples
- [ ] Rate limiting prevents abuse without affecting legitimate users
- [ ] Session management prevents hijacking and replay attacks
- [ ] File encryption protects data with AES-256 encryption
- [ ] Access logging captures all file operations
- [ ] Security audit passes without critical vulnerabilities
- [ ] DDoS protection handles 10,000 requests/second attacks
- [ ] Multi-factor authentication integrates seamlessly

### Technical Performance Metrics
- [ ] Time to Interactive (TTI) under 3 seconds
- [ ] First Contentful Paint (FCP) under 1.5 seconds
- [ ] Largest Contentful Paint (LCP) under 2.5 seconds
- [ ] Cumulative Layout Shift (CLS) under 0.1
- [ ] API response times under 200ms for 95th percentile
- [ ] Database queries optimized for sub-100ms response
- [ ] Memory leaks eliminated in 24-hour stress tests
- [ ] CPU usage under 50% during normal operations

### User Experience Validation
- [ ] User task completion rate exceeds 90%
- [ ] User satisfaction scores above 4.5/5.0
- [ ] Feature discoverability through UI alone exceeds 80%
- [ ] Help system resolves 90% of user questions
- [ ] Error messages provide actionable guidance
- [ ] Workflow efficiency improves by 40% over existing tools
- [ ] New user onboarding completes in under 10 minutes
- [ ] Expert users can complete complex tasks via keyboard shortcuts

### Reliability and Robustness
- [ ] Uptime exceeds 99.9% under normal conditions
- [ ] Graceful degradation during service outages
- [ ] Data consistency maintained during concurrent operations
- [ ] Error recovery successful for 95% of failed operations
- [ ] Cross-browser compatibility across Chrome, Firefox, Safari, Edge
- [ ] Mobile app performance equivalent to desktop
- [ ] Offline functionality maintains core editing capabilities
- [ ] System handles peak loads 10x normal capacity

## Testing Strategy

### Performance Testing
- **Load Testing**: Simulate 1000+ concurrent users with realistic usage patterns
- **Stress Testing**: Push system beyond normal capacity to identify breaking points
- **Endurance Testing**: 72-hour continuous operation under moderate load
- **Spike Testing**: Sudden traffic spikes to test auto-scaling
- **Volume Testing**: Large dataset processing (10,000+ images)
- **Network Testing**: Various connection speeds and reliability conditions

### Security Testing
- **Penetration Testing**: External security firm assessment
- **Vulnerability Scanning**: Automated scanning for known vulnerabilities
- **Authentication Testing**: Session management and access control validation
- **Encryption Testing**: Verify data protection in transit and at rest
- **Input Validation**: Fuzzing and malformed data injection testing
- **Social Engineering**: Phishing and user manipulation resistance

### Usability Testing
- **A/B Testing**: Compare interface variations for optimal user experience
- **User Journey Testing**: Complete workflow validation with real users
- **Accessibility Testing**: Screen reader and keyboard navigation validation
- **Cross-Platform Testing**: Consistent experience across devices and browsers
- **Performance Perception**: User-perceived performance measurement
- **Error Scenario Testing**: User behavior during system errors

### Automated Testing
- **Unit Tests**: 90%+ code coverage for all critical functions
- **Integration Tests**: API and component interaction validation
- **E2E Tests**: Complete user workflows from UI to database
- **Visual Regression**: Automated screenshot comparison
- **Performance Regression**: Automated performance benchmark comparison
- **Security Regression**: Automated security scan integration

## Deployment Considerations

### Production Environment Requirements
- **Compute**: 8+ CPU cores, 32GB RAM minimum per application server
- **Storage**: 1TB+ NVMe SSD for application, 10TB+ for user data
- **Network**: 10Gbps bandwidth with CDN integration
- **Database**: PostgreSQL cluster with read replicas
- **Cache**: Redis cluster for session and application caching
- **Load Balancer**: High-availability load balancer with SSL termination

### Monitoring and Observability
- **Application Performance Monitoring**: Response times, error rates, throughput
- **Infrastructure Monitoring**: CPU, memory, disk, network utilization
- **User Experience Monitoring**: Real user monitoring (RUM) and synthetic testing
- **Security Monitoring**: SIEM integration with threat detection
- **Business Metrics**: User engagement, feature adoption, conversion rates
- **Alerting**: PagerDuty integration for critical issues

### Disaster Recovery
- **Backup Strategy**: Automated daily backups with 30-day retention
- **Data Replication**: Real-time replication to secondary data center
- **Recovery Testing**: Monthly disaster recovery drills
- **Failover Procedures**: Automated failover with <5 minute RTO
- **Data Protection**: Encryption at rest and in transit
- **Compliance**: GDPR, HIPAA, and industry-specific requirements

This completes the comprehensive Phase 5 implementation plan. The phase transforms Omnimage into a production-ready, enterprise-grade application with advanced performance optimizations, sophisticated user experience features, robust export capabilities, and enterprise-level security measures.
```
