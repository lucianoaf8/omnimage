/**
 * Theme management service – converted to TypeScript and adapted for Tailwind.
 */

export const THEME_STORAGE_KEY = 'omnimage-theme';
export const THEME_ATTRIBUTE = 'data-theme';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

interface ThemeColors {
  [key: string]: string;
}

interface ThemeConfigItem {
  name: string;
  icon: string;
  colors: ThemeColors;
}

export const THEME_CONFIG: Record<Theme, ThemeConfigItem> = {
  [Theme.DARK]: {
    name: 'Dark',
    icon: '🌙',
    colors: {
      'bg-primary': '#0D1117',
      'bg-secondary': '#161B22',
      'bg-tertiary': '#21262D',
      'text-primary': '#F0F6FC',
      'text-secondary': '#8B949E',
      'accent-blue': '#00D9FF',
      success: '#00D9FF',
      warning: '#FFC107',
      error: '#FF5555',
      processing: '#FF8C00',
      border: '#30363D',
      'glass-bg': 'rgba(33, 38, 45, 0.8)',
      glow: '0 0 20px rgba(0, 217, 255, 0.3)',
      selection: 'rgba(0, 217, 255, 0.2)',
    },
  },
  [Theme.LIGHT]: {
    name: 'Light',
    icon: '☀️',
    colors: {
      'bg-primary': '#FFFFFF',
      'bg-secondary': '#F6F8FA',
      'bg-tertiary': '#FFFFFF',
      'text-primary': '#24292F',
      'text-secondary': '#656D76',
      'accent-blue': '#00D9FF',
      success: '#00D9FF',
      warning: '#FFC107',
      error: '#FF5555',
      processing: '#FF8C00',
      border: '#D0D7DE',
      'glass-bg': 'rgba(246, 248, 250, 0.8)',
      glow: '0 0 20px rgba(0, 217, 255, 0.2)',
      selection: 'rgba(0, 217, 255, 0.1)',
    },
  },
};

class ThemeService {
  private currentTheme: Theme;
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.initialize();
  }

  private initialize() {
    this.applyTheme(this.currentTheme);
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', this.handleSystemThemeChange.bind(this));
    }
  }

  private getSystemTheme(): Theme {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
  }

  private getStoredTheme(): Theme | null {
    try {
      return (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || null;
    } catch {
      return null;
    }
  }

  private setStoredTheme(theme: Theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }

  private applyTheme(theme: Theme) {
    const cfg = THEME_CONFIG[theme];
    if (!cfg) return;

    if (theme === Theme.LIGHT) document.body.setAttribute(THEME_ATTRIBUTE, 'light');
    else document.body.removeAttribute(THEME_ATTRIBUTE);

    const root = document.documentElement;
    Object.entries(cfg.colors).forEach(([key, val]) => {
      root.style.setProperty(`--${key}`, val);
    });

    this.currentTheme = theme;
  }

  setTheme(theme: Theme) {
    if (theme === this.currentTheme) return;
    this.applyTheme(theme);
    this.setStoredTheme(theme);
    this.notify(theme);
  }

  toggleTheme(): Theme {
    const newTheme = this.currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    this.setTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  private handleSystemThemeChange(e: MediaQueryListEvent) {
    if (!this.getStoredTheme()) {
      this.setTheme(e.matches ? Theme.DARK : Theme.LIGHT);
    }
  }

  // Listener helpers
  addListener(fn: (theme: Theme) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  removeListener(fn: (t: Theme) => void) {
    this.listeners.delete(fn);
  }

  private notify(theme: Theme) {
    this.listeners.forEach((fn) => {
      try {
        fn(theme);
      } catch (err) {
        console.error('theme listener error', err);
      }
    });
  }

  /* Utilities */
  getThemeIcon(theme: Theme = this.currentTheme): string {
    return THEME_CONFIG[theme]?.icon ?? '🌙';
  }

  getCSSVariable(property: string): string {
    return `var(--${property})`;
  }
}

export const themeService = new ThemeService();

// Helpers for consumers
export const toggleTheme = () => themeService.toggleTheme();
export const setTheme = (t: Theme) => themeService.setTheme(t);
export const getCurrentTheme = () => themeService.getCurrentTheme();
export const addThemeListener = (cb: (t: Theme) => void) => themeService.addListener(cb);
export const removeThemeListener = (cb: (t: Theme) => void) => themeService.removeListener(cb);
