import clsx from 'clsx';
import { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out p-6 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
