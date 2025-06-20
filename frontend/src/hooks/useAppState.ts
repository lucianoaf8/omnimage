import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// -----------------------------
// Types
// -----------------------------

export interface ImageMeta {
  id: string;
  filename: string;
  url: string;
  thumbnail_url: string;
  prompt_id: string;
  model: string;
  provider: string;
  created_at: string;
  extension: string;
  size_mb?: number;
  status?: string;
}

export interface StatsResponse {
  total_images: number;
  providers: Record<string, number>;
  models: Record<string, number>;
  prompts: Record<string, number>;
  success_rate: number;
  status: string;
}

export interface LogLine {
  time: string;
  status: string;
  message: string;
}

interface AppState {
  images: ImageMeta[];
  setImages: (images: ImageMeta[]) => void;

  selected: Set<string>;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;

  stats?: StatsResponse;
  setStats: (stats: StatsResponse) => void;

  logs: LogLine[];
  setLogs: (logs: LogLine[]) => void;
}

export const useAppState = create<AppState>()(
  immer((set) => ({
    images: [],
    setImages: (images) => set((s) => {
      s.images = images;
    }),

    selected: new Set<string>(),
    toggleSelect: (id) => set((s) => {
      if (s.selected.has(id)) s.selected.delete(id);
      else s.selected.add(id);
    }),
    clearSelection: () => set((s) => {
      s.selected.clear();
    }),

    stats: undefined,
    setStats: (stats) => set((s) => {
      s.stats = stats;
    }),

    logs: [],
    setLogs: (logs) => set((s) => {
      s.logs = logs;
    }),
  }))
);

export type { AppState };
