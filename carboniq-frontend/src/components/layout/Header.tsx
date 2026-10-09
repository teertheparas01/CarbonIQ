import { useHealth } from '../../hooks';
import { Badge } from '../ui';
import { motion, useReducedMotion } from "motion/react";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { status, health } = useHealth();
  const reduce = useReducedMotion();

  const statusConfig = {
    checking: { variant: 'neutral' as const, label: 'Checking...' },
    connected: { variant: 'success' as const, label: 'Backend connected' },
    unavailable: { variant: 'warning' as const, label: 'Backend unavailable' },
  };

  const config = statusConfig[status];

  return (
    <motion.header
      className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-brand-100/50"
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
    >
      <motion.div
        className="max-w-7xl mx-auto px-8 py-4 sm:px-10 lg:px-12 flex items-center justify-between gap-4"
        initial={reduce ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="flex-1 min-w-0"
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 30 }}
        >
          <h1 className="text-xl font-semibold text-brand-950 truncate">{title}</h1>
          {description && (
            <motion.p
              className="mt-1 text-sm text-brand-500 truncate"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            >
              {description}
            </motion.p>
          )}
        </motion.div>
        <motion.div
          className="flex items-center gap-3 shrink-0"
          initial={reduce ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.span
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 30 }}
          >
            <Badge variant={config.variant} size="sm" className="whitespace-nowrap">
              {config.label}
            </Badge>
          </motion.span>
          {health && (
            <motion.span
              className="text-xs text-brand-400 hidden sm:block font-mono"
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            >
              {health.model_name}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
    </motion.header>
  );
}