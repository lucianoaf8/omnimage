import { toggleTheme, getCurrentTheme, Theme } from '../../services/themeService';
import { useState, useEffect } from 'react';

// Available icon sets with 64x64 icons
const ICON_SETS = [
  'blue_pen_chip',
  'chip1', 
  'green_neon_chip',
  'neon_chip',
  'neon_chip_brush',
  'neon_processor'
];

export default function Header() {
  const [mode, setMode] = useState<Theme>(getCurrentTheme());
  const [currentIcon, setCurrentIcon] = useState<string>('');

  // Select a random icon on component mount and page refresh
  useEffect(() => {
    const randomIcon = ICON_SETS[Math.floor(Math.random() * ICON_SETS.length)];
    setCurrentIcon(randomIcon);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setMode(next);
  };

  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-3">
        {currentIcon && (
          <img 
            src={`/src/assets/icons/${currentIcon}/${currentIcon}_64x64.ico`}
            alt="Omnimage Icon"
            className="w-8 h-8 rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-110"
            onError={(e) => {
              // Fallback to PNG if ICO fails to load
              const target = e.target as HTMLImageElement;
              if (target.src.endsWith('.ico')) {
                target.src = `/src/assets/icons/${currentIcon}/${currentIcon}_512x512.png`;
              }
            }}
          />
        )}
        <div className="font-bold">Omnimage</div>
      </div>
      <div className="flex items-center gap-4">
        {/* Status placeholder */}
        <span className="text-sm text-[var(--text-secondary)]">alpha</span>
        {/* Theme toggle */}
        <button
          className="rounded-full p-2 hover:bg-[var(--selection)] transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-md"
          onClick={handleToggle}
          title="Toggle theme"
        >
          {mode === Theme.DARK ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
