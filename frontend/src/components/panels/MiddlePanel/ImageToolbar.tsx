import React from 'react';
import Button from '../../ui/Button';

export interface ImageToolbarProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onFitToScreen: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasModifications: boolean;
}

export default function ImageToolbar({
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  onFitToScreen,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
  hasModifications
}: ImageToolbarProps) {
  return (
    <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] px-6 py-3">
      <div className="flex flex-wrap gap-6">
        {/* Transform Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">Transform</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRotateLeft}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200"
            >
              <span className="text-lg">⟲</span>
              <span className="text-sm">Rotate Left</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRotateRight}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200"
            >
              <span className="text-lg">⟳</span>
              <span className="text-sm">Rotate Right</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlipHorizontal}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200"
            >
              <span className="text-lg">⇋</span>
              <span className="text-sm">Flip H</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlipVertical}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200"
            >
              <span className="text-lg">⇵</span>
              <span className="text-sm">Flip V</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">View</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFitToScreen}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200"
            >
              <span className="text-lg">⤢</span>
              <span className="text-sm">Fit Screen</span>
            </Button>
          </div>
        </div>

        {/* History Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">History</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <span className="text-lg">↺</span>
              <span className="text-sm">Undo</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <span className="text-lg">↻</span>
              <span className="text-sm">Redo</span>
            </Button>
          </div>
        </div>

        {hasModifications && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-[var(--accent-orange)] uppercase tracking-wide">Reset</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-orange)]/20 hover:text-[var(--accent-orange)] transition-all duration-200"
              >
                <span className="text-lg">⟲</span>
                <span className="text-sm">Reset All</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}