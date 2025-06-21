import React, { useState } from 'react';
import Button from '../../ui/Button';

export interface ImageSavePanelProps {
  onSave: () => Promise<void>;
  onSaveCopy: () => Promise<void>;
  onReset: () => void;
  hasModifications: boolean;
}

export default function ImageSavePanel({ onSave, onSaveCopy, onReset, hasModifications }: ImageSavePanelProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSave = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCopy = async () => {
    setIsSaving(true);
    try {
      await onSaveCopy();
    } catch (error) {
      console.error('Save copy failed:', error);
      alert('Failed to save copy. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasModifications) {
    return null;
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--accent-yellow)] rounded-xl">
        <div className="text-sm text-[var(--text-primary)]">
          <strong>⚠️ Confirm Save</strong>
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          This will overwrite the original image file. This action cannot be undone.
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirmSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Yes, Save'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirmation(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          title="Save changes to original file"
        >
          💾 Save Image
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSaveCopy}
          disabled={isSaving}
          title="Save as copy with _copy suffix"
        >
          📋 Save Copy
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={isSaving}
          title="Discard all changes"
        >
          🔄 Reset
        </Button>
      </div>
    </div>
  );
}