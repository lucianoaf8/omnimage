import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ViewerTransform } from './ImageViewer';

export interface Point {
  x: number;
  y: number;
}

export interface AnnotationStyle {
  color: string;
  strokeWidth: number;
  fillColor?: string;
  fontSize?: number;
}

export interface Annotation {
  id: string;
  type: 'ruler' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'freehand';
  points: Point[];
  style: AnnotationStyle;
  text?: string;
  measurements?: {
    distance?: number;
    area?: number;
    unit: string;
  };
  timestamp: number;
}

export interface AnnotationLayerProps {
  transform: ViewerTransform;
  containerWidth: number;
  containerHeight: number;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  onAnnotationsChange?: (annotations: Annotation[]) => void;
}

type ToolType = 'select' | 'ruler' | 'rectangle' | 'circle' | 'text' | 'arrow' | 'freehand';

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  transform,
  containerWidth,
  containerHeight,
  imageNaturalWidth,
  imageNaturalHeight,
  onAnnotationsChange
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [freehandPath, setFreehandPath] = useState<Point[]>([]);
  const [annotationHistory, setAnnotationHistory] = useState<Annotation[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const defaultStyle: AnnotationStyle = {
    color: '#00D9FF',
    strokeWidth: 2,
    fillColor: 'rgba(0, 217, 255, 0.1)',
    fontSize: 14
  };

  // Convert canvas coordinates to SVG coordinates
  const canvasToSVG = useCallback((canvasX: number, canvasY: number): Point => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // Reverse the transformation applied in ImageViewer
    const svgX = (canvasX - centerX - transform.panX) / transform.zoom;
    const svgY = (canvasY - centerY - transform.panY) / transform.zoom;
    
    return { x: svgX, y: svgY };
  }, [containerWidth, containerHeight, transform]);

  // Convert SVG coordinates to canvas coordinates
  const svgToCanvas = useCallback((svgX: number, svgY: number): Point => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    const canvasX = svgX * transform.zoom + centerX + transform.panX;
    const canvasY = svgY * transform.zoom + centerY + transform.panY;
    
    return { x: canvasX, y: canvasY };
  }, [containerWidth, containerHeight, transform]);

  // Calculate distance between two points
  const calculateDistance = useCallback((p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);

  // Generate unique ID for annotations
  const generateId = () => `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Save current state to history
  const saveToHistory = useCallback(() => {
    setAnnotationHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...annotations]);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => prev + 1);
  }, [annotations, historyIndex]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'select') return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    const svgPoint = canvasToSVG(canvasPoint.x, canvasPoint.y);

    setIsDrawing(true);
    saveToHistory();

    if (activeTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const newAnnotation: Annotation = {
          id: generateId(),
          type: 'text',
          points: [svgPoint],
          style: { ...defaultStyle, fontSize: 16 },
          text,
          timestamp: Date.now()
        };
        setAnnotations(prev => [...prev, newAnnotation]);
      }
      setIsDrawing(false);
      return;
    }

    const newAnnotation: Annotation = {
      id: generateId(),
      type: activeTool,
      points: [svgPoint],
      style: { ...defaultStyle },
      timestamp: Date.now()
    };

    if (activeTool === 'freehand') {
      setFreehandPath([svgPoint]);
    }

    setCurrentAnnotation(newAnnotation);
  }, [activeTool, canvasToSVG, saveToHistory]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !currentAnnotation) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    const svgPoint = canvasToSVG(canvasPoint.x, canvasPoint.y);

    if (activeTool === 'freehand') {
      setFreehandPath(prev => [...prev, svgPoint]);
      setCurrentAnnotation(prev => prev ? {
        ...prev,
        points: [...freehandPath, svgPoint]
      } : null);
    } else {
      setCurrentAnnotation(prev => prev ? {
        ...prev,
        points: [prev.points[0], svgPoint]
      } : null);
    }
  }, [isDrawing, currentAnnotation, canvasToSVG, activeTool, freehandPath]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentAnnotation) return;

    // Calculate measurements for ruler
    if (currentAnnotation.type === 'ruler' && currentAnnotation.points.length >= 2) {
      const distance = calculateDistance(currentAnnotation.points[0], currentAnnotation.points[1]);
      currentAnnotation.measurements = {
        distance,
        unit: 'px'
      };
    }

    setAnnotations(prev => [...prev, currentAnnotation]);
    setCurrentAnnotation(null);
    setIsDrawing(false);
    setFreehandPath([]);
  }, [isDrawing, currentAnnotation, calculateDistance]);

  // Render annotation
  const renderAnnotation = useCallback((annotation: Annotation) => {
    const { id, type, points, style, text, measurements } = annotation;
    const isSelected = selectedAnnotation === id;
    const strokeColor = isSelected ? '#FFD700' : style.color;
    const strokeWidth = isSelected ? style.strokeWidth + 1 : style.strokeWidth;

    switch (type) {
      case 'ruler':
        if (points.length < 2) return null;
        const [start, end] = points;
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        
        return (
          <g key={id}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray="5,5"
            />
            <circle cx={start.x} cy={start.y} r="4" fill={strokeColor} />
            <circle cx={end.x} cy={end.y} r="4" fill={strokeColor} />
            {measurements?.distance && (
              <text
                x={midX}
                y={midY - 10}
                fill={strokeColor}
                fontSize={style.fontSize}
                textAnchor="middle"
                className="select-none"
              >
                {measurements.distance.toFixed(1)}px
              </text>
            )}
          </g>
        );

      case 'rectangle':
        if (points.length < 2) return null;
        const [topLeft, bottomRight] = points;
        const width = Math.abs(bottomRight.x - topLeft.x);
        const height = Math.abs(bottomRight.y - topLeft.y);
        const x = Math.min(topLeft.x, bottomRight.x);
        const y = Math.min(topLeft.y, bottomRight.y);

        return (
          <rect
            key={id}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={style.fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );

      case 'circle':
        if (points.length < 2) return null;
        const [center, edge] = points;
        const radius = calculateDistance(center, edge);

        return (
          <circle
            key={id}
            cx={center.x}
            cy={center.y}
            r={radius}
            fill={style.fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        );

      case 'text':
        if (points.length < 1 || !text) return null;
        const [textPoint] = points;

        return (
          <text
            key={id}
            x={textPoint.x}
            y={textPoint.y}
            fill={strokeColor}
            fontSize={style.fontSize}
            className="select-none cursor-pointer"
            onClick={() => setSelectedAnnotation(id)}
          >
            {text}
          </text>
        );

      case 'arrow':
        if (points.length < 2) return null;
        const [arrowStart, arrowEnd] = points;
        const angle = Math.atan2(arrowEnd.y - arrowStart.y, arrowEnd.x - arrowStart.x);
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;

        const arrowHead1X = arrowEnd.x - arrowLength * Math.cos(angle - arrowAngle);
        const arrowHead1Y = arrowEnd.y - arrowLength * Math.sin(angle - arrowAngle);
        const arrowHead2X = arrowEnd.x - arrowLength * Math.cos(angle + arrowAngle);
        const arrowHead2Y = arrowEnd.y - arrowLength * Math.sin(angle + arrowAngle);

        return (
          <g key={id}>
            <line
              x1={arrowStart.x}
              y1={arrowStart.y}
              x2={arrowEnd.x}
              y2={arrowEnd.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <polygon
              points={`${arrowEnd.x},${arrowEnd.y} ${arrowHead1X},${arrowHead1Y} ${arrowHead2X},${arrowHead2Y}`}
              fill={strokeColor}
            />
          </g>
        );

      case 'freehand':
        if (points.length < 2) return null;
        const pathData = points.reduce((path, point, index) => {
          return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
        }, '');

        return (
          <path
            key={id}
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      default:
        return null;
    }
  }, [selectedAnnotation, calculateDistance]);

  // Delete selected annotation
  const deleteSelectedAnnotation = useCallback(() => {
    if (selectedAnnotation) {
      saveToHistory();
      setAnnotations(prev => prev.filter(a => a.id !== selectedAnnotation));
      setSelectedAnnotation(null);
    }
  }, [selectedAnnotation, saveToHistory]);

  // Clear all annotations
  const clearAllAnnotations = useCallback(() => {
    if (annotations.length > 0) {
      saveToHistory();
      setAnnotations([]);
      setSelectedAnnotation(null);
    }
  }, [annotations.length, saveToHistory]);

  // Undo annotation
  const undoAnnotation = useCallback(() => {
    if (historyIndex >= 0) {
      setAnnotations(annotationHistory[historyIndex] || []);
      setHistoryIndex(prev => prev - 1);
      setSelectedAnnotation(null);
    }
  }, [historyIndex, annotationHistory]);

  // Redo annotation
  const redoAnnotation = useCallback(() => {
    if (historyIndex < annotationHistory.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setAnnotations(annotationHistory[historyIndex + 1] || []);
      setSelectedAnnotation(null);
    }
  }, [historyIndex, annotationHistory]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'r':
          setActiveTool('ruler');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'a':
          setActiveTool('arrow');
          break;
        case 'f':
          setActiveTool('freehand');
          break;
        case 'escape':
          setActiveTool('select');
          setSelectedAnnotation(null);
          break;
        case 'delete':
        case 'backspace':
          if (selectedAnnotation) {
            deleteSelectedAnnotation();
          }
          break;
        case 'z':
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              redoAnnotation();
            } else {
              undoAnnotation();
            }
            e.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnnotation, deleteSelectedAnnotation, undoAnnotation, redoAnnotation]);

  // Notify parent of annotation changes
  useEffect(() => {
    onAnnotationsChange?.(annotations);
  }, [annotations, onAnnotationsChange]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Toolbar */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 bg-black/70 backdrop-blur-md p-2 rounded-xl shadow-2xl text-white border border-white/20 pointer-events-auto">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTool('select')}
            className={`px-2 py-1 rounded text-sm transition-all duration-200 ${
              activeTool === 'select' ? 'bg-[var(--accent-blue)] text-white' : 'hover:bg-white/20'
            }`}
            title="Select (Esc)"
          >
            ⌨️
          </button>
          <button
            onClick={() => setActiveTool('ruler')}
            className={`px-2 py-1 rounded text-sm transition-all duration-200 ${
              activeTool === 'ruler' ? 'bg-[var(--accent-blue)] text-white' : 'hover:bg-white/20'
            }`}
            title="Ruler (R)"
          >
            📏
          </button>
          <button
            onClick={() => setActiveTool('rectangle')}
            className={`px-2 py-1 rounded text-sm transition-all duration-200 ${
              activeTool === 'rectangle' ? 'bg-[var(--accent-blue)] text-white' : 'hover:bg-white/20'
            }`}
            title="Rectangle"
          >
            ▭
          </button>
          <button
            onClick={() => setActiveTool('circle')}
            className={`px-2 py-1 rounded text-sm transition-all duration-200 ${
              activeTool === 'circle' ? 'bg-[var(--accent-blue)] text-white' : 'hover:bg-white/20'
            }`}
            title="Circle"
          >
            ○
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTool('text')}
            className={`px-2 py-1 rounded text-sm transition-all duration-200 ${
              activeTool === 'text' ? 'bg-[var(--accent-blue)] text-white' : 'hover:bg-white/20'
            }`}
            title="Text (T)"
          >
            📝
          </button>
          <button
            onClick={() => setActiveTool('arrow')}
            className={`px-2 py-1 rounded text-sm transition-all duration-200 ${
              activeTool === 'arrow' ? 'bg-[var(--accent-blue)] text-white' : 'hover:bg-white/20'
            }`}
            title="Arrow (A)"
          >
            ➡️
          </button>
          <button
            onClick={() => setActiveTool('freehand')}
            className={`px-2 py-1 rounded text-sm transition-all duration-200 ${
              activeTool === 'freehand' ? 'bg-[var(--accent-blue)] text-white' : 'hover:bg-white/20'
            }`}
            title="Freehand (F)"
          >
            ✏️
          </button>
          <div className="w-px bg-white/30 mx-1"></div>
          <button
            onClick={undoAnnotation}
            className="px-2 py-1 rounded text-sm hover:bg-white/20 transition-all duration-200"
            title="Undo (Ctrl+Z)"
            disabled={historyIndex < 0}
          >
            ↶
          </button>
          <button
            onClick={redoAnnotation}
            className="px-2 py-1 rounded text-sm hover:bg-white/20 transition-all duration-200"
            title="Redo (Ctrl+Shift+Z)"
            disabled={historyIndex >= annotationHistory.length - 1}
          >
            ↷
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={deleteSelectedAnnotation}
            className="px-2 py-1 rounded text-sm hover:bg-red-500/80 transition-all duration-200"
            title="Delete Selected (Del)"
            disabled={!selectedAnnotation}
          >
            🗑️
          </button>
          <button
            onClick={clearAllAnnotations}
            className="px-2 py-1 rounded text-sm hover:bg-red-500/80 transition-all duration-200"
            title="Clear All"
            disabled={annotations.length === 0}
          >
            🗑️✨
          </button>
        </div>
      </div>

      {/* SVG Overlay */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ 
          cursor: activeTool === 'select' ? 'default' : 'crosshair',
          pointerEvents: activeTool === 'select' ? 'none' : 'auto'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={(e) => {
          if (activeTool === 'select') {
            // Handle selection of annotations
            const target = e.target as SVGElement;
            const annotationId = target.closest('[data-annotation-id]')?.getAttribute('data-annotation-id');
            setSelectedAnnotation(annotationId || null);
          }
        }}
      >
        <g transform={`translate(${containerWidth/2 + transform.panX}, ${containerHeight/2 + transform.panY}) scale(${transform.zoom}) rotate(${transform.rotation})`}>
          {annotations.map(annotation => renderAnnotation(annotation))}
          {currentAnnotation && renderAnnotation(currentAnnotation)}
        </g>
      </svg>
    </div>
  );
};

export default AnnotationLayer;