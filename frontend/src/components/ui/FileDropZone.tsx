import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import apiService from '../../services/apiService';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';

interface Props {}

export default function FileDropZone(_props: Props) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setUploading(true);
      try {
        for (const file of acceptedFiles) await apiService.uploadImage(file);
        await queryClient.invalidateQueries({ queryKey: ['images'] });
      } finally {
        setUploading(false);
      }
    },
    [queryClient]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-4 hover:border-[var(--accent-blue)] cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] hover:bg-[var(--bg-secondary)]"
    >
      <input {...getInputProps()} />
      {uploading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="text-sm">
            {isDragActive ? 'Drop files here...' : 'Drag & drop images here, or click to browse'}
          </p>
          <Button variant="secondary">Browse files</Button>
        </>
      )}
    </div>
  );
}
