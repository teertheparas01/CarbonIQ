import { motion, useReducedMotion, Variants } from "motion/react";
import { clsx } from "clsx";

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
  className,
  staggerDelay = 0.05,
  delayChildren = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={clsx("flex flex-col gap-4", className)}
      initial={reduce ? false : "hidden"}
      animate={reduce ? false : "visible"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: reduce ? 0 : staggerDelay,
            delayChildren: reduce ? 0 : delayChildren,
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
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={clsx(className)}
      initial={reduce ? false : "hidden"}
      animate={reduce ? false : "visible"}
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
  onClick?: () => void;
}

export const ElevatedCard = ({
  children,
  className,
  elevated = false,
  interactive = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}) => {
  const reduce = useReducedMotion();

  const baseVariants: Variants = {
    initial: { y: 0, boxShadow: "var(--shadow-card)" },
    hover: {
      y: reduce ? 0 : -4,
      boxShadow: "var(--shadow-card-hover)",
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    tap: {
      y: 0,
      boxShadow: "var(--shadow-card-active)",
      transition: { duration: 0.05 },
    },
    elevated: {
      y: 0,
      boxShadow: "var(--shadow-elevated)",
    },
  };

  return (
    <motion.div
      className={clsx("card", elevated && "card--elevated", interactive && "card--interactive")}
      initial={false}
      animate={elevated ? "elevated" : "initial"}
      whileHover={interactive ? "hover" : undefined}
      whileTap="tap"
      variants={baseVariants}
      onClick={() => {}}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); } }}
    >
      {children}
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
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const reduce = useReducedMotion();

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
      className={`btn btn-${variant} ${size !== "md" ? `btn-${size}` : ""} ${props.className || ""}`}
      whileHover="hover"
      whileTap="tap"
      variants={baseVariants}
      animate={loading ? "loading" : "initial"}
      {...props}
    >
      {loading ? (
        <motion.span
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          style={{ width: 16, height: 16 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </motion.span>
      ) : (
        <>
          {props.leftIcon && <span className="flex-shrink-0" aria-hidden="true">{props.leftIcon}</span>}
          <span>{children}</span>
          {props.rightIcon && <span className="flex-shrink-0" aria-hidden="true">{props.rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}

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

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
  showClose = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}) => {
  const reduce = useReducedMotion();

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
            {true && (
              <motion.button
                className="modal-close"
                onClick={() => {}}
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

/* ========================================
   TOAST / NOTIFICATION
   ======================================== */

export const Toast = ({
  id,
  type,
  title,
  message,
  onClose,
  duration = 5000,
}: {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message?: string;
  onClose: (id: string) => void;
  duration?: number;
}) => {
  const reduce = useReducedMotion();

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
        {({
          success: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
          warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
          error: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-red-600"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
          info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-blue-600"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>,
        })[type]}
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
  const reduce = useReducedMotion();

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
            onClick={() => {}}
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
  const reduce = useReducedMotion();

  const variantStyles = {
    text: { height: "1rem", width: "100%", borderRadius: "var(--radius-md)" },
    title: { height: "1.5rem", width: "60%", borderRadius: "var(--radius-md)" },
    card: { height: "120px", width: "100%", borderRadius: "var(--radius-xl)" },
    avatar: { width: "40px", height: "40px", borderRadius: "50%" },
    circle: { width: "40px", height: "40px", borderRadius: "50%" },
    rect: { width: "100%", height: "100%", borderRadius: "var(--radius-lg)" },
  };

  const style = {
    ...variantStyles[variant],
    width: width ?? variantStyles[variant].width,
    height: height ?? variantStyles[variant].height,
  } as React.CSSProperties;

  return (
    <motion.div
      className={clsx("skeleton", className)}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      animate={{
        backgroundPosition: animation === "shimmer" ? ["200% 0", "-200% 0"] : undefined,
        opacity: animation === "pulse" ? [0.4, 1, 0.4] : undefined,
      }}
      transition={{
        backgroundPosition: animation === "shimmer" ? { duration: 1.5, repeat: Infinity, ease: "linear" } : undefined,
        opacity: animation === "pulse" ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : undefined,
      }}
      style={{ ...style, display: "block" } as React.CSSProperties}
    />
  );
};

const variantStyles = {
  text: { height: "1rem", width: "100%", borderRadius: "var(--radius-md)" },
  title: { height: "1.5rem", width: "60%", borderRadius: "var(--radius-md)" },
  card: { height: "120px", width: "100%", borderRadius: "var(--radius-xl)" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%" },
  circle: { width: "40px", height: "40px", borderRadius: "50%" },
  rect: { width: "100%", height: "100%", borderRadius: "var(--radius-lg)" },
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
  const reduce = useReducedMotion();
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
        transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, duration: 0.8 }}
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