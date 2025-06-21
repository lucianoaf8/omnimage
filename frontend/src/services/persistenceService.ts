import { ViewerTransform } from '../components/panels/MiddlePanel/ImageViewer';
import { Annotation } from '../components/panels/MiddlePanel/AnnotationLayer';

export interface ImageState {
  imageId: string;
  transform: ViewerTransform;
  annotations: Annotation[];
  timestamp: number;
  version: string;
}

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality?: number; // For JPEG, 0.1 to 1.0
  includeAnnotations: boolean;
  backgroundColor?: string;
}

class PersistenceService {
  private readonly STORAGE_KEY = 'omnimage_states';
  private readonly VERSION = '1.0.0';

  // Save image state to localStorage
  saveImageState(imageId: string, transform: ViewerTransform, annotations: Annotation[]): void {
    try {
      const states = this.loadAllStates();
      const imageState: ImageState = {
        imageId,
        transform,
        annotations,
        timestamp: Date.now(),
        version: this.VERSION
      };
      
      states[imageId] = imageState;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Failed to save image state:', error);
    }
  }

  // Load image state from localStorage
  loadImageState(imageId: string): ImageState | null {
    try {
      const states = this.loadAllStates();
      return states[imageId] || null;
    } catch (error) {
      console.error('Failed to load image state:', error);
      return null;
    }
  }

  // Load all saved states
  private loadAllStates(): Record<string, ImageState> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load states from localStorage:', error);
      return {};
    }
  }

  // Clear state for specific image
  clearImageState(imageId: string): void {
    try {
      const states = this.loadAllStates();
      delete states[imageId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Failed to clear image state:', error);
    }
  }

  // Clear all states
  clearAllStates(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear all states:', error);
    }
  }

  // Export image with annotations flattened
  async exportImageWithAnnotations(
    imageUrl: string,
    transform: ViewerTransform,
    annotations: Annotation[],
    options: ExportOptions
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        // Create a canvas for rendering
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Load the image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Calculate canvas size based on transform
          const scale = transform.zoom;
          canvas.width = img.naturalWidth * scale;
          canvas.height = img.naturalHeight * scale;

          // Set background color
          if (options.backgroundColor) {
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // Save context state
          ctx.save();

          // Apply transforms
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;

          ctx.translate(centerX, centerY);
          ctx.rotate((transform.rotation * Math.PI) / 180);
          ctx.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
          ctx.translate(-img.naturalWidth * scale / 2, -img.naturalHeight * scale / 2);

          // Draw the image
          ctx.drawImage(img, 0, 0, img.naturalWidth * scale, img.naturalHeight * scale);

          // Restore context for annotations
          ctx.restore();

          // Draw annotations if requested
          if (options.includeAnnotations) {
            this.renderAnnotationsOnCanvas(ctx, annotations, transform, canvas.width, canvas.height);
          }

          // Convert to blob
          const quality = options.format === 'jpeg' ? (options.quality || 0.9) : undefined;
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            `image/${options.format}`,
            quality
          );
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = imageUrl;
      } catch (error) {
        reject(error);
      }
    });
  }

  // Render annotations on canvas
  private renderAnnotationsOnCanvas(
    ctx: CanvasRenderingContext2D,
    annotations: Annotation[],
    transform: ViewerTransform,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    ctx.save();

    // Apply transform to annotations
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    ctx.translate(centerX, centerY);
    ctx.scale(transform.zoom, transform.zoom);
    ctx.rotate((transform.rotation * Math.PI) / 180);

    annotations.forEach(annotation => {
      ctx.save();

      // Set style
      ctx.strokeStyle = annotation.style.color;
      ctx.lineWidth = annotation.style.strokeWidth;
      ctx.fillStyle = annotation.style.fillColor || annotation.style.color;
      ctx.font = `${annotation.style.fontSize || 14}px Arial`;

      switch (annotation.type) {
        case 'ruler':
          if (annotation.points.length >= 2) {
            const [start, end] = annotation.points;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw end points
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(start.x, start.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(end.x, end.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Draw measurement text
            if (annotation.measurements?.distance) {
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2 - 10;
              ctx.fillStyle = annotation.style.color;
              ctx.textAlign = 'center';
              ctx.fillText(`${annotation.measurements.distance.toFixed(1)}px`, midX, midY);
            }
          }
          break;

        case 'rectangle':
          if (annotation.points.length >= 2) {
            const [topLeft, bottomRight] = annotation.points;
            const width = Math.abs(bottomRight.x - topLeft.x);
            const height = Math.abs(bottomRight.y - topLeft.y);
            const x = Math.min(topLeft.x, bottomRight.x);
            const y = Math.min(topLeft.y, bottomRight.y);

            ctx.fillRect(x, y, width, height);
            ctx.strokeRect(x, y, width, height);
          }
          break;

        case 'circle':
          if (annotation.points.length >= 2) {
            const [center, edge] = annotation.points;
            const radius = Math.sqrt(
              Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
            );

            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
          break;

        case 'text':
          if (annotation.points.length >= 1 && annotation.text) {
            const [textPoint] = annotation.points;
            ctx.fillStyle = annotation.style.color;
            ctx.textAlign = 'left';
            ctx.fillText(annotation.text, textPoint.x, textPoint.y);
          }
          break;

        case 'arrow':
          if (annotation.points.length >= 2) {
            const [start, end] = annotation.points;
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const arrowLength = 10;
            const arrowAngle = Math.PI / 6;

            // Draw line
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw arrowhead
            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle - arrowAngle),
              end.y - arrowLength * Math.sin(angle - arrowAngle)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle + arrowAngle),
              end.y - arrowLength * Math.sin(angle + arrowAngle)
            );
            ctx.stroke();
          }
          break;

        case 'freehand':
          if (annotation.points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
            for (let i = 1; i < annotation.points.length; i++) {
              ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
            }
            ctx.stroke();
          }
          break;
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // Save state to backend (for future implementation)
  async saveStateToBackend(imageId: string, state: ImageState): Promise<void> {
    try {
      const response = await fetch(`/api/images/${imageId}/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error(`Failed to save state: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to save state to backend:', error);
      // Fallback to localStorage
      this.saveImageState(imageId, state.transform, state.annotations);
    }
  }

  // Load state from backend (for future implementation)
  async loadStateFromBackend(imageId: string): Promise<ImageState | null> {
    try {
      const response = await fetch(`/api/images/${imageId}/state`);
      
      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        return null; // No saved state
      } else {
        throw new Error(`Failed to load state: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to load state from backend:', error);
      // Fallback to localStorage
      return this.loadImageState(imageId);
    }
  }

  // Get storage statistics
  getStorageStats(): { 
    totalStates: number; 
    storageSize: number; 
    oldestState?: Date; 
    newestState?: Date;
  } {
    try {
      const states = this.loadAllStates();
      const stateValues = Object.values(states);
      const storageSize = new Blob([JSON.stringify(states)]).size;

      if (stateValues.length === 0) {
        return { totalStates: 0, storageSize: 0 };
      }

      const timestamps = stateValues.map(s => s.timestamp);
      const oldest = new Date(Math.min(...timestamps));
      const newest = new Date(Math.max(...timestamps));

      return {
        totalStates: stateValues.length,
        storageSize,
        oldestState: oldest,
        newestState: newest
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { totalStates: 0, storageSize: 0 };
    }
  }

  // Clean up old states (keep only the most recent N states)
  cleanupOldStates(maxStates: number = 100): void {
    try {
      const states = this.loadAllStates();
      const stateEntries = Object.entries(states);

      if (stateEntries.length <= maxStates) {
        return; // No cleanup needed
      }

      // Sort by timestamp and keep the most recent ones
      stateEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const keepStates = stateEntries.slice(0, maxStates);

      const cleanedStates: Record<string, ImageState> = {};
      keepStates.forEach(([imageId, state]) => {
        cleanedStates[imageId] = state;
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cleanedStates));
    } catch (error) {
      console.error('Failed to cleanup old states:', error);
    }
  }
}

export const persistenceService = new PersistenceService();