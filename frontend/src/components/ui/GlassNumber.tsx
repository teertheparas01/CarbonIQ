import { forwardRef, type HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface GlassNumberProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  unit?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  trend?: { value: string; positive: boolean; label?: string };
  icon?: React.ReactNode;
  iconColor?: string;
}

export const GlassNumber = forwardRef<HTMLDivElement, GlassNumberProps>(
  ({ className, value, unit, label, size = 'md', trend, icon, iconColor, children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'glass-number px-3 py-2.5',
      md: 'glass-number px-4 py-3',
      lg: 'glass-number--lg px-5 py-4',
      xl: 'glass-number--xl px-6 py-5',
    };

    const valueFontSizes = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex flex-col items-start gap-1',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <div className="flex items-baseline gap-1.5">
          {icon && <span className="text-lg" style={{ color: iconColor }}>{icon}</span>}
          <span className={clsx('glass-number__value font-mono tabular-nums', valueFontSizes[size])}>
            {value}
            {unit && <span className="glass-number__unit font-sans">{unit}</span>}
          </span>
        </div>
        {label && <span className="glass-number__label text-xs uppercase tracking-wide">{label}</span>}
        {trend && (
          <div className="glass-stat__trend gap-1.5 mt-1">
            {trend.positive ? (
              <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
            <span className={clsx('font-medium text-sm', trend.positive ? 'text-emerald-600' : 'text-rose-600')}>
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-xs text-brand-500">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

GlassNumber.displayName = 'GlassNumber';

/* Glass Stat Card - for KPI/dashboard metrics */
export interface GlassStatProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  unit?: string;
  trend?: { value: string; positive: boolean; label?: string };
  icon?: React.ReactNode;
  iconColor?: string;
  bgColor?: string;
  interactive?: boolean;
}

export const GlassStat = forwardRef<HTMLDivElement, GlassStatProps>(
  ({ className, value, label, unit, trend, icon, iconColor, bgColor, interactive = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'glass-stat',
          interactive && 'glass-stat--interactive',
          className
        )}
        style={bgColor ? { '--glass-icon-bg': bgColor } as React.CSSProperties : undefined}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {icon && (
              <div className="mb-3 p-2.5 rounded-xl" style={{ background: 'var(--glass-icon-bg, color-mix(in srgb, white 30%, transparent))', border: '1px solid var(--glass-border-subtle)' }}>
                {typeof icon === 'object' && 'type' in icon ? (
                  <span className="text-lg" style={{ color: iconColor }}>{icon}</span>
                ) : (
                  icon
                )}
              </div>
            )}
            <p className="text-sm font-medium text-brand-500 uppercase tracking-wider mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
              <span className="glass-stat__value">
                {value}
                {unit && <span className="text-lg font-normal text-brand-500 ml-1">{unit}</span>}
              </span>
            </div>
            {trend && (
              <div className="glass-stat__trend mt-2">
                {trend.positive ? (
                  <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
                <span className={clsx('font-medium', trend.positive ? 'text-emerald-600' : 'text-rose-600')}>
                  {trend.value}
                </span>
                {trend.label && <span className="text-brand-500">{trend.label}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

GlassStat.displayName = 'GlassStat';