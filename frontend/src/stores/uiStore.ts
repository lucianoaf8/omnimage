import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiStoreState {
  // panel sizes
  leftWidth: number;
  rightWidth: number;
  setLeftWidth: (w: number) => void;
  setRightWidth: (w: number) => void;

  // panel collapsed states (by id)
  collapsed: Record<string, boolean>;
  toggleCollapse: (key: string) => void;

  // theme (mirror of themeService)
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;

  // generic loading flag
  loading: boolean;
  setLoading: (v: boolean) => void;
}

export const useUiStore = create<UiStoreState>()(
  persist(
    immer<UiStoreState>((set) => ({
    leftWidth: 300,
    rightWidth: 340,
    setLeftWidth: (w) => set((s) => {
      s.leftWidth = w;
    }),
    setRightWidth: (w) => set((s) => {
      s.rightWidth = w;
    }),

    collapsed: {},
    toggleCollapse: (key) => set((s) => {
      s.collapsed[key] = !s.collapsed[key];
    }),

    theme: 'dark',
    setTheme: (t) => set((s) => {
      s.theme = t;
    }),

    loading: false,
    setLoading: (v) => set((s) => {
      s.loading = v;
    }),
  })),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        leftWidth: state.leftWidth,
        rightWidth: state.rightWidth,
        collapsed: state.collapsed,
        theme: state.theme,
      }),
    }
  )
);
