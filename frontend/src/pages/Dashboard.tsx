import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from "motion/react";
import { useForecast } from '../hooks';
import { ElevatedCard, StaggerContainer, StaggerItem, cardVariants } from '../lib/animations';
import { Button, Badge } from '../components/ui';
import { 
  Lightning, ArrowUpRight, ArrowDownRight, Gear, CaretRight,
  ChartBar, BatteryCharging
} from '@phosphor-icons/react';

interface KPIMetric {
  label: string;
  value: string;
  unit?: string;
  trend?: { value: string; label: string; positive: boolean };
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant: 'primary' | 'secondary';
}

interface DomainCardItem {
  key: string;
  label: string;
  status: string;
  description: string;
  badge: 'success' | 'neutral' | 'warning';
  href: string;
  featured: boolean;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  stat?: { value: string; unit: string; label: string };
}

const DOMAIN_CARDS: DomainCardItem[] = [
  {
    key: 'electricity',
    label: 'Electricity',
    status: 'Live',
    description: 'Forecasting & deterministic CO₂',
    badge: 'success',
    href: '/electricity',
    featured: true,
    icon: Lightning,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50 border-amber-100',
    stat: { value: '—', unit: 'kWh', label: 'Last forecast' },
  },
  {
    key: 'forecast',
    label: 'Forecast',
    status: 'Live',
    description: 'Next-month prediction',
    badge: 'success',
    href: '/forecast',
    featured: true,
    icon: ArrowUpRight,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50 border-emerald-100',
    stat: { value: '—', unit: 'kg CO₂', label: 'Last prediction' },
  },
  {
    key: 'lpg',
    label: 'LPG',
    status: 'Planned',
    description: 'No CO₂ calculation yet',
    badge: 'neutral',
    href: '/lpg',
    featured: false,
    icon: BatteryCharging,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50 border-orange-100',
  },
  {
    key: 'water',
    label: 'Water',
    status: 'Planned',
    description: 'No CO₂ calculation yet',
    badge: 'neutral',
    href: '/water',
    featured: false,
    icon: ChartBar,
    iconColor: 'text-sky-500',
    bgColor: 'bg-sky-50 border-sky-100',
  },
  {
    key: 'food',
    label: 'Food',
    status: 'Planned',
    description: 'No CO₂ calculation yet',
    badge: 'neutral',
    href: '/food',
    featured: false,
    icon: Gear,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50 border-rose-100',
  },
  {
    key: 'transport',
    label: 'Transport',
    status: 'Not Available',
    description: 'Insufficient travel data',
    badge: 'warning',
    href: '/transport',
    featured: false,
    icon: CaretRight,
    iconColor: 'text-slate-500',
    bgColor: 'bg-slate-50 border-slate-100',
  },
] as const;

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'New Forecast',
    description: 'Predict next month\'s electricity & CO₂',
    icon: ArrowUpRight,
    href: '/forecast',
    variant: 'primary',
  },
  {
    label: 'View Electricity',
    description: 'Historical data & emission factors',
    icon: Lightning,
    href: '/electricity',
    variant: 'secondary',
  },
  {
    label: 'Model Gear',
    description: 'Emission factor & model configuration',
    icon: Gear,
    href: '/settings',
    variant: 'secondary',
  },
];

function TrendIndicator({ value, label, positive }: { value: string; label: string; positive: boolean | null }) {
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
      {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      <span>{value}</span>
      <span className="text-brand-400">{label}</span>
    </div>
  );
}

function KPICard({ metric, index, reduce }: { metric: KPIMetric; index: number; reduce: boolean | null }) {
  const Icon = metric.icon;
  return (
    <StaggerItem
      customVariants={cardVariants}
      style={{ animationDelay: reduce ? undefined : `${index * 80}ms` }}
    >
      <ElevatedCard
        className="p-6 hover:shadow-elevated transition-shadow duration-300"
        elevated={false}
        interactive
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-xl ${metric.bgColor}`}>
                <Icon className={`w-5 h-5 ${metric.iconColor}`} />
              </div>
            </div>
            <p className="text-sm text-brand-500 font-medium tracking-wide uppercase">{metric.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-brand-950 tracking-tight">
                {metric.value}
                {metric.unit && <span className="text-lg font-normal text-brand-500 ml-1">{metric.unit}</span>}
              </p>
            </div>
            {metric.trend && (
              <TrendIndicator
                value={metric.trend.value}
                label={metric.trend.label}
                positive={metric.trend.positive}
              />
            )}
          </div>
        </div>
      </ElevatedCard>
    </StaggerItem>
  );
}

function DomainCard({ domain, index, reduce }: { domain: DomainCardItem; index: number; reduce: boolean | null }) {
  const Icon = domain.icon;
  return (
    <StaggerItem
      customVariants={cardVariants}
      style={{ animationDelay: reduce ? undefined : `${index * 60}ms` }}
    >
      <ElevatedCard
        className={`p-5 ${domain.featured ? 'hover:shadow-elevated' : 'hover:shadow-card-hover'} transition-all duration-300 group`}
        elevated={false}
        interactive
      >
        <a href={domain.href} className="block">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${domain.bgColor} group-hover:scale-105 transition-transform duration-300`}>
                <Icon className={`w-5 h-5 ${domain.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-brand-500 font-medium">{domain.label}</p>
                <p className="mt-0.5 text-lg font-semibold text-brand-950 tracking-tight">{domain.status}</p>
                <p className="mt-0.5 text-sm text-brand-500">{domain.description}</p>
              </div>
            </div>
            <Badge 
              variant={domain.badge} 
              size="sm" 
              className="flex-shrink-0 mt-1 group-hover:scale-105 transition-transform"
            >
              {domain.badge === 'success' ? 'Active' : domain.badge === 'warning' ? 'Unsupported' : 'Planned'}
            </Badge>
          </div>
        </a>
      </ElevatedCard>
    </StaggerItem>
  );
}

function QuickActionCard({ action, index, reduce }: { action: QuickAction; index: number; reduce: boolean | null }) {
  const Icon = action.icon;
  return (
    <StaggerItem
      customVariants={cardVariants}
      style={{ animationDelay: reduce ? undefined : `${index * 60}ms` }}
    >
      <a href={action.href} className="block">
        <ElevatedCard
          className="p-5 hover:shadow-elevated transition-all duration-300 group"
          elevated={false}
          interactive
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-brand-50 border border-brand-100 group-hover:bg-brand-100 transition-colors`}>
              <Icon className="w-5 h-5 text-brand-600 group-hover:text-brand-700 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-950 group-hover:text-brand-700 transition-colors">{action.label}</p>
              <p className="mt-0.5 text-sm text-brand-500">{action.description}</p>
            </div>
            <CaretRight className="w-5 h-5 text-brand-300 group-hover:text-brand-500 transition-colors group-hover:translate-x-1" />
          </div>
        </ElevatedCard>
      </a>
    </StaggerItem>
  );
}

export function Dashboard() {
  const reduce = useReducedMotion();
  const { lastResult } = useForecast();
  const [kpiData, setKpiData] = useState<KPIMetric[]>([
    {
      label: 'Last Forecast',
      value: '—',
      unit: 'kWh',
      icon: Lightning,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50 border-amber-100',
    },
    {
      label: 'CO₂ Estimate',
      value: '—',
      unit: 'kg',
      icon: ArrowUpRight,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Emission Factor',
      value: '0.675',
      unit: 'kg/kWh',
      trend: { value: 'Fixed', label: 'CEA v22.0', positive: true },
      icon: ChartBar,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-50 border-sky-100',
    },
  ]);

  useEffect(() => {
    if (lastResult) {
      setKpiData([
        {
          label: 'Last Forecast',
          value: lastResult.predicted_electricity_kwh.toFixed(1),
          unit: 'kWh',
          trend: { value: '—', label: 'Month forecast', positive: true },
          icon: Lightning,
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-50 border-amber-100',
        },
        {
          label: 'CO₂ Estimate',
          value: lastResult.predicted_co2_kg.toFixed(2),
          unit: 'kg',
          trend: { value: '—', label: 'From CEA factor', positive: true },
          icon: ArrowUpRight,
          iconColor: 'text-emerald-500',
          bgColor: 'bg-emerald-50 border-emerald-100',
        },
        {
          label: 'Emission Factor',
          value: lastResult.emission_factor_kg_co2_per_kwh.toFixed(3),
          unit: 'kg/kWh',
          trend: { value: 'Fixed', label: 'CEA v22.0', positive: true },
          icon: ChartBar,
          iconColor: 'text-sky-500',
          bgColor: 'bg-sky-50 border-sky-100',
        },
      ]);
    }
  }, [lastResult]);

  const featuredDomains = DOMAIN_CARDS.filter(d => d.featured);
  const plannedDomains = DOMAIN_CARDS.filter(d => !d.featured);

  return (
    <motion.div
      className="space-y-10 animate-fade-in"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Page Header */}
      <motion.header
        className="page-header"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="page-header-title">Dashboard</h1>
            <p className="page-header-subtitle mt-1">
              Monitor your household energy use, carbon impact, and forecasts.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="success" size="sm" className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Backend Connected
            </Badge>
          </div>
        </div>
      </motion.header>

      {/* KPI Metrics Row */}
      <StaggerContainer staggerDelay={0.08} delayChildren={0.15}>
        <section aria-labelledby="kpi-heading" className="space-y-4">
          <motion.h2
            id="kpi-heading"
            className="section-title"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Key Metrics
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpiData.map((metric, index) => (
              <KPICard key={metric.label} metric={metric} index={index} reduce={reduce} />
            ))}
          </div>
        </section>
      </StaggerContainer>

      {/* Quick Actions */}
      <StaggerContainer staggerDelay={0.06} delayChildren={0.2}>
        <section aria-labelledby="actions-heading" className="space-y-4">
          <motion.h2
            id="actions-heading"
            className="section-title"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Quick Actions
          </motion.h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map((action, index) => (
              <QuickActionCard key={action.label} action={action} index={index} reduce={reduce} />
            ))}
          </div>
        </section>
      </StaggerContainer>

      {/* Domain Overview */}
      <section aria-labelledby="domains-heading" className="space-y-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 id="domains-heading" className="section-title">Energy Domains</h2>
              <p className="text-sm text-brand-500 mt-1">
                Track status across all household energy categories.
              </p>
            </div>
          </div>

          {/* Featured Domains */}
          <motion.section
            aria-labelledby="featured-heading"
            className="space-y-4"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h3
              id="featured-heading"
              className="text-sm font-medium text-brand-600 uppercase tracking-wider"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Active & Live
            </motion.h3>
            <StaggerContainer staggerDelay={0.06} delayChildren={0.05}>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredDomains.map((domain, index) => (
                  <DomainCard key={domain.key} domain={domain} index={index} reduce={reduce} />
                ))}
              </div>
            </StaggerContainer>
          </motion.section>

          {/* Planned / Unsupported Domains */}
          <motion.section
            aria-labelledby="planned-heading"
            className="space-y-4"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h3
              id="planned-heading"
              className="text-sm font-medium text-brand-600 uppercase tracking-wider"
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Planned & Unsupported
            </motion.h3>
            <StaggerContainer staggerDelay={0.04} delayChildren={0.03}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {plannedDomains.map((domain, index) => (
                  <DomainCard key={domain.key} domain={domain} index={index} reduce={reduce} />
                ))}
              </div>
            </StaggerContainer>
          </motion.section>
        </motion.div>
      </section>

      {/* Latest Forecast Summary */}
      {lastResult && (
        <motion.section
          aria-labelledby="summary-heading"
          className="space-y-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            id="summary-heading"
            className="section-title"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Latest Forecast Summary
          </motion.h2>
          <ElevatedCard className="p-6 elevated">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl border border-brand-100">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-500 font-medium">Next Month Prediction</p>
                    <p className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">
                      {lastResult.predicted_electricity_kwh.toFixed(1)} kWh
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl border border-brand-100">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <Lightning className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-500 font-medium">CO₂ Emissions</p>
                    <p className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">
                      {lastResult.predicted_co2_kg.toFixed(2)} kg CO₂
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
                  <p className="text-xs font-medium text-brand-500 uppercase tracking-wider mb-3">Details</p>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-brand-500">Emission Factor</dt>
                      <dd className="text-brand-950 font-medium font-mono">{lastResult.emission_factor_kg_co2_per_kwh} kg CO₂/kWh</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-brand-500">Source</dt>
                      <dd className="text-brand-950 font-medium">{lastResult.factor_source}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-brand-500">Period</dt>
                      <dd className="text-brand-950 font-medium">{lastResult.reporting_period}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-brand-500">Model</dt>
                      <dd className="text-brand-950 font-medium">{lastResult.model_name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-brand-500">R² Score</dt>
                      <dd className="text-brand-950 font-medium font-mono">{lastResult.model_metrics.R2.toFixed(4)}</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => window.location.href = '/forecast'}>
                    View Forecast
                    <CaretRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => window.location.href = '/electricity'}>
                    Electricity Details
                    <CaretRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </ElevatedCard>
        </motion.section>
      )}

      {/* Empty State - No Forecast Yet */}
      {!lastResult && (
        <motion.section
          aria-labelledby="empty-heading"
          className="space-y-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            id="empty-heading"
            className="section-title"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Get Started
          </motion.h2>
          <ElevatedCard className="p-8 text-center elevated border-2 border-dashed border-brand-200">
            <div className="max-w-md mx-auto">
              <div className="mx-auto mb-4 p-4 rounded-2xl bg-brand-50 border border-brand-100 w-fit">
                <Lightning className="w-10 h-10 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-brand-950 mb-2">No Forecast Yet</h3>
              <p className="text-brand-500 mb-6">
                Create your first electricity forecast to see predictions and CO₂ estimates here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" onClick={() => window.location.href = '/forecast'}>
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Create Forecast
                </Button>
                <Button variant="secondary" size="lg" onClick={() => window.location.href = '/electricity'}>
                  <Lightning className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </ElevatedCard>
        </motion.section>
      )}
    </motion.div>
  );
}