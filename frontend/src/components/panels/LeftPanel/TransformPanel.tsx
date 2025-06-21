import React, { useState, useEffect } from 'react';
import { ViewerTransform } from '../MiddlePanel/ImageViewer';

interface TransformPanelProps {
  transform: ViewerTransform;
  onTransformChange: (transform: ViewerTransform) => void;
  onFitToScreen: () => void;
  onResetTransform: () => void;
}

const TransformPanel: React.FC<TransformPanelProps> = ({
  transform,
  onTransformChange,
  onFitToScreen,
  onResetTransform
}) => {
  const [localTransform, setLocalTransform] = useState(transform);
  const [canvasBackground, setCanvasBackground] = useState('#000000');

  // Sync with parent transform changes
  useEffect(() => {
    setLocalTransform(transform);
  }, [transform]);

  const handleTransformUpdate = (updates: Partial<ViewerTransform>) => {
    const newTransform = { ...localTransform, ...updates };
    setLocalTransform(newTransform);
    onTransformChange(newTransform);
  };

  const handleNumberInput = (field: keyof ViewerTransform, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      handleTransformUpdate({ [field]: numValue });
    }
  };

  const handleZoomInput = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedZoom = Math.max(0.1, Math.min(10, numValue / 100));
      handleTransformUpdate({ zoom: clampedZoom });
    }
  };

  const handleRotationInput = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const normalizedRotation = ((numValue % 360) + 360) % 360;
      handleTransformUpdate({ rotation: normalizedRotation });
    }
  };

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">Zoom</label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={(localTransform.zoom * 100).toFixed(0)}
              onChange={(e) => handleZoomInput(e.target.value)}
              className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min="10"
              max="1000"
              step="10"
              value={(localTransform.zoom * 100).toFixed(0)}
              onChange={(e) => handleZoomInput(e.target.value)}
              className="w-16 px-2 py-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
            />
            <span className="text-xs text-[var(--text-secondary)]">%</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleTransformUpdate({ zoom: 0.25 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              25%
            </button>
            <button
              onClick={() => handleTransformUpdate({ zoom: 0.5 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              50%
            </button>
            <button
              onClick={() => handleTransformUpdate({ zoom: 1 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              100%
            </button>
            <button
              onClick={() => handleTransformUpdate({ zoom: 2 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              200%
            </button>
          </div>
        </div>
      </div>

      {/* Rotation Controls */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">Rotation</label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={localTransform.rotation}
              onChange={(e) => handleRotationInput(e.target.value)}
              className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              min="0"
              max="360"
              step="1"
              value={localTransform.rotation.toFixed(0)}
              onChange={(e) => handleRotationInput(e.target.value)}
              className="w-16 px-2 py-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
            />
            <span className="text-xs text-[var(--text-secondary)]">°</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleTransformUpdate({ rotation: 0 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              0°
            </button>
            <button
              onClick={() => handleTransformUpdate({ rotation: 90 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              90°
            </button>
            <button
              onClick={() => handleTransformUpdate({ rotation: 180 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              180°
            </button>
            <button
              onClick={() => handleTransformUpdate({ rotation: 270 })}
              className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
            >
              270°
            </button>
          </div>
        </div>
      </div>

      {/* Pan Controls */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-secondary)]">X</label>
            <input
              type="number"
              step="1"
              value={localTransform.panX.toFixed(0)}
              onChange={(e) => handleNumberInput('panX', e.target.value)}
              className="w-full px-2 py-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-[var(--text-secondary)]">Y</label>
            <input
              type="number"
              step="1"
              value={localTransform.panY.toFixed(0)}
              onChange={(e) => handleNumberInput('panY', e.target.value)}
              className="w-full px-2 py-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
            />
          </div>
        </div>
        <button
          onClick={() => handleTransformUpdate({ panX: 0, panY: 0 })}
          className="w-full px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors"
        >
          Center
        </button>
      </div>

      {/* Flip Controls */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">Flip</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleTransformUpdate({ flipX: !localTransform.flipX })}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              localTransform.flipX
                ? 'bg-[var(--accent-blue)] text-white'
                : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            Horizontal
          </button>
          <button
            onClick={() => handleTransformUpdate({ flipY: !localTransform.flipY })}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              localTransform.flipY
                ? 'bg-[var(--accent-blue)] text-white'
                : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            Vertical
          </button>
        </div>
      </div>

      {/* Canvas Background */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">Canvas Background</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={canvasBackground}
            onChange={(e) => setCanvasBackground(e.target.value)}
            className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
          />
          <div className="flex-1 flex gap-1">
            <button
              onClick={() => setCanvasBackground('#000000')}
              className="flex-1 px-2 py-1 text-xs bg-black text-white rounded transition-colors hover:bg-gray-800"
            >
              Black
            </button>
            <button
              onClick={() => setCanvasBackground('#ffffff')}
              className="flex-1 px-2 py-1 text-xs bg-white text-black border border-[var(--border)] rounded transition-colors hover:bg-gray-100"
            >
              White
            </button>
            <button
              onClick={() => setCanvasBackground('#808080')}
              className="flex-1 px-2 py-1 text-xs bg-gray-500 text-white rounded transition-colors hover:bg-gray-600"
            >
              Gray
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-[var(--border)]">
        <button
          onClick={onFitToScreen}
          className="w-full px-3 py-2 bg-[var(--accent-blue)] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
        >
          Fit to Screen
        </button>
        <button
          onClick={onResetTransform}
          className="w-full px-3 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg transition-colors"
        >
          Reset Transform
        </button>
      </div>

      {/* Transform Info */}
      <div className="text-xs text-[var(--text-secondary)] space-y-1 pt-2 border-t border-[var(--border)]">
        <div>Zoom: {(localTransform.zoom * 100).toFixed(1)}%</div>
        <div>Rotation: {localTransform.rotation.toFixed(1)}°</div>
        <div>Position: ({localTransform.panX.toFixed(0)}, {localTransform.panY.toFixed(0)})</div>
        <div>Flipped: {localTransform.flipX ? 'H' : ''}{localTransform.flipY ? 'V' : ''}{!localTransform.flipX && !localTransform.flipY ? 'None' : ''}</div>
      </div>
    </div>
  );
};

export default TransformPanel;