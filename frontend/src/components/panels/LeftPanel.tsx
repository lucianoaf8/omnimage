import * as Collapsible from '@radix-ui/react-collapsible';
import { useUiStore } from '../../stores/uiStore';
import { useAppState } from '../../hooks/useAppState';
import TransformPanel from './LeftPanel/TransformPanel';
import { ViewerTransform } from '../panels/MiddlePanel/ImageViewer';
import { useState, useEffect } from 'react';
import { persistenceService } from '../../services/persistenceService';

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

function ToolSection({ title, children }: SectionProps) {
  const { collapsed, toggleCollapse } = useUiStore();
  const key = title.toLowerCase();
  const open = !collapsed[key];
  return (
    <Collapsible.Root open={open} onOpenChange={() => toggleCollapse(key)} className="border-b border-[var(--border)] last:border-b-0">
      <Collapsible.Trigger className="w-full px-4 py-3 text-left hover:bg-[var(--selection)] flex items-center justify-between transition-all duration-200 ease-in-out rounded-lg mx-2 my-1 hover:shadow-sm">
        <span className="font-medium">{title}</span>
        <span className="transition-transform duration-200 ease-in-out" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>{open ? '▾' : '▸'}</span>
      </Collapsible.Trigger>
      <Collapsible.Content className="px-4 py-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-tertiary)] mx-2 rounded-lg mb-2">
        {children || 'Coming soon…'}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default function LeftPanel() {
  const { images, selected } = useAppState();
  const firstId = Array.from(selected)[0];
  const image = images.find((i) => i.id === firstId);
  const [transform, setTransform] = useState<ViewerTransform>({
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    flipX: false,
    flipY: false
  });

  // Load saved transform when image changes
  useEffect(() => {
    if (image?.id) {
      const savedState = persistenceService.loadImageState(image.id);
      if (savedState) {
        setTransform(savedState.transform);
      }
    }
  }, [image?.id]);

  const handleTransformChange = (newTransform: ViewerTransform) => {
    setTransform(newTransform);
    if (image?.id) {
      const savedState = persistenceService.loadImageState(image.id);
      persistenceService.saveImageState(image.id, newTransform, savedState?.annotations || []);
    }
    // TODO: Communicate with ImageViewer component
  };

  const handleFitToScreen = () => {
    const fitTransform = { ...transform, zoom: 1, panX: 0, panY: 0 };
    handleTransformChange(fitTransform);
  };

  const handleResetTransform = () => {
    const resetTransform = {
      zoom: 1,
      panX: 0,
      panY: 0,
      rotation: 0,
      flipX: false,
      flipY: false
    };
    handleTransformChange(resetTransform);
  };

  return (
    <div className="h-full overflow-auto text-sm p-2">
      <ToolSection title="Upload">
        <div className="text-xs text-[var(--text-secondary)]">
          Drag & drop images into the middle panel or use the file browser.
        </div>
      </ToolSection>
      
      <ToolSection title="Transform">
        {image ? (
          <TransformPanel
            transform={transform}
            onTransformChange={handleTransformChange}
            onFitToScreen={handleFitToScreen}
            onResetTransform={handleResetTransform}
          />
        ) : (
          <div className="text-xs text-[var(--text-secondary)]">
            Select an image to access transform controls.
          </div>
        )}
      </ToolSection>
      
      <ToolSection title="Settings">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">Show grid</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Snap to pixels</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">High quality zoom</span>
            <input type="checkbox" className="rounded" defaultChecked />
          </div>
        </div>
      </ToolSection>
    </div>
  );
}
