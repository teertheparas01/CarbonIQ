import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface PageContainerProps extends HTMLAttributes<HTMLElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthStyles: Record<string, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, maxWidth = 'xl', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex-1 w-full px-8 py-8 sm:px-10 lg:px-12',
          maxWidthStyles[maxWidth],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PageContainer.displayName = 'PageContainer';