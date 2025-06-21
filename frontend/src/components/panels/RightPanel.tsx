import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/useAppState';
import apiService, { ImageMeta } from '../../services/apiService';
import ImageCard from '../ui/ImageCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import { useImageStore } from '../../stores/imageStore';

export default function RightPanel() {
  const { images, setImages, selected, setSelection } = useAppState();
  const { 
    selected: storeSelected, 
    toggleSelect, 
    selectAll, 
    clearSelection, 
    bulkDelete, 
    bulkDownload,
    setImages: setStoreImages 
  } = useImageStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: fetched = [],
    isLoading,
    isError,
    refetch,
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
      setStoreImages(fetched); // keep imageStore in sync for range selections
    }
  }, [fetched, images, setImages]);

  const selectedArray = Array.from(storeSelected);
  const selectedCount = selectedArray.length;

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedCount} image${selectedCount !== 1 ? 's' : ''}?`
    );
    
    if (!confirmed) return;
    
    setIsProcessing(true);
    try {
      await bulkDelete(selectedArray);
      await refetch(); // Refresh the image list
    } catch (error) {
      alert('Failed to delete images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedCount === 0) return;
    
    setIsProcessing(true);
    try {
      await bulkDownload(selectedArray);
    } catch (error) {
      alert('Failed to download images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedCount === images.length) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  const handleDoubleClick = async (imageId: string) => {
    console.debug('RightPanel.handleDoubleClick', { imageId });
    // Clear current selection and select only the double-clicked image
    clearSelection();
    const { safeToggleSelect } = useImageStore.getState();
    await safeToggleSelect(imageId, { ctrlKey: false, shiftKey: false }, async (currentId: string, newId: string) => {
      // For now, just return true to allow the switch - the MiddlePanel will handle the dialog
      // This needs to be coordinated with MiddlePanel for proper UX
      return true;
    });
    setSelection(imageId);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case 'Escape':
          clearSelection();
          break;
        case 'a':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleSelectAll();
          }
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedCount > 0) {
            handleBulkDelete();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCount, clearSelection, handleSelectAll, handleBulkDelete]);

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
    <div className="h-full flex flex-col">
      {/* Bulk Operations Toolbar */}
      {selectedCount > 0 && (
        <div className="p-4 bg-[var(--bg-tertiary)] border-b border-[var(--border)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {selectedCount} image{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleBulkDownload}
            disabled={isProcessing}
          >
            Download Selected
          </Button>
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isProcessing}
          >
            Delete Selected
          </Button>
          <Button
            variant="ghost"
            onClick={clearSelection}
          >
            Clear Selection
          </Button>
        </div>
      </div>
      )}
      
      {/* Header with Select All */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="font-semibold">Gallery</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleSelectAll}
            className="text-xs"
          >
            {selectedCount === images.length ? 'Deselect All' : 'Select All'}
          </Button>
          <span className="text-xs text-[var(--text-secondary)]">
            {images.length} image{images.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {/* Image Grid */}
      <div className="flex-1 p-4 grid gap-4 auto-rows-[120px] grid-cols-[repeat(auto-fill,minmax(120px,1fr))] overflow-auto">
        {images.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No images yet.</p>}
        {images.map((img) => (
          <ImageCard
            key={img.id}
            image={img}
            selected={storeSelected.has(img.id)}
            onClick={(e) => {
              // Handle single click selection with keyboard modifiers
              toggleSelect(img.id, e);
            }}
            onDoubleClick={() => handleDoubleClick(img.id)}
          />
        ))}
      </div>
      

    </div>
  );
}
