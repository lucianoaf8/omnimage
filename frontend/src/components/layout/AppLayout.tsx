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
  const { leftWidth, setLeftWidth, rightWidth, setRightWidth, collapsed, toggleCollapse } =
    useUiStore();

  const COLLAPSED_W = 20;
  const isLeftCollapsed = collapsed.left;
  const isRightCollapsed = collapsed.right;

  const left = useResizePanel({
    side: 'left',
    defaultWidth: leftWidth,
    onResize: setLeftWidth,
    maxWidth: 600,
  });
  const right = useResizePanel({
    side: 'right',
    defaultWidth: rightWidth,
    onResize: setRightWidth,
    maxWidth: 1000,
  });

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      {/* --- Content area --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div
          ref={left.containerRef}
          style={{ width: isLeftCollapsed ? COLLAPSED_W : left.panelWidth }}
          className="relative flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-300 ease-in-out overflow-hidden backdrop-blur-sm"
        >
          {!isLeftCollapsed && <LeftPanel />}
          {/* Handle */}
          {/* Handle / Collapse toggle */}
          <div
            ref={left.handleRef}
            onMouseDown={isLeftCollapsed ? undefined : left.handleMouseDown}
            className="absolute right-0 top-0 h-full w-2 cursor-col-resize group"
          >
            <div
              onClick={() => toggleCollapse('left')}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-r-xl cursor-pointer hover:bg-[var(--accent-blue)] hover:text-white text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-110 shadow-md backdrop-blur-sm"
            >
              <span className="font-bold">{isLeftCollapsed ? '›' : '‹'}</span>
            </div>
          </div>
        </div>

        {/* Middle Panel */}
        <div className="flex-1 overflow-auto bg-[var(--bg-tertiary)] backdrop-blur-sm">
          <MiddlePanel />
          {/* children prop can be used to inject alternative content */}
          {children}
        </div>

        {/* Right Panel */}
        <div
          ref={right.containerRef}
          style={{ width: isRightCollapsed ? COLLAPSED_W : right.panelWidth }}
          className="relative flex-shrink-0 border-l border-[var(--border)] bg-[var(--bg-secondary)] transition-all duration-300 ease-in-out overflow-hidden backdrop-blur-sm"
        >
          {/* Handle / Collapse toggle */}
          <div
            ref={right.handleRef}
            onMouseDown={isRightCollapsed ? undefined : right.handleMouseDown}
            className="absolute left-0 top-0 h-full w-2 cursor-col-resize group"
          >
            <div
              onClick={() => toggleCollapse('right')}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-l-xl cursor-pointer hover:bg-[var(--accent-blue)] hover:text-white text-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-110 shadow-md backdrop-blur-sm"
            >
              <span className="font-bold">{isRightCollapsed ? '‹' : '›'}</span>
            </div>
          </div>
          {!isRightCollapsed && <RightPanel />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
