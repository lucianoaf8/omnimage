import clsx from 'clsx';
import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded border border-[var(--border)] bg-[var(--bg-secondary)] shadow-sm p-4',
        className
      )}
    >
      {children}
    </div>
  );
}
