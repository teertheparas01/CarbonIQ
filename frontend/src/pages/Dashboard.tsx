import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from "motion/react";
import { useForecast } from '../hooks';
import { GlassCard, GlassButton, StaggerContainer, StaggerItem, cardVariants, GlassStat } from '../lib/animations';
import { Badge } from '../components/ui';
import { 
  Lightning, ArrowUpRight, Gear, CaretRight
} from '@phosphor-icons/react';

interface KPIMetric {
  label: string;
  value: string;
  unit?: string;
  trend?: { value: string; label: string; positive: boolean };
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
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
    stat: { value: '—', unit: 'kg CO₂', label: 'Last prediction' },
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
    href: '/about',
    variant: 'secondary',
  },
];

function KPICard({ metric, index, reduce }: { metric: KPIMetric; index: number; reduce: boolean | null }) {
  const Icon = metric.icon;
  return (
    <StaggerItem
      customVariants={cardVariants}
      style={{ animationDelay: reduce ? undefined : `${index * 80}ms` }}
    >
      <GlassStat
        value={metric.value}
        label={metric.label}
        unit={metric.unit}
        trend={metric.trend}
        icon={<Icon className={`w-5 h-5 ${metric.iconColor}`} />}
        iconColor={metric.iconColor}
      />
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
      <GlassCard className="p-5 group" interactive>
        <a href={domain.href} className="block">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-3 rounded-xl glass glass--highlighted"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 + index * 0.03, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              >
                <Icon className={`w-5 h-5 ${domain.iconColor}`} />
              </motion.div>
              <div className="min-w-0">
                <p className="text-sm text-brand-500 font-medium">{domain.label}</p>
                <p className="mt-0.5 text-lg font-semibold text-brand-950 tracking-tight">{domain.status}</p>
                <p className="mt-0.5 text-sm text-brand-500">{domain.description}</p>
              </div>
            </div>
            <Badge 
              variant={domain.badge} 
              size="sm" 
              glass
              className="flex-shrink-0 mt-1 group-hover:scale-105 transition-transform"
            >
              {domain.badge === 'success' ? 'Active' : domain.badge === 'warning' ? 'Unsupported' : 'Planned'}
            </Badge>
          </div>
        </a>
      </GlassCard>
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
        <GlassCard className="p-5 group" interactive>
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 rounded-xl glass glass--highlighted"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 + index * 0.03, type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.08, transition: { type: "spring", stiffness: 300, damping: 15 } }}
            >
              <Icon className="w-5 h-5 text-brand-600 group-hover:text-brand-700 transition-colors" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-950 group-hover:text-brand-700 transition-colors">{action.label}</p>
              <p className="mt-0.5 text-sm text-brand-500">{action.description}</p>
            </div>
            <CaretRight className="w-5 h-5 text-brand-300 group-hover:text-brand-500 transition-colors group-hover:translate-x-1" />
          </div>
        </GlassCard>
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
    },
    {
      label: 'CO₂ Estimate',
      value: '—',
      unit: 'kg',
      icon: ArrowUpRight,
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Emission Factor',
      value: '0.675',
      unit: 'kg/kWh',
      trend: { value: 'Fixed', label: 'CEA v22.0', positive: true },
      icon: Gear,
      iconColor: 'text-sky-500',
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
        },
        {
          label: 'CO₂ Estimate',
          value: lastResult.predicted_co2_kg.toFixed(2),
          unit: 'kg',
          trend: { value: '—', label: 'From CEA factor', positive: true },
          icon: ArrowUpRight,
          iconColor: 'text-emerald-500',
        },
        {
          label: 'Emission Factor',
          value: lastResult.emission_factor_kg_co2_per_kwh.toFixed(3),
          unit: 'kg/kWh',
          trend: { value: 'Fixed', label: 'CEA v22.0', positive: true },
          icon: Gear,
          iconColor: 'text-sky-500',
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
            <Badge variant="success" size="sm" glass className="flex items-center gap-1">
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <GlassCard className="p-6" elevated>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3 p-4 glass glass--highlighted">
                  <div className="p-3 rounded-xl glass glass--strong">
                    <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-500 font-medium">Next Month Prediction</p>
                    <p className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">
                      {lastResult.predicted_electricity_kwh.toFixed(1)} kWh
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 glass glass--highlighted">
                  <div className="p-3 rounded-xl glass glass--strong">
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
                <div className="p-4 glass glass--highlighted">
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
                  <GlassButton variant="secondary" className="flex-1" onClick={() => window.location.href = '/forecast'}>
                    View Forecast
                    <CaretRight className="w-4 h-4 ml-1" />
                  </GlassButton>
                  <GlassButton variant="secondary" className="flex-1" onClick={() => window.location.href = '/electricity'}>
                    Electricity Details
                    <CaretRight className="w-4 h-4 ml-1" />
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>
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
          <GlassCard className="p-8 text-center glass--strong border-2 border-dashed border-brand-200">
            <div className="max-w-md mx-auto">
              <div className="mx-auto mb-4 p-4 rounded-2xl glass glass--highlighted w-fit">
                <Lightning className="w-10 h-10 text-brand-500" />
              </div>
              <h3 className="text-lg font-semibold text-brand-950 mb-2">No Forecast Yet</h3>
              <p className="text-brand-500 mb-6">
                Create your first electricity forecast to see predictions and CO₂ estimates here.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <GlassButton size="lg" onClick={() => window.location.href = '/forecast'}>
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Create Forecast
                </GlassButton>
                <GlassButton variant="secondary" size="lg" onClick={() => window.location.href = '/electricity'}>
                  <Lightning className="w-4 h-4 mr-2" />
                  Learn More
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      )}
    </motion.div>
  );
}