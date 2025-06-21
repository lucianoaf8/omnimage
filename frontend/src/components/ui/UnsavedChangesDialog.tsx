import React from 'react';
import Button from './Button';

export interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onSave: () => Promise<void>;
  onDiscard: () => void;
  onCancel: () => void;
  currentImageName?: string;
  newImageName?: string;
}

export default function UnsavedChangesDialog({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
  currentImageName,
  newImageName
}: UnsavedChangesDialogProps) {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Unsaved Changes
          </h3>
        </div>
        
        <div className="text-[var(--text-secondary)] mb-6">
          <p className="mb-2">
            You have unsaved changes to <strong>{currentImageName || 'the current image'}</strong>.
          </p>
          <p>
            Do you want to save your changes before switching to <strong>{newImageName || 'the new image'}</strong>?
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onDiscard}
            disabled={isSaving}
          >
            Discard Changes
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}