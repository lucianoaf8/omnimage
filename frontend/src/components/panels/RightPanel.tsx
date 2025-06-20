import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppState } from '../../hooks/useAppState';
import apiService, { ImageMeta } from '../../services/apiService';
import ImageCard from '../ui/ImageCard';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function RightPanel() {
  const { images, setImages, selected, toggleSelect } = useAppState();

  const {
    data: fetched = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['images'],
    queryFn: apiService.getImages,
    retry: false,
    staleTime: 60_000,
  });

  // sync store when fetched size changes
  useEffect(() => {
    if (fetched.length !== images.length) {
      setImages(fetched);
    }
  }, [fetched, images, setImages]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-[var(--text-secondary)]">
        Failed to load images (API offline?)
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
