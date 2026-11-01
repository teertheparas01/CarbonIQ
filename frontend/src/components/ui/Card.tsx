import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  hover?: boolean;
  glass?: boolean;
  elevated?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padded, hover, glass = true, elevated, children, ...props }, ref) => {
    const glassStyles = glass 
      ? (elevated 
          ? 'glass-card glass-card--elevated' 
          : hover 
            ? 'glass-card glass-card--interactive' 
            : 'glass-card')
      : '';

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-2xl transition-all duration-200',
          glassStyles,
          padded && 'p-6',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('glass-card__header rounded-t-2xl', className)} {...props}>
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('glass-card__content', className)} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('glass-card__footer rounded-b-2xl', className)} {...props}>
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';