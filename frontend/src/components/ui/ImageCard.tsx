import clsx from 'clsx';
import { ImageMeta } from '../../services/apiService';

interface Props {
  image: ImageMeta;
  selected: boolean;
  onClick: (event?: React.MouseEvent) => void;
  onDoubleClick?: (event?: React.MouseEvent) => void;
}

export default function ImageCard({ image, selected, onClick, onDoubleClick }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    onClick(e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    console.debug('ImageCard.doubleClick', { id: image.id });
    e.preventDefault();
    e.stopPropagation();
    onDoubleClick?.(e);
  };

  const handleDragStart = (e: React.DragEvent) => {
    console.debug('ImageCard.dragStart', { id: image.id });
    e.dataTransfer.setData('text/plain', image.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      draggable
      onDragStart={handleDragStart}
      title={`${image.filename} - Click to select, Double-click to view, Ctrl+Click for multi-select, Shift+Click for range select, Drag to viewer`}
      className={clsx(
        'relative cursor-pointer border-2 rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl group',
        selected
          ? 'border-[var(--accent-blue)] scale-105 shadow-2xl ring-2 ring-[var(--accent-blue)] ring-opacity-30'
          : 'border-transparent hover:border-[var(--accent-blue)] hover:scale-110'
      )}
    >
      <img src={image.thumbnail_url} alt={image.filename} className="w-full h-full object-cover" />
      
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 left-2 w-6 h-6 bg-[var(--accent-blue)] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
          ✓
        </div>
      )}
      
      {/* Image info overlay on hover */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2">
        <div className="text-white text-xs truncate">
          {image.filename}
        </div>
        <div className="text-white/70 text-xs">
          {image.model} • {image.provider}
        </div>
      </div>
    </div>
  );
}
