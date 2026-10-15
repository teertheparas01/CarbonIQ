import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-brand-50 text-brand-800 border border-brand-200/60',
      success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
      warning: 'bg-amber-50 text-amber-900 border border-amber-200/60',
      info: 'bg-sky-50 text-sky-800 border border-sky-200/60',
      neutral: 'bg-slate-50 text-slate-700 border border-slate-200/60',
    };

    const sizeStyles = {
      sm: 'px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
      md: 'px-3 py-1 text-xs font-semibold tracking-wide',
    };

    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center font-medium rounded-full',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';