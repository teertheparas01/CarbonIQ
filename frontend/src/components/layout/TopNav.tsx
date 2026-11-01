import { NAV_ITEMS, type NavItem } from '../../types/navigation';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import type { ReactElement } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Flame, Settings as SettingsIcon, ChevronDown } from 'lucide-react';
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
  Flame: <Flame className="w-4 h-4 shrink-0" strokeWidth={2} />,
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
  Settings: <SettingsIcon className="w-4 h-4 shrink-0" strokeWidth={2} />,
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
    { label: 'Preferences', href: '/settings', icon: <SettingsIcon className="w-4 h-4" strokeWidth={2} /> },
    { label: 'Model Info', href: '/settings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { label: 'Documentation', href: '/todo-not-todo', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-brand-700 hover:bg-brand-100/60 hover:text-brand-950 transition-all duration-200 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Settings"
      >
        <SettingsIcon className="w-4 h-4 shrink-0" strokeWidth={2} />
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl glass glass--strong glass--highlighted py-1.5 z-50 pointer-events-auto"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96, transition: { duration: reduce ? 0 : 0.12 } }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            role="menu"
          >
            <div className="px-3 py-1.5 border-b border-brand-100/50 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">Settings</span>
            </div>
            {settingsItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="glass-tab flex items-center gap-3 px-3 py-2 text-xs sm:text-sm font-medium text-brand-700 mx-1.5"
                role="menuitem"
              >
                <span className="flex-shrink-0 text-brand-500 p-2 rounded-lg glass glass--subtle">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopNav() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <motion.header
      className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none"
      aria-label="Main navigation"
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex items-center justify-center w-full max-w-5xl mx-auto">
        {/* Single Unified OnePlus Frosted Glass Capsule */}
        <motion.nav
          className="oneplus-glass flex items-center justify-between gap-1.5 sm:gap-3 px-3 py-1.5 pointer-events-auto shadow-lg"
          aria-label="Main navigation"
          initial={reduce ? false : { opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Brand - Left */}
          <Link
            to="/"
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-full text-brand-950 hover:opacity-85 transition-opacity shrink-0"
          >
            <div className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center text-emerald-300 shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                <path d="M12 2v20M12 2a10 10 0 0 1 0 20" />
                <path d="M2 12h20M2 12a10 10 0 0 1 20 0" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:inline">CarbonIQ</span>
          </Link>

          {/* Vertical divider */}
          <div className="h-4 w-px bg-brand-200/70 hidden sm:block shrink-0" />

          {/* Nav Links - Center */}
          <motion.ul
            className="relative z-10 flex items-center justify-center gap-0.5 sm:gap-1"
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
                      'flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap',
                      isActive
                        ? 'bg-brand-700 text-white shadow-[0_2px_8px_-2px_rgba(5,31,32,0.35)]'
                        : 'text-brand-700 hover:bg-brand-100/60 hover:text-brand-950'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="flex-shrink-0" style={{ color: isActive ? 'inherit' : 'currentColor' }}>
                      {Icon}
                    </span>
                    <MarqueeText text={item.label} className="hidden md:inline" />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Vertical divider */}
          <div className="h-4 w-px bg-brand-200/70 hidden sm:block shrink-0" />

          {/* Settings Dropdown - Right */}
          <div className="shrink-0">
            <SettingsDropdown />
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
}