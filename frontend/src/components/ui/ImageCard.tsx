import clsx from 'clsx';
import { ImageMeta } from '../../services/apiService';

interface Props {
  image: ImageMeta;
  selected: boolean;
  onClick: () => void;
}

export default function ImageCard({ image, selected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      title={image.filename}
      className={clsx(
        'relative cursor-pointer border-2 rounded shadow-sm overflow-hidden',
        selected ? 'border-[var(--accent-blue)]' : 'border-transparent hover:border-[var(--border)]'
      )}
    >
      <img src={image.thumbnail_url} alt={image.filename} className="w-full h-full object-cover" />
    </div>
  );
}
