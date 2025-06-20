import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import apiService, { ImageMeta } from '../../services/apiService';
import ImageCard from '../ui/ImageCard';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function RightPanel() {
  const { images, setImages, selected, toggleSelect } = useAppState();

  const { data: fetched = [], isLoading } = useQuery<ImageMeta[]>({
    queryKey: ['images'],
    queryFn: apiService.getImages,
  });

  useEffect(() => {
    setImages(fetched);
  }, [fetched, setImages]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-2 auto-rows-[120px] grid-cols-[repeat(auto-fill,minmax(120px,1fr))] overflow-auto h-full">
      {images.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No images yet.</p>}
      {images.map((img) => (
        <ImageCard
          key={img.id}
          image={img}
          selected={selected.has(img.id)}
          onClick={() => toggleSelect(img.id)}
        />
      ))}
    </div>
  );
}
