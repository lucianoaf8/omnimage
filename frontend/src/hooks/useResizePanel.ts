import { useCallback, useRef, useState } from 'react';

export interface ResizePanelOptions {
  /** Starting size in pixels */
  defaultWidth?: number;
  /** Minimum allowed size */
  minWidth?: number;
  /** Maximum allowed size */
  maxWidth?: number;
  /** Callback invoked on every drag update */
  onResize?: (size: number) => void;
  /** Which edge is being dragged – affects delta direction */
  side?: 'left' | 'right';
}

export interface ResizePanelResult {
  panelWidth: number;
  panelSize: 'small' | 'medium' | 'large';
  isResizing: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleRef: React.RefObject<HTMLDivElement | null>;
  handleMouseDown: (e: React.MouseEvent) => void;
  setWidth: (width: number) => void;
}

/**
 * Hook that abstracts pointer-based resizing logic for either left or right side panels.
 */
export default function useResizePanel({
  defaultWidth = 320,
  minWidth = 200,
  maxWidth = 600,
  onResize,
  side = 'left',
}: ResizePanelOptions = {}): ResizePanelResult {
  const [panelWidth, setPanelWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const setWidth = useCallback(
    (w: number) => {
      const newW = Math.max(minWidth, Math.min(maxWidth, w));
      setPanelWidth(newW);
      onResize?.(newW);
    },
    [minWidth, maxWidth, onResize]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      const startX = e.clientX;
      const startWidth = panelWidth;

      const onMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX;
        // If right side, invert delta direction
        const adjustedDelta = side === 'right' ? -delta : delta;
        setWidth(startWidth + adjustedDelta);
      };

      const onUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [panelWidth, setWidth, side]
  );

  const panelSize: ResizePanelResult['panelSize'] =
    panelWidth < 250 ? 'small' : panelWidth > 450 ? 'large' : 'medium';

  return {
    panelWidth,
    panelSize,
    isResizing,
    containerRef,
    handleRef,
    handleMouseDown,
    setWidth,
  };
}

export { useResizePanel as useResizePanelRI };
