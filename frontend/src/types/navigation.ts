export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/electricity', label: 'Electricity', icon: 'Zap' },
  { path: '/lpg', label: 'LPG', icon: 'Flame' },
  { path: '/transport', label: 'Transport', icon: 'Car' },
  { path: '/forecast', label: 'Forecast', icon: 'TrendingUp' },
  { path: '/todo-not-todo', label: "Do's & Don'ts", icon: 'CheckSquare' },
] as const;

export type NavPath = typeof NAV_ITEMS[number]['path'];