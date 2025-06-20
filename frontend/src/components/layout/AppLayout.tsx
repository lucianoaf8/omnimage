import { PropsWithChildren } from 'react';
import Header from './Header';
import Footer from './Footer';
import LeftPanel from '../panels/LeftPanel';
import MiddlePanel from '../panels/MiddlePanel';
import RightPanel from '../panels/RightPanel';
import useResizePanel from '../../hooks/useResizePanel';
import { useUiStore } from '../../stores/uiStore';

/**
 * Main 3-panel layout component (left / middle / right) with dual resize support.
 * Panels widths are managed locally for now; later we can persist via Zustand.
 */
export default function AppLayout({ children }: PropsWithChildren) {
  const { leftWidth, setLeftWidth, rightWidth, setRightWidth } = useUiStore();

  const left = useResizePanel({ side: 'left', defaultWidth: leftWidth, onResize: setLeftWidth });
  const right = useResizePanel({ side: 'right', defaultWidth: rightWidth, onResize: setRightWidth });

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      {/* --- Content area --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div
          ref={left.containerRef}
          style={{ width: left.panelWidth }}
          className="relative flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-secondary)]"
        >
          <LeftPanel />
          {/* Handle */}
          <div
            ref={left.handleRef}
            onMouseDown={left.handleMouseDown}
            className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-[var(--border)] hover:bg-[var(--accent-blue)]"
          />
        </div>

        {/* Middle Panel */}
        <div className="flex-1 overflow-auto bg-[var(--bg-tertiary)]">
          <MiddlePanel />
          {/* children prop can be used to inject alternative content */}
          {children}
        </div>

        {/* Right Panel */}
        <div
          ref={right.containerRef}
          style={{ width: right.panelWidth }}
          className="relative flex-shrink-0 border-l border-[var(--border)] bg-[var(--bg-secondary)]"
        >
          {/* Handle */}
          <div
            ref={right.handleRef}
            onMouseDown={right.handleMouseDown}
            className="absolute left-0 top-0 h-full w-1 cursor-col-resize bg-[var(--border)] hover:bg-[var(--accent-blue)]"
          />
          <RightPanel />
        </div>
      </div>

      <Footer />
    </div>
  );
}
