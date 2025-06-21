import React from 'react';
import Button from '../../ui/Button';

type ToolType = 'select' | 'ruler' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'freehand';

export interface AnnotationToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  hasAnnotations: boolean;
}

export default function AnnotationToolbar({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onDeleteSelected,
  onClearAll,
  canUndo,
  canRedo,
  hasSelection,
  hasAnnotations
}: AnnotationToolbarProps) {
  return (
    <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)] px-6 py-3">
      <div className="flex flex-wrap gap-6">
        {/* Selection Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">Select</span>
          <div className="flex gap-2">
            <Button
              variant={activeTool === 'select' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('select')}
              className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
                activeTool === 'select' 
                  ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                  : 'hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)]'
              }`}
            >
              <span className="text-lg">⌨️</span>
              <span className="text-sm">Select</span>
            </Button>
          </div>
        </div>

        {/* Shape Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">Shapes</span>
          <div className="flex gap-2">
            <Button
              variant={activeTool === 'ruler' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('ruler')}
              className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
                activeTool === 'ruler' 
                  ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                  : 'hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)]'
              }`}
            >
              <span className="text-lg">📏</span>
              <span className="text-sm">Ruler</span>
            </Button>
            <Button
              variant={activeTool === 'rectangle' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('rectangle')}
              className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
                activeTool === 'rectangle' 
                  ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                  : 'hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)]'
              }`}
            >
              <span className="text-lg">▭</span>
              <span className="text-sm">Rectangle</span>
            </Button>
            <Button
              variant={activeTool === 'circle' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('circle')}
              className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
                activeTool === 'circle' 
                  ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                  : 'hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)]'
              }`}
            >
              <span className="text-lg">○</span>
              <span className="text-sm">Circle</span>
            </Button>
          </div>
        </div>

        {/* Annotation Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">Annotate</span>
          <div className="flex gap-2">
            <Button
              variant={activeTool === 'text' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('text')}
              className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
                activeTool === 'text' 
                  ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                  : 'hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)]'
              }`}
            >
              <span className="text-lg">📝</span>
              <span className="text-sm">Text</span>
            </Button>
            <Button
              variant={activeTool === 'arrow' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('arrow')}
              className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
                activeTool === 'arrow' 
                  ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                  : 'hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)]'
              }`}
            >
              <span className="text-lg">➡️</span>
              <span className="text-sm">Arrow</span>
            </Button>
            <Button
              variant={activeTool === 'freehand' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('freehand')}
              className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
                activeTool === 'freehand' 
                  ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                  : 'hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)]'
              }`}
            >
              <span className="text-lg">✏️</span>
              <span className="text-sm">Freehand</span>
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
              <span className="text-lg">↶</span>
              <span className="text-sm">Undo</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--accent-blue)]/20 hover:text-[var(--accent-blue)] transition-all duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <span className="text-lg">↷</span>
              <span className="text-sm">Redo</span>
            </Button>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Actions</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteSelected}
              disabled={!hasSelection}
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/20 hover:text-red-500 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <span className="text-lg">🗑️</span>
              <span className="text-sm">Delete</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              disabled={!hasAnnotations}
              className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/20 hover:text-red-500 transition-all duration-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <span className="text-lg">🗑️✨</span>
              <span className="text-sm">Clear All</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}