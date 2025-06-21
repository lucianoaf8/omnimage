import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ImageMeta } from '../services/apiService';

interface ImageStoreState {
  images: ImageMeta[];
  setImages: (imgs: ImageMeta[]) => void;

  selected: Set<string>;
  lastSelected: string | null;
  selectMode: 'single' | 'multiple';
  toggleSelect: (id: string, event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }) => void;
  selectRange: (startId: string, endId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkDownload: (ids: string[]) => Promise<void>;

  // Image modification tracking
  modifications: Map<string, boolean>;
  setHasModifications: (imageId: string, hasModifications: boolean) => void;
  getHasModifications: (imageId: string) => boolean;
  clearModifications: (imageId: string) => void;
  
  // Safe image selection with unsaved changes check
  safeToggleSelect: (id: string, event?: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean }, onUnsavedChanges?: (currentId: string, newId: string) => Promise<boolean>) => Promise<void>;
}

export const useImageStore = create<ImageStoreState>()(
  immer((set, get) => ({
    images: [],
    setImages: (imgs) => set((s) => {
      s.images = imgs;
    }),
    selected: new Set<string>(),
    lastSelected: null,
    selectMode: 'single',
    modifications: new Map<string, boolean>(),
    
    toggleSelect: (id, event) => set((s) => {
      const isCtrl = event?.ctrlKey || event?.metaKey;
      const isShift = event?.shiftKey;
      // Work on a fresh Set to make sure state reference changes
      let newSelected = new Set<string>(s.selected);
          
      if (isShift && s.lastSelected) {
        // Range selection
        const images = get().images;
        const startIndex = images.findIndex(img => img.id === s.lastSelected);
        const endIndex = images.findIndex(img => img.id === id);
    
        if (startIndex !== -1 && endIndex !== -1) {
          const start = Math.min(startIndex, endIndex);
          const end = Math.max(startIndex, endIndex);
          for (let i = start; i <= end; i++) {
            newSelected.add(images[i].id);
          }
          s.selectMode = 'multiple';
        }
      } else if (isCtrl) {
        // Multi-select
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        s.selectMode = 'multiple';
        s.lastSelected = id;
      } else {
        // Single select
        newSelected = new Set([id]);
        s.selectMode = 'single';
        s.lastSelected = id;
      }
      s.selected = newSelected;
      console.debug('imageStore.toggleSelect', { id, selected: Array.from(newSelected) });
    }),
    
    selectRange: (startId, endId) => set((s) => {
      const images = get().images;
      const startIndex = images.findIndex(img => img.id === startId);
      const endIndex = images.findIndex(img => img.id === endId);
      
      if (startIndex !== -1 && endIndex !== -1) {
        const start = Math.min(startIndex, endIndex);
        const end = Math.max(startIndex, endIndex);
        const newSelected = new Set<string>();
        for (let i = start; i <= end; i++) {
          newSelected.add(images[i].id);
        }
        s.selected = newSelected;
        s.selectMode = 'multiple';
      console.debug('imageStore.selectRange', { startId, endId, selected: Array.from(newSelected) });
      }
    }),
    
    selectAll: () => set((s) => {
      const images = get().images;
      const newSelected = new Set<string>();
      images.forEach(img => newSelected.add(img.id));
      s.selected = newSelected;
      s.selectMode = 'multiple';
      console.debug('imageStore.selectAll', { selected: Array.from(newSelected) });
    }),
    
    clearSelection: () => set((s) => {
      s.selected = new Set();
      console.debug('imageStore.clearSelection');
      s.lastSelected = null;
      s.selectMode = 'single';
    }),
    
    bulkDelete: async (ids) => {
      // TODO: Implement API call for bulk delete
      try {
        const deletePromises = ids.map(id => 
          fetch(`/api/image/${id}`, { method: 'DELETE' })
        );
        await Promise.all(deletePromises);
        
        // Remove from local state
        set((s) => {
          s.images = s.images.filter(img => !ids.includes(img.id));
          ids.forEach(id => s.selected.delete(id));
        });
      } catch (error) {
        console.error('Bulk delete failed:', error);
        throw error;
      }
    },
    
    bulkDownload: async (ids) => {
      try {
        const response = await fetch('/api/images/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageIds: ids }),
        });
        
        if (!response.ok) {
          throw new Error('Bulk download failed');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `images_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Bulk download failed:', error);
        throw error;
      }
    },

    // Image modification tracking
    setHasModifications: (imageId, hasModifications) => set((s) => {
      s.modifications.set(imageId, hasModifications);
    }),

    getHasModifications: (imageId) => {
      return get().modifications.get(imageId) ?? false;
    },

    clearModifications: (imageId) => set((s) => {
      s.modifications.delete(imageId);
    }),

    // Safe image selection with unsaved changes check
    safeToggleSelect: async (id, event, onUnsavedChanges) => {
      const state = get();
      const currentSelected = Array.from(state.selected)[0]; // Get first selected image
      
      // Check if current image has unsaved modifications
      if (currentSelected && currentSelected !== id && state.modifications.get(currentSelected)) {
        if (onUnsavedChanges) {
          const shouldProceed = await onUnsavedChanges(currentSelected, id);
          if (!shouldProceed) {
            return; // Don't switch images
          }
        }
      }
      
      // Proceed with normal selection
      state.toggleSelect(id, event);
    },
  }))
);
