import * as Collapsible from '@radix-ui/react-collapsible';
import { useUiStore } from '../../stores/uiStore';

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

function ToolSection({ title, children }: SectionProps) {
  const { collapsed, toggleCollapse } = useUiStore();
  const key = title.toLowerCase();
  const open = !collapsed[key];
  return (
    <Collapsible.Root open={open} onOpenChange={() => toggleCollapse(key)} className="border-b border-[var(--border)]">
      <Collapsible.Trigger className="w-full px-3 py-2 text-left hover:bg-[var(--selection)] flex items-center justify-between">
        <span>{title}</span>
        <span>{open ? '▾' : '▸'}</span>
      </Collapsible.Trigger>
      <Collapsible.Content className="px-3 py-2 text-sm text-[var(--text-secondary)]">
        {children || 'Coming soon…'}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default function LeftPanel() {
  return (
    <div className="h-full overflow-auto text-sm">
      <ToolSection title="Upload" />
      <ToolSection title="Transform" />
      <ToolSection title="Settings" />
    </div>
  );
}
