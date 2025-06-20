import { toggleTheme, getCurrentTheme, Theme } from '../../services/themeService';
import { useState } from 'react';

export default function Header() {
  const [mode, setMode] = useState<Theme>(getCurrentTheme());

  const handleToggle = () => {
    const next = toggleTheme();
    setMode(next);
  };

  return (
    <header className="flex items-center justify-between px-4 h-12 border-b border-[var(--border)] bg-[var(--bg-secondary)] shadow-sm">
      <div className="font-bold">Omnimage</div>
      <div className="flex items-center gap-4">
        {/* Status placeholder */}
        <span className="text-sm text-[var(--text-secondary)]">alpha</span>
        {/* Theme toggle */}
        <button
          className="rounded p-1 hover:bg-[var(--selection)]"
          onClick={handleToggle}
          title="Toggle theme"
        >
          {mode === Theme.DARK ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
