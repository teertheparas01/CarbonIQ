import { NAV_ITEMS, type NavItem } from '../../types/navigation';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import type { ReactElement } from 'react';
import { motion, useReducedMotion } from "motion/react";
import { CaretDown } from '@phosphor-icons/react';
import { useState, useRef, useEffect } from 'react';

const ICON_MAP: Record<string, ReactElement> = {
  LayoutDashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2.54-1-3.5a2.5 2.5 0 0 0-5 0c-.5.96-1 2.12-1 3.5a2.5 2.5 0 0 0 5 0z" />
      <path d="M12 2c0 1.38-.5-2.54-1-3.5a2.5 2.5 0 0 0 5 0c-.5-.96-1-2.12-1-3.5A2.5 2.5 0 0 0 12 2z" />
    </svg>
  ),
  Droplets: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  Car: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 13.5 10c-3.6 0-6.8 1.5-8.8 3.8C3.5 15.7 2.8 16.5 2 17" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  TrendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  CheckSquare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

// Marquee text component for long labels - compact version
function MarqueeText({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce || text.length <= 12) {
    return <span className={clsx("whitespace-nowrap", className)}>{text}</span>;
  }
  return (
    <span className={clsx("relative inline-block overflow-hidden", className)} style={{ width: "90px" }}>
      <motion.span
        className="whitespace-nowrap"
        initial={{ x: 0 }}
        animate={{ x: [-2, -100] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        {text} &nbsp; {text} &nbsp;
      </motion.span>
    </span>
  );
}

// Settings dropdown component
function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const reduce = useReducedMotion();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const settingsItems = [
    { label: 'Profile', href: '/settings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { label: 'Preferences', href: '/settings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    { label: 'Model Info', href: '/settings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { label: 'Documentation', href: '/todo-not-todo', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-brand-500 hover:bg-brand-50 hover:text-brand-900 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <CaretDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-brand-100/50 shadow-lg py-1"
          initial={reduce ? false : { opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.01 } }}
          role="menu"
        >
          {settingsItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => {}}
              className="flex items-center gap-3 px-4 py-2 text-sm text-brand-600 hover:bg-brand-50 hover:text-brand-900 transition-colors"
              role="menuitem"
            >
              <span className="flex-shrink-0 text-brand-500">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function TopNav() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none"
      aria-label="Main navigation"
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="relative flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Brand - Left corner */}
        <motion.div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-700/90 hover:bg-brand-700 text-white shadow-md backdrop-blur-md border border-brand-600/30 pointer-events-auto transition-colors"
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, scale: [1, 1.02, 1] }}
          transition={{
            opacity: { delay: 0.15, type: "spring", stiffness: 300, damping: 30 },
            x: { delay: 0.15, type: "spring", stiffness: 300, damping: 30 },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-emerald-300">
            <path d="M12 2v20M12 2a10 10 0 0 1 0 20" />
            <path d="M2 12h20M2 12a10 10 0 0 1 20 0" />
          </svg>
          <span className="text-sm font-semibold tracking-tight">CarbonIQ</span>
        </motion.div>

        {/* Nav Capsules - Perfectly Centered */}
        <motion.nav
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-xl rounded-[9999px] border border-brand-100/70 shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto"
          aria-label="Main navigation"
          initial={reduce ? false : { opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.ul
            className="flex items-center justify-center gap-1"
            role="list"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {NAV_ITEMS.map((item: NavItem, index) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              const Icon = ICON_MAP[item.icon];
              return (
                <motion.li
                  key={item.path}
                  initial={reduce ? false : { opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: reduce ? 0 : 0.15 + index * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Link
                    to={item.path}
                    className={clsx(
                      'flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-brand-700 text-white shadow-[0_2px_8px_-2px_rgba(5,31,32,0.3)]'
                        : 'text-brand-600 hover:bg-brand-50 hover:text-brand-950'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="flex-shrink-0" style={{ color: isActive ? 'inherit' : 'currentColor' }}>
                      {Icon}
                    </span>
                    <MarqueeText text={item.label} className="hidden sm:inline" />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.nav>

        {/* Settings Dropdown - Right side */}
        <div className="pointer-events-auto">
          <SettingsDropdown />
        </div>
      </div>
    </motion.header>
  );
}