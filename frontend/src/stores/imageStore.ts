import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ImageMeta } from '../services/apiService';

interface ImageStoreState {
  images: ImageMeta[];
  setImages: (imgs: ImageMeta[]) => void;

  selected: Set<string>;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
}

export const useImageStore = create<ImageStoreState>()(
  immer((set) => ({
    images: [],
    setImages: (imgs) => set((s) => {
      s.images = imgs;
    }),
    selected: new Set<string>(),
    toggleSelect: (id) => set((s) => {
      if (s.selected.has(id)) s.selected.delete(id);
      else s.selected.add(id);
    }),
    clearSelection: () => set((s) => {
      s.selected.clear();
    }),
  }))
);
