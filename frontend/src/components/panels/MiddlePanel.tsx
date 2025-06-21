import { useAppState } from '../../hooks/useAppState';
import { useImageStore } from '../../stores/imageStore';
import FileDropZone from '../ui/FileDropZone';
import ImageViewer, { ViewerTransform } from './MiddlePanel/ImageViewer';
import ImageToolbar from './MiddlePanel/ImageToolbar';
import ImageSavePanel from './MiddlePanel/ImageSavePanel';
import AnnotationToolbar from './MiddlePanel/AnnotationToolbar';
import UnsavedChangesDialog from '../ui/UnsavedChangesDialog';
import { Annotation } from './MiddlePanel/AnnotationLayer';
import { useState, useEffect, useRef } from 'react';
import { persistenceService, ExportOptions } from '../../services/persistenceService';
import { apiService } from '../../services/apiService';
import Button from '../ui/Button';

export default function MiddlePanel() {
  const { images, selected, setSelection } = useAppState();
  const { setHasModifications, getHasModifications, clearModifications } = useImageStore();
  const firstId = Array.from(selected)[0];
  const image = images.find((i) => i.id === firstId);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [transform, setTransform] = useState<ViewerTransform>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    flipX: false,
    flipY: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [history, setHistory] = useState<ViewerTransform[]>([]);
  const [future, setFuture] = useState<ViewerTransform[]>([]);
  const imageViewerRef = useRef<any>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'ruler' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'freehand'>('select');
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingImageSwitch, setPendingImageSwitch] = useState<{currentId: string, newId: string} | null>(null);
  
  const hasModifications = image ? getHasModifications(image.id) : false;

  // Log whenever active viewer selection changes
  useEffect(() => {
    console.debug('MiddlePanel.selection', { selected: Array.from(selected) });
  }, [selected]);

  // Load saved state when image changes
  useEffect(() => {
    if (image?.id) {
      const savedState = persistenceService.loadImageState(image.id);
      if (savedState) {
        setAnnotations(savedState.annotations);
        setTransform(savedState.transform);
      } else {
        setAnnotations([]);
        setTransform({
          zoom: 1,
          panX: 0,
          panY: 0,
          rotation: 0,
          flipX: false,
          flipY: false
        });
      }
    }
  }, [image?.id]);

  const handleAnnotationsChange = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
    if (image?.id) {
      persistenceService.saveImageState(image.id, transform, newAnnotations);
    }
  };

  const handleTransformChange = (newTransform: ViewerTransform) => {
    setTransform(newTransform);
    if (image?.id) {
      persistenceService.saveImageState(image.id, newTransform, annotations);
    }
  };

  const handleModification = () => {
    if (image?.id) {
      setHasModifications(image.id, true);
    }
  };

  const handleSaveImage = async () => {
    if (!image?.id || !imageViewerRef.current) return;
    
    const blob = await imageViewerRef.current.getCanvasBlob();
    if (blob) {
      await apiService.saveImage(image.id, blob);
      clearModifications(image.id);
    }
  };

  const handleSaveCopy = async () => {
    if (!image?.id || !imageViewerRef.current) return;
    
    const blob = await imageViewerRef.current.getCanvasBlob();
    if (blob) {
      await apiService.saveCopyImage(image.id, blob);
    }
  };

  const handleReset = () => {
    if (image?.id) {
      clearModifications(image.id);
      setTransform({
        zoom: 1,
        panX: 0,
        panY: 0,
        rotation: 0,
        flipX: false,
        flipY: false
      });
      setAnnotations([]);
      if (imageViewerRef.current) {
        imageViewerRef.current.resetTransform();
      }
    }
  };

  const handleExport = async (options: ExportOptions) => {
    if (!image?.url) return;
    
    setIsExporting(true);
    try {
      const blob = await persistenceService.exportImageWithAnnotations(
        image.url,
        transform,
        annotations,
        options
      );
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.filename.split('.')[0]}_processed.${options.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle drag and drop from gallery
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleUnsavedChanges = async (currentId: string, newId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setPendingImageSwitch({ currentId, newId });
      setShowUnsavedDialog(true);
      
      // Store resolve function for dialog handlers
      (window as any)._unsavedChangesResolve = resolve;
    });
  };

  const handleSaveAndSwitch = async () => {
    if (!pendingImageSwitch) return;
    
    try {
      await handleSaveImage();
      setShowUnsavedDialog(false);
      setPendingImageSwitch(null);
      (window as any)._unsavedChangesResolve?.(true);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDiscardAndSwitch = () => {
    if (!pendingImageSwitch) return;
    
    clearModifications(pendingImageSwitch.currentId);
    setShowUnsavedDialog(false);
    setPendingImageSwitch(null);
    (window as any)._unsavedChangesResolve?.(true);
  };

  const handleCancelSwitch = () => {
    setShowUnsavedDialog(false);
    setPendingImageSwitch(null);
    (window as any)._unsavedChangesResolve?.(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    console.debug('MiddlePanel.handleDrop', { data: e.dataTransfer.getData('text/plain') });
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const imageId = e.dataTransfer.getData('text/plain');
    if (imageId && images.find(img => img.id === imageId)) {
      // Use safe selection with unsaved changes check
      const { safeToggleSelect } = useImageStore.getState();
      await safeToggleSelect(imageId, { ctrlKey: false, shiftKey: false }, handleUnsavedChanges);
      setSelection(imageId);
    }
  };

  if (!image) {
    return (
      <div 
        className={`h-full flex items-center justify-center p-12 transition-all duration-200 ${
          isDragOver ? 'bg-[var(--selection)] border-2 border-dashed border-[var(--accent-blue)]' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="max-w-md w-full">
          <FileDropZone />
          <div className="text-center mt-4 text-sm text-[var(--text-secondary)]">
            Or drag an image from the gallery to view it here
          </div>
          {isDragOver && (
            <div className="text-center mt-2 text-sm text-[var(--accent-blue)] font-medium">
              Drop to view image
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`h-full w-full flex flex-col gap-4 p-6 overflow-auto transition-all duration-200 ${
        isDragOver ? 'bg-[var(--selection)] border-2 border-dashed border-[var(--accent-blue)]' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Toolbars - Glued to header */}
      <div className="sticky top-0 z-10 -mt-6 -mx-6">
        <ImageToolbar
          onRotateLeft={() => imageViewerRef.current?.rotate(-90)}
          onRotateRight={() => imageViewerRef.current?.rotate(90)}
          onFlipHorizontal={() => imageViewerRef.current?.flipH()}
          onFlipVertical={() => imageViewerRef.current?.flipV()}
          onFitToScreen={() => imageViewerRef.current?.fitToScreen()}
          onUndo={() => imageViewerRef.current?.handleUndo()}
          onRedo={() => imageViewerRef.current?.handleRedo()}
          onReset={() => imageViewerRef.current?.resetTransform()}
          canUndo={imageViewerRef.current?.canUndo ?? false}
          canRedo={imageViewerRef.current?.canRedo ?? false}
          hasModifications={hasModifications}
        />
        
        <AnnotationToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onUndo={() => imageViewerRef.current?.undoAnnotation()}
          onRedo={() => imageViewerRef.current?.redoAnnotation()}
          onDeleteSelected={() => imageViewerRef.current?.deleteSelectedAnnotation()}
          onClearAll={() => imageViewerRef.current?.clearAllAnnotations()}
          canUndo={imageViewerRef.current?.canUndoAnnotation ?? false}
          canRedo={imageViewerRef.current?.canRedoAnnotation ?? false}
          hasSelection={imageViewerRef.current?.hasSelection ?? false}
          hasAnnotations={imageViewerRef.current?.hasAnnotations ?? false}
        />
      </div>
      
      <div className="flex-1 w-full mt-4 rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="relative w-full h-full">
          <ImageViewer 
            ref={imageViewerRef}
            imageUrl={image.url} 
            alt={image.filename}
            onAnnotationsChange={handleAnnotationsChange}
            onTransformChange={handleTransformChange}
            onModification={handleModification}
            activeTool={activeTool}
            onToolChange={setActiveTool}
          />
        </div>
      </div>
      {/* Save Panel */}
      <ImageSavePanel
        onSave={handleSaveImage}
        onSaveCopy={handleSaveCopy}
        onReset={handleReset}
        hasModifications={hasModifications}
      />
      
      <div className="text-sm text-[var(--text-secondary)] font-mono bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border)] shadow-md">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div><span className="text-[var(--text-primary)] font-semibold">Filename:</span> {image.filename}</div>
          <div><span className="text-[var(--text-primary)] font-semibold">Model:</span> {image.model}</div>
          <div><span className="text-[var(--text-primary)] font-semibold">Provider:</span> {image.provider}</div>
          <div><span className="text-[var(--text-primary)] font-semibold">Created:</span> {image.created_at}</div>
        </div>
        
        {/* Export Controls */}
        <div className="border-t border-[var(--border)] pt-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <Button
              variant="secondary"
              onClick={() => handleExport({ format: 'png', includeAnnotations: true })}
              disabled={isExporting}
            >
              Export PNG with Annotations
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleExport({ format: 'jpeg', quality: 0.9, includeAnnotations: true })}
              disabled={isExporting}
            >
              Export JPEG with Annotations
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              onClick={() => handleExport({ format: 'png', includeAnnotations: false })}
              disabled={isExporting}
            >
              Export PNG Only
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleExport({ format: 'jpeg', quality: 0.9, includeAnnotations: false })}
              disabled={isExporting}
            >
              Export JPEG Only
            </Button>
          </div>
          {annotations.length > 0 && (
            <div className="text-xs text-[var(--text-secondary)] mt-2">
              {annotations.length} annotation{annotations.length !== 1 ? 's' : ''} • 
              Zoom: {(transform.zoom * 100).toFixed(0)}% • 
              Rotation: {transform.rotation}°
            </div>
          )}
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onSave={handleSaveAndSwitch}
        onDiscard={handleDiscardAndSwitch}
        onCancel={handleCancelSwitch}
        currentImageName={pendingImageSwitch ? images.find(img => img.id === pendingImageSwitch.currentId)?.filename : undefined}
        newImageName={pendingImageSwitch ? images.find(img => img.id === pendingImageSwitch.newId)?.filename : undefined}
      />
    </div>
  );
}
