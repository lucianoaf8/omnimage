import clsx from 'clsx';

interface Props {
  onMouseDown: (e: React.MouseEvent) => void;
  side: 'left' | 'right';
}

export default function ResizeHandle({ onMouseDown, side }: Props) {
  const common = 'absolute top-0 h-full w-1 cursor-col-resize bg-[var(--border)] hover:bg-[var(--accent-blue)]';
  return <div className={clsx(common, side === 'left' ? 'right-0' : 'left-0')} onMouseDown={onMouseDown} />;
}
