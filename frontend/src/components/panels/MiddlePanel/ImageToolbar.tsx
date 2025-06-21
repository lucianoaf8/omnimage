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
    <div className="flex flex-wrap gap-2 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
      {/* Transform Tools */}
      <div className="flex gap-1">
        <span className="text-xs text-[var(--text-secondary)] px-2 py-1 font-medium">Transform</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRotateLeft}
          title="Rotate Left (L)"
        >
          ⟲
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRotateRight}
          title="Rotate Right (R)"
        >
          ⟳
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFlipHorizontal}
          title="Flip Horizontal (H)"
        >
          ⇋
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFlipVertical}
          title="Flip Vertical (V)"
        >
          ⇵
        </Button>
      </div>

      <div className="w-px h-6 bg-[var(--border)] my-auto"></div>

      {/* Navigation Tools */}
      <div className="flex gap-1">
        <span className="text-xs text-[var(--text-secondary)] px-2 py-1 font-medium">View</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFitToScreen}
          title="Fit to Screen (0)"
        >
          ⤢
        </Button>
      </div>

      <div className="w-px h-6 bg-[var(--border)] my-auto"></div>

      {/* History Tools */}
      <div className="flex gap-1">
        <span className="text-xs text-[var(--text-secondary)] px-2 py-1 font-medium">History</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↺
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          ↻
        </Button>
      </div>

      {hasModifications && (
        <>
          <div className="w-px h-6 bg-[var(--border)] my-auto"></div>
          
          {/* Reset Tool */}
          <div className="flex gap-1">
            <span className="text-xs text-[var(--text-secondary)] px-2 py-1 font-medium">Reset</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              title="Reset All Changes (Ctrl+R)"
            >
              ⟲
            </Button>
          </div>
        </>
      )}
    </div>
  );
}