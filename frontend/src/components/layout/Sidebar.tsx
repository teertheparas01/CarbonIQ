import { NAV_ITEMS, type NavItem } from '../../types/navigation';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import type { ReactElement } from 'react';
import { motion, useReducedMotion } from "motion/react";

const ICON_MAP: Record<string, ReactElement> = {
  LayoutDashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2.54-1-3.5a2.5 2.5 0 0 0-5 0c-.5.96-1 2.12-1 3.5a2.5 2.5 0 0 0 5 0z" />
      <path d="M12 2c0 1.38-.5 2.54-1 3.5a2.5 2.5 0 0 0 5 0c-.5-.96-1-2.12-1-3.5A2.5 2.5 0 0 0 12 2z" />
    </svg>
  ),
  Droplets: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  Car: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 13.5 10c-3.6 0-6.8 1.5-8.8 3.8C3.5 15.7 2.8 16.5 2 17" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  TrendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  CheckSquare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <motion.aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-brand-100/50 flex flex-col',
        className
      )}
      aria-label="Main navigation"
      initial={reduce ? false : { x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div
        className="flex h-16 items-center px-6 border-b border-brand-100/50"
        initial={reduce ? false : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 25 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-white">
              <path d="M12 2v20M12 2a10 10 0 0 1 0 20" />
              <path d="M2 12h20M2 12a10 10 0 0 1 20 0" />
            </svg>
          </motion.div>
          <motion.span
            className="text-brand-950 font-semibold text-lg tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
          >
            CarbonIQ
          </motion.span>
        </div>
      </motion.div>

      <nav className="flex-1 py-5 px-3 overflow-y-auto scrollbar-thin" aria-label="Navigation">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item: NavItem, index) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = ICON_MAP[item.icon];
            return (
              <motion.li
                key={item.path}
                initial={reduce ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : 0.1 + index * 0.03, type: "spring", stiffness: 300, damping: 30 }}
              >
                <a
                  href={item.path}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-brand-100 text-brand-950 font-semibold shadow-sm'
                      : 'text-brand-500 hover:bg-brand-50 hover:text-brand-900'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex-shrink-0" style={{ color: isActive ? 'inherit' : 'currentColor' }}>
                    {Icon}
                  </span>
                  <span>{item.label}</span>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      <motion.div
        className="p-4 border-t border-brand-100/50"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="text-xs text-brand-400 text-center font-medium">
          CarbonIQ
        </div>
      </motion.div>
    </motion.aside>
  );
}