export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/electricity', label: 'Electricity', icon: 'Zap' },
  { path: '/forecast', label: 'Forecast', icon: 'TrendingUp' },
] as const;

export type NavPath = typeof NAV_ITEMS[number]['path'];