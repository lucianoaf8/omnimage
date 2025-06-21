import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import AnnotationLayer, { Annotation } from './AnnotationLayer';

/**
 * Canvas-based image viewer with zoom/pan/rotation capabilities.
 * Implements Task 3.1.1 of the Phase 3 plan.
 */
export interface ViewerTransform {
  zoom: number; // 1 = 100%
  panX: number; // in canvas pixels (after scaling)
  panY: number;
  rotation: number; // degrees
  flipX: boolean;
  flipY: boolean;
}

type ToolType = 'select' | 'ruler' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'freehand';

export interface ImageViewerProps {
  imageUrl?: string;
  alt?: string;
  onTransformChange?: (transform: ViewerTransform) => void;
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  onModification?: () => void;
  activeTool?: ToolType;
  onToolChange?: (tool: ToolType) => void;
}

const MIN_ZOOM = 0.1; // 10%
const MAX_ZOOM = 10; // 1000%

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ImageViewer = React.forwardRef<any, ImageViewerProps>(({ imageUrl, alt, onTransformChange, onAnnotationsChange, onModification, activeTool, onToolChange }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [transform, setTransform] = useState<ViewerTransform>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    flipX: false,
    flipY: false,
  });
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const annotationLayerRef = useRef<any>(null);

  // history stacks for undo/redo
  const [history, setHistory] = useState<ViewerTransform[]>([]);
  const [future, setFuture] = useState<ViewerTransform[]>([]);

  const pushHistory = useCallback(
    (prev: ViewerTransform) => setHistory((h) => [...h.slice(-29), prev]),
    []
  );

  const applyTransform = useCallback(
    (updater: (prev: ViewerTransform) => ViewerTransform) => {
      setTransform((prev) => {
        const next = updater(prev);
        pushHistory(prev);
        setFuture([]);
        onModification?.();
        return next;
      });
    },
    [pushHistory, onModification]
  );

  // Load image whenever URL changes
  useEffect(() => {
    if (!imageUrl) {
      setImg(null);
      return;
    }
    const image = new Image();
    setLoading(true);
    setError(null);
    image.onload = () => {
      setImg(image);
      setLoading(false);
    };
    image.onerror = () => {
      setError('Failed to load image');
      setLoading(false);
    };
    image.src = imageUrl;
  }, [imageUrl]);

  // Fit to screen when img loaded or container resized
  const fitToScreen = useCallback(() => {
    const container = containerRef.current;
    const image = img;
    if (!container || !image) return;
    const { clientWidth: cw, clientHeight: ch } = container;
    const scale = Math.min(cw / image.naturalWidth, ch / image.naturalHeight);
    applyTransform((t) => ({ ...t, zoom: clamp(scale, MIN_ZOOM, MAX_ZOOM), panX: 0, panY: 0 }));
  }, [img]);

  // Draw image to canvas whenever transform or img or canvas size changes
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth, clientHeight } = canvas;
    if (canvas.width !== Math.floor(clientWidth * dpr) || canvas.height !== Math.floor(clientHeight * dpr)) {
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
    }

    // Clear
    ctx.save();
    ctx.scale(dpr, dpr); // scale back to CSS pixels
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    // Center point
    const cx = clientWidth / 2 + transform.panX;
    const cy = clientHeight / 2 + transform.panY;

    ctx.translate(cx, cy);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.zoom, transform.zoom);
    // flips
    ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
    ctx.translate(-img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0);

    ctx.restore();
  }, [img, transform]);

  // Redraw when dependencies change
  useEffect(() => {
    draw();
    onTransformChange?.(transform);
  }, [draw, transform, onTransformChange]);

  // Resize observer to redraw on container resize
  useLayoutEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        setContainerSize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
      draw();
    };
    
    // Initial size measurement
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Enhanced pan & zoom interactions with touch support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDragging = false;
    let spacePressed = false;
    let lastX = 0;
    let lastY = 0;
    let lastTouchDistance = 0;
    let lastTouchCenter = { x: 0, y: 0 };
    let touchStartTime = 0;

    // Mouse wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { offsetX, offsetY, deltaY } = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = direction > 0 ? 1.1 : 0.9;

      applyTransform((prev) => {
        const newZoom = clamp(prev.zoom * factor, MIN_ZOOM, MAX_ZOOM);
        // Adjust pan so that the point under cursor stays in place
        const rect = canvas.getBoundingClientRect();
        const dx = offsetX - rect.width / 2 - prev.panX;
        const dy = offsetY - rect.height / 2 - prev.panY;
        const scale = newZoom / prev.zoom;
        const newPanX = prev.panX - dx * (scale - 1);
        const newPanY = prev.panY - dy * (scale - 1);
        return { ...prev, zoom: newZoom, panX: newPanX, panY: newPanY };
      });
    };

    // Mouse interactions
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // left button only
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      applyTransform((prev) => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy }));
    };

    const handleMouseUp = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };

    const handleMouseLeave = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };

    // Touch interactions
    const getTouchDistance = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const touch1 = touches[0];
      const touch2 = touches[1];
      return Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
    };

    const getTouchCenter = (touches: TouchList) => {
      if (touches.length === 1) {
        return { x: touches[0].clientX, y: touches[0].clientY };
      }
      const touch1 = touches[0];
      const touch2 = touches[1];
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartTime = Date.now();
      const touches = e.touches;
      
      if (touches.length === 1) {
        // Single finger - pan
        isDragging = true;
        lastX = touches[0].clientX;
        lastY = touches[0].clientY;
      } else if (touches.length === 2) {
        // Two fingers - pinch zoom
        isDragging = false;
        lastTouchDistance = getTouchDistance(touches);
        lastTouchCenter = getTouchCenter(touches);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touches = e.touches;
      
      if (touches.length === 1 && isDragging) {
        // Single finger pan
        const dx = touches[0].clientX - lastX;
        const dy = touches[0].clientY - lastY;
        lastX = touches[0].clientX;
        lastY = touches[0].clientY;
        applyTransform((prev) => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy }));
      } else if (touches.length === 2) {
        // Two finger pinch zoom
        const currentDistance = getTouchDistance(touches);
        const currentCenter = getTouchCenter(touches);
        
        if (lastTouchDistance > 0) {
          const scale = currentDistance / lastTouchDistance;
          const rect = canvas.getBoundingClientRect();
          
          applyTransform((prev) => {
            const newZoom = clamp(prev.zoom * scale, MIN_ZOOM, MAX_ZOOM);
            
            // Adjust pan to zoom towards touch center
            const centerX = currentCenter.x - rect.left;
            const centerY = currentCenter.y - rect.top;
            const dx = centerX - rect.width / 2 - prev.panX;
            const dy = centerY - rect.height / 2 - prev.panY;
            const zoomScale = newZoom / prev.zoom;
            const newPanX = prev.panX - dx * (zoomScale - 1);
            const newPanY = prev.panY - dy * (zoomScale - 1);
            
            return { ...prev, zoom: newZoom, panX: newPanX, panY: newPanY };
          });
        }
        
        // Update for next iteration
        lastTouchDistance = currentDistance;
        lastTouchCenter = currentCenter;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const touchDuration = Date.now() - touchStartTime;
      
      if (e.touches.length === 0) {
        isDragging = false;
        lastTouchDistance = 0;
        
        // Double tap to fit screen (quick successive taps)
        if (touchDuration < 300) {
          const now = Date.now();
          const lastTap = canvas.dataset.lastTap ? parseInt(canvas.dataset.lastTap) : 0;
          if (now - lastTap < 300) {
            fitToScreen();
          }
          canvas.dataset.lastTap = now.toString();
        }
      }
    };

    // Enhanced keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case '+':
        case '=':
          e.preventDefault();
          applyTransform((prev) => ({ ...prev, zoom: clamp(prev.zoom * 1.2, MIN_ZOOM, MAX_ZOOM) }));
          break;
        case '-':
        case '_':
          e.preventDefault();
          applyTransform((prev) => ({ ...prev, zoom: clamp(prev.zoom * 0.8, MIN_ZOOM, MAX_ZOOM) }));
          break;
        case '0':
          e.preventDefault();
          fitToScreen();
          break;
        case '1':
          e.preventDefault();
          applyTransform((prev) => ({ ...prev, zoom: 1, panX: 0, panY: 0 }));
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            applyTransform((prev) => ({ ...prev, rotation: 0, flipX: false, flipY: false }));
          } else {
            rotate(90);
          }
          break;
        case 'l':
          rotate(-90);
          break;
        case 'h':
          flipH();
          break;
        case 'v':
          flipV();
          break;
        case ' ':
          e.preventDefault();
          spacePressed = true;
          canvas.style.cursor = 'grab';
          break;
        case 'arrowup':
          e.preventDefault();
          applyTransform((prev) => ({ ...prev, panY: prev.panY + 20 }));
          break;
        case 'arrowdown':
          e.preventDefault();
          applyTransform((prev) => ({ ...prev, panY: prev.panY - 20 }));
          break;
        case 'arrowleft':
          e.preventDefault();
          applyTransform((prev) => ({ ...prev, panX: prev.panX + 20 }));
          break;
        case 'arrowright':
          e.preventDefault();
          applyTransform((prev) => ({ ...prev, panX: prev.panX - 20 }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        spacePressed = false;
        canvas.style.cursor = isDragging ? 'grabbing' : 'default';
      }
    };

    // Event listeners
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('dblclick', fitToScreen);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Set initial cursor
    canvas.style.cursor = 'grab';

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('dblclick', fitToScreen);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [applyTransform, fitToScreen, rotate, flipH, flipV]);

  // undo / redo handlers
  const handleUndo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [...f, transform]);
      setTransform(prev);
      return h.slice(0, -1);
    });
  };
  const handleRedo = () => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[f.length - 1];
      pushHistory(transform);
      setTransform(next);
      return f.slice(0, -1);
    });
  };

  function rotate(deg: number) {
    applyTransform((p) => ({ ...p, rotation: p.rotation + deg }));
}
  function flipH() {
    applyTransform((p) => ({ ...p, flipX: !p.flipX }));
}
  function flipV() {
    applyTransform((p) => ({ ...p, flipY: !p.flipY }));
}

  // When image loads, fit to screen initially
  useEffect(() => {
    if (img) fitToScreen();
  }, [img, fitToScreen]);

  // Expose toolbar functions
  React.useImperativeHandle(ref, () => ({
    rotate,
    flipH,
    flipV,
    fitToScreen,
    handleUndo,
    handleRedo,
    resetTransform: () => {
      applyTransform(() => ({
        zoom: 1,
        panX: 0,
        panY: 0,
        rotation: 0,
        flipX: false,
        flipY: false
      }));
    },
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    getCanvasBlob: async (): Promise<Blob | null> => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    },
    // Annotation functions
    undoAnnotation: () => annotationLayerRef.current?.undoAnnotation(),
    redoAnnotation: () => annotationLayerRef.current?.redoAnnotation(),
    deleteSelectedAnnotation: () => annotationLayerRef.current?.deleteSelectedAnnotation(),
    clearAllAnnotations: () => annotationLayerRef.current?.clearAllAnnotations(),
    canUndoAnnotation: annotationLayerRef.current?.canUndo ?? false,
    canRedoAnnotation: annotationLayerRef.current?.canRedo ?? false,
    hasSelection: annotationLayerRef.current?.hasSelection ?? false,
    hasAnnotations: annotationLayerRef.current?.hasAnnotations ?? false
  }));

  return (
    <div ref={containerRef} className="relative w-full h-full select-none bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white">Loading...</div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">{error}</div>
      )}

      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Annotation Layer */}
      {img && containerSize.width > 0 && containerSize.height > 0 && (
        <AnnotationLayer
          ref={annotationLayerRef}
          transform={transform}
          containerWidth={containerSize.width}
          containerHeight={containerSize.height}
          imageNaturalWidth={img.naturalWidth}
          imageNaturalHeight={img.naturalHeight}
          onAnnotationsChange={onAnnotationsChange}
          activeTool={activeTool}
          onToolChange={onToolChange}
        />
      )}
      
      {/* Overlay info */}
      <div className="absolute bottom-4 right-4 px-3 py-2 text-sm bg-black/70 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/20">
        <span className="font-medium">{((transform.zoom || 0) * 100).toFixed(0)}%</span>
        {img && (
          <span className="text-white/80 ml-2">• {img.naturalWidth}×{img.naturalHeight}</span>
        )}
      </div>
      
      {/* Alt text for accessibility */}
      <span className="sr-only">{alt}</span>
    </div>
  );
});

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
