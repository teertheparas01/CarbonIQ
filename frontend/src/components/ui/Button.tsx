import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'glass-btn inline-flex items-center justify-center font-medium transition-all';
    
    const variantStyles = {
      primary: 'glass-btn--primary',
      secondary: 'glass-btn--secondary',
      ghost: 'glass-btn--ghost',
    };

    const sizeStyles = {
      sm: 'glass-btn--sm px-3.5 py-1.5 text-xs gap-1.5',
      md: 'glass-btn--md px-4.5 py-2.5 text-sm gap-2',
      lg: 'glass-btn--lg px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';