import { useAppState } from '../../hooks/useAppState';
import FileDropZone from '../ui/FileDropZone';

export default function MiddlePanel() {
  const { images, selected } = useAppState();
  const firstId = Array.from(selected)[0];
  const image = images.find((i) => i.id === firstId);

  if (!image) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <FileDropZone />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-4 overflow-auto">
      <img src={image.url} alt={image.filename} className="max-h-[70vh] object-contain rounded shadow" />
      <div className="text-sm text-[var(--text-secondary)] font-mono">
        <div>Filename: {image.filename}</div>
        <div>Model: {image.model}</div>
        <div>Provider: {image.provider}</div>
        <div>Created: {image.created_at}</div>
      </div>
    </div>
  );
}
