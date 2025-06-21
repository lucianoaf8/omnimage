export default function Footer() {
  return (
    <footer className="h-20 flex items-center justify-between px-4 text-xs border-t border-[var(--border)] bg-[var(--bg-secondary)] backdrop-blur-md">
      <div className="flex items-center gap-4 min-w-0">
        <span className="transition-colors duration-200 hover:text-[var(--accent-blue)] whitespace-nowrap">© 2025 Omnimage</span>
        <span className="text-[var(--text-secondary)] px-2 py-1 bg-[var(--bg-tertiary)] rounded-full whitespace-nowrap">v0.2</span>
      </div>
      
      {/* Windows Keyboard Shortcuts - Full width grid layout */}
      <div className="flex-1 mx-4 min-w-0">
        <div className="grid grid-cols-8 gap-4 text-xs w-full">
          {/* Navigation Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Navigation</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">+/-</kbd> Zoom</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">0</kbd> Fit</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">1</kbd> 100%</div>
            </div>
          </div>

          {/* Pan Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Pan</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Arrows</kbd> Move</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Space</kbd> Hand</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">2×Click</kbd> Fit</div>
            </div>
          </div>

          {/* Transform Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Transform</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">R/L</kbd> Rotate</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">H/V</kbd> Flip</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Ctrl+R</kbd> Reset</div>
            </div>
          </div>

          {/* Selection Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Selection</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Ctrl+A</kbd> All</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Ctrl+Click</kbd> Multi</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Shift+Click</kbd> Range</div>
            </div>
          </div>

          {/* Actions Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Actions</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Delete</kbd> Remove</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Ctrl+Z</kbd> Undo</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Esc</kbd> Clear</div>
            </div>
          </div>

          {/* Tools Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Tools</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">R</kbd> Ruler</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">T</kbd> Text</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">A</kbd> Arrow</div>
            </div>
          </div>

          {/* Annotation Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Annotation</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">F</kbd> Draw</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Ctrl+Y</kbd> Redo</div>
            </div>
          </div>

          {/* Gallery Column */}
          <div className="flex items-center gap-2">
            <div className="font-semibold text-[var(--accent-blue)] whitespace-nowrap">Gallery</div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">2×Click</kbd> View</div>
              <div className="text-[var(--text-secondary)] whitespace-nowrap"><kbd className="bg-[var(--bg-tertiary)] px-1 rounded text-[10px]">Drag</kbd> Move</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-[var(--text-secondary)] min-w-0">
        <span className="whitespace-nowrap">Windows</span>
      </div>
    </footer>
  );
}
