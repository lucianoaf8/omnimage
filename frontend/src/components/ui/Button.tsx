import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const base =
  'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--accent-blue)] text-white hover:bg-opacity-90 shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-blue)]',
  secondary:
    'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)]',
  destructive:
    'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent hover:bg-[var(--selection)]',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, children, ...props }, ref) => {
    const classes = twMerge(clsx(base, variantClasses[variant], className));
    return (
      <button ref={ref} className={classes} disabled={loading || props.disabled} {...props}>
        {loading && <span className="mr-2 animate-spin">⏳</span>}
        {children}
      </button>
    );
  }
);

export default Button;
