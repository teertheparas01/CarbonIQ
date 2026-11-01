import { motion, useReducedMotion, type Variants } from "motion/react";
import { clsx } from "clsx";
import { useState } from "react";

/* ========================================
   STAGGERED CARD ENTRANCE
   ======================================== */

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 30,
      duration: 0.5,
    },
  },
};

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 30 },
  },
};

export interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
}

export const StaggerContainer = ({
  children,
  staggerDelay = 0.05,
  delayChildren = 0.1,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
}) => {
  return (
    <motion.div
      className={clsx("flex flex-col gap-4")}
      initial={false}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  customVariants?: Variants;
}

export const StaggerItem = ({
  children,
  className,
  customVariants,
}: {
  children: React.ReactNode;
  className?: string;
  customVariants?: Variants;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <motion.div
      className={clsx(className)}
      initial={false}
      animate="visible"
      variants={customVariants || cardVariants}
      style={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};

/* ========================================
   CARD HOVER ELEVATION
   ======================================== */

export interface ElevatedCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
  glass?: boolean;
}

export const ElevatedCard = ({
  children,
  className,
  elevated = false,
  interactive = false,
  glass = true,
}: {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
  glass?: boolean;
}) => {
  const reduce = useReducedMotion();

  const baseVariants: Variants = {
    initial: { y: 0, boxShadow: glass ? "var(--glass-shadow-base)" : "var(--shadow-card)" },
    hover: {
      y: reduce ? 0 : -4,
      boxShadow: glass ? "var(--glass-shadow-lg)" : "var(--shadow-card-hover)",
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    tap: {
      y: 0,
      boxShadow: glass ? "var(--glass-shadow-base)" : "var(--shadow-card-active)",
      transition: { duration: 0.05 },
    },
    elevated: {
      y: 0,
      boxShadow: glass ? "var(--glass-shadow-xl)" : "var(--shadow-elevated)",
    },
  };

  const glassClass = glass
    ? (elevated
        ? 'glass-card glass-card--elevated'
        : interactive
          ? 'glass-card glass-card--interactive'
          : 'glass-card')
    : '';

  return (
    <motion.div
      className={clsx(glassClass, className)}
      initial={false}
      animate={elevated ? "elevated" : "initial"}
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      variants={baseVariants}
    >
      {children}
    </motion.div>
  );
};

/* ========================================
   APPLE-LIKE GLASS CARD ANIMATIONS
   ======================================== */

// Spring config for Apple-like feel
const APPLE_SPRING = { type: "spring", stiffness: 280, damping: 22 } as const;

// Glass card with Apple-like interactions
export const GlassCard = ({
  children,
  className,
  elevated = false,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
}) => {
  const reduce = useReducedMotion();

  const baseVariants: Variants = {
    initial: { 
      y: 0, 
      boxShadow: "var(--glass-shadow-base)",
      scale: 1,
    },
    hover: {
      y: reduce ? 0 : -6,
      boxShadow: "var(--glass-shadow-xl)",
      scale: 1.01,
      transition: { type: "spring", stiffness: 250, damping: 22 },
    },
    tap: {
      y: reduce ? 0 : -2,
      scale: 0.985,
      boxShadow: "var(--glass-shadow-lg)",
      transition: { duration: 0.08, ease: [0.4, 0, 0.2, 1] },
    },
    elevated: {
      y: 0,
      boxShadow: "var(--glass-shadow-xl)",
    },
  };

  return (
    <motion.div
      className={clsx(
        'glass-card',
        elevated && 'glass-card--elevated',
        interactive && 'glass-card--interactive',
        className
      )}
      initial={false}
      animate={elevated ? "elevated" : "initial"}
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      variants={baseVariants}
    >
      {children}
      {/* Glass highlight edge */}
      <div className="glass-highlight-edge" aria-hidden="true" />
    </motion.div>
  );
};

// Apple-style button with ripple effect
export const GlassButton = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const reduce = useReducedMotion();
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!reduce) {
      const rect = e.currentTarget.getBoundingClientRect();
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setRipple(null), 400);
    }
    onClick?.();
  };

  const variantClasses = {
    primary: 'glass-btn glass-btn--primary',
    secondary: 'glass-btn glass-btn--secondary',
    ghost: 'glass-btn glass-btn--ghost',
    danger: 'glass-btn glass-btn--danger',
  };

  const sizeClasses = {
    sm: 'glass-btn--sm',
    md: 'glass-btn--md',
    lg: 'glass-btn--lg',
  };

  return (
    <button
      className={clsx(
        'glass-button-apple',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {ripple && (
        <motion.span
          className="glass-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        />
      )}
      {loading ? (
        <motion.span
          className="glass-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          style={{ width: 18, height: 18 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </motion.span>
      ) : (
        <span className="glass-button-content">{children}</span>
      )}
    </button>
  );
};

// Apple-style number display with count animation
export const GlassStat = ({
  value,
  label,
  unit,
  trend,
  icon,
  iconColor,
  className,
  animateValue = true,
}: {
  value: string | number;
  label: string;
  unit?: string;
  trend?: { value: string; positive: boolean; label?: string };
  icon?: React.ReactNode;
  iconColor?: string;
  className?: string;
  animateValue?: boolean;
}) => {
  const reduce = useReducedMotion();
  
  return (
    <motion.div
      className={clsx('glass-stat glass-card--interactive', className)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
      whileHover={{ y: -4, scale: 1.01, transition: APPLE_SPRING }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {icon && (
            <motion.div
              className="mb-3 p-2.5 rounded-xl glass glass--highlighted"
              style={{ borderColor: 'var(--glass-border-subtle)' }}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            >
              <span className="text-lg" style={{ color: iconColor }}>{icon}</span>
            </motion.div>
          )}
          <motion.p
            className="text-sm font-medium text-brand-500 uppercase tracking-wider mb-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {label}
          </motion.p>
          <motion.div
            className="flex items-baseline gap-1.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span
              className="glass-stat__value"
              initial={animateValue && !reduce ? { opacity: 0, scale: 0.5 } : { opacity: 1 }}
              animate={animateValue && !reduce ? { opacity: 1, scale: 1 } : { opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
            >
              {value}
              {unit && <span className="text-lg font-normal text-brand-500 ml-1">{unit}</span>}
            </motion.span>
          </motion.div>
          {trend && (
            <motion.div
              className="glass-stat__trend mt-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {trend.positive ? (
                <motion.svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}>
                  <path d="M18 15l-6-6-6 6" />
                </motion.svg>
              ) : (
                <motion.svg className="w-3.5 h-3.5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" initial={{ rotate: 90 }} animate={{ rotate: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 15 }}>
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              )}
              <motion.span
                className={clsx('font-medium', trend.positive ? 'text-emerald-600' : 'text-rose-600')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
              >
                {trend.value}
              </motion.span>
              {trend.label && (
                <span className="text-brand-500">{trend.label}</span>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ========================================
   BUTTON INTERACTIONS
   ======================================== */

interface MotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const MotionButton = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
}: MotionButtonProps) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== "md" ? `btn-${size}` : "";

  const baseVariants: Variants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.01,
      transition: { duration: 0.12, ease: [0.16, 1, 0.3, 1] as const },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.05 },
    },
    loading: {
      scale: 1,
    },
  };

  return (
    <motion.button
      disabled={disabled || loading}
      className={`btn ${variantClass} ${sizeClass} ${className || ""}`}
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      variants={baseVariants}
      animate={loading ? "loading" : "initial"}
    >
      {loading ? (
        <motion.span
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" as const }}
          style={{ width: 16, height: 16 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </motion.span>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

/* ========================================
   FADE/SLIDE MODAL
   ======================================== */

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -8,
    transition: { duration: 0.1 },
  },
};

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
  showClose = true,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={overlayVariants}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className={`modal-content ${sizeClasses[size]} ${className || ""}`}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
            {showClose && (
              <motion.button
                className="modal-close"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ========================================
   TOAST / NOTIFICATION
   ======================================== */

export const Toast = ({
  type,
  title,
  message,
}: {
  type: "success" | "warning" | "error" | "info";
  title: string;
  message?: string;
}) => {
  const iconMap = {
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-600">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-600">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-red-600">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-600">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <motion.div
      layout
      className={`toast toast-${type}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon" aria-hidden="true">
        {iconMap[type]}
      </div>
      <div className="toast-content">
        <p className="toast-title">{title}</p>
        {message && <p className="toast-message">{message}</p>}
      </div>
      <motion.button
        className="toast-close"
        onClick={() => {}}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Dismiss"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

/* ========================================
   DROPDOWN MENU
   ======================================== */

export const Dropdown = ({
  trigger,
  items,
  align = "right",
  className,
}: {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
  }>;
  align?: "left" | "right";
  className?: string;
}) => {
  return (
    <motion.div className={`dropdown ${className || ""}`}>
      <span className="dropdown-trigger">{trigger}</span>
      <motion.div
        className={`dropdown-menu ${align === "left" ? "left-0" : "right-0"}`}
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        role="menu"
      >
        {items.map((item, index) => (
          <motion.button
            key={index}
            className={`dropdown-item ${item.danger ? "text-red-600" : ""} ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={item.disabled ? undefined : () => item.onClick()}
            disabled={item.disabled}
            role="menuitem"
            whileHover={{ backgroundColor: item.danger ? "#FEF2F2" : "var(--color-brand-50)", x: 4, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02, type: "spring", stiffness: 300, damping: 30 }}
          >
            {item.icon && <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ========================================
   SKELETON LOADERS
   ======================================== */

const variantStyles = {
  text: { height: "1rem", width: "100%", borderRadius: "var(--radius-md)" },
  title: { height: "1.5rem", width: "60%", borderRadius: "var(--radius-md)" },
  card: { height: "120px", width: "100%", borderRadius: "var(--radius-xl)" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%" },
  circle: { width: "40px", height: "40px", borderRadius: "50%" },
  rect: { width: "100%", height: "100%", borderRadius: "var(--radius-lg)" },
};

export const Skeleton = ({
  className,
  variant = "text",
  width,
  height,
  animation = "shimmer",
}: {
  className?: string;
  variant?: "text" | "title" | "card" | "avatar" | "circle" | "rect";
  width?: string | number;
  height?: string | number;
  animation?: "shimmer" | "pulse" | "wave";
}) => {
  const style = {
    ...variantStyles[variant],
    width: width ?? variantStyles[variant].width,
    height: height ?? variantStyles[variant].height,
  } as React.CSSProperties;

  const animateProps = {
    opacity: 1,
    ...(animation === "shimmer" ? { backgroundPosition: ["200% 0", "-200% 0"] } : {}),
    ...(animation === "pulse" ? { opacity: [0.4, 1, 0.4] } : {}),
  };

  const transitionProps = {
    duration: 0.3,
    ...(animation === "shimmer" ? { duration: 1.5, repeat: Infinity, ease: "linear" as const } : {}),
    ...(animation === "pulse" ? { duration: 1, repeat: Infinity, ease: "easeInOut" as const } : {}),
  };

  return (
    <motion.div
      className={clsx("skeleton", className)}
      style={style}
      initial={{ opacity: 0 }}
      animate={animateProps}
      transition={transitionProps}
    />
  );
};

/* ========================================
   PROGRESS BAR
   ======================================== */

export const Progress = ({
  value,
  max = 100,
  className,
  showLabel = false,
  variant = "default",
}: {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "error";
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colorMap = {
    default: "var(--color-brand-700)",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#EF4444",
  };

  return (
    <div className={clsx("progress", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={showLabel ? `${percentage}%` : undefined}>
      <motion.div
        className="progress-bar"
        style={{ backgroundColor: colorMap[variant], width: `${percentage}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.8 }}
      />
      {showLabel && <span className="text-supporting text-right mt-1">{percentage}%</span>}
    </div>
  );
};

/* ========================================
   EXPORTS
   ======================================== */

export { useReducedMotion } from "motion/react";
export { clsx } from "clsx";
export type { Variants } from "motion/react";