import { Badge } from '../components/ui';
import { motion, useReducedMotion } from "motion/react";
import { ElevatedCard } from '../lib/animations';

const DOMAIN_CARDS = [
  {
    key: 'electricity',
    label: 'Electricity',
    status: 'Live',
    description: 'Forecasting & CO₂ available',
    badge: 'success' as const,
    href: '/electricity',
    featured: true,
  },
  {
    key: 'forecast',
    label: 'Forecast',
    status: 'Live',
    description: 'Next-month prediction',
    badge: 'success' as const,
    href: '/forecast',
    featured: true,
  },
  {
    key: 'lpg',
    label: 'LPG',
    status: 'Planned',
    description: 'No CO₂ calculation yet',
    badge: 'neutral' as const,
    href: '/lpg',
    featured: false,
  },
  {
    key: 'water',
    label: 'Water',
    status: 'Planned',
    description: 'No CO₂ calculation yet',
    badge: 'neutral' as const,
    href: '/water',
    featured: false,
  },
  {
    key: 'food',
    label: 'Food',
    status: 'Planned',
    description: 'No CO₂ calculation yet',
    badge: 'neutral' as const,
    href: '/food',
    featured: false,
  },
  {
    key: 'transport',
    label: 'Transport',
    status: 'Not Available',
    description: 'Insufficient travel data',
    badge: 'warning' as const,
    href: '/transport',
    featured: false,
  },
] as const;

export function Dashboard() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduce ? 0 : 0.06,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 30,
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 30,
        duration: 0.5,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 30 },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      initial={reduce ? false : "hidden"}
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.header
        className="page-header"
        initial={reduce ? false : "hidden"}
        animate="visible"
        variants={sectionVariants}
      >
        <h1 className="page-header-title">CarbonIQ Dashboard</h1>
        <p className="page-header-subtitle">
          Monitor your household energy use, carbon impact, and forecasts.
        </p>
      </motion.header>

      {/* Featured Row: Electricity + Forecast */}
      <motion.section
        aria-labelledby="featured-heading"
        className="space-y-3"
        initial={reduce ? false : "hidden"}
        animate="visible"
        variants={sectionVariants}
      >
        <motion.h2
          id="featured-heading"
          className="section-title"
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={sectionVariants}
        >
          Active Domains
        </motion.h2>
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: reduce ? 0 : 0.06,
                delayChildren: reduce ? 0 : 0.1,
              },
            },
          }}
        >
          {DOMAIN_CARDS.filter(d => d.featured).map((domain) => (
            <motion.div
              key={domain.key}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring" as const, stiffness: 100, damping: 30 },
                },
              }}
            >
              <ElevatedCard
                className="p-5"
                interactive
                elevated={false}
                onClick={() => {}}
              >
                <a href={domain.href} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-brand-500 font-medium">{domain.label}</p>
                      <p className="mt-1 text-xl font-semibold text-brand-950 tracking-tight">{domain.status}</p>
                      <p className="mt-1 text-sm text-brand-500">{domain.description}</p>
                    </div>
                    <Badge variant={domain.badge} size="sm" className="flex-shrink-0 mt-1">
                      {domain.badge === 'success' ? 'Active' : domain.badge === 'warning' ? 'Unsupported' : 'Planned'}
                    </Badge>
                  </div>
                </a>
              </ElevatedCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Secondary Row: LPG, Water, Food, Transport */}
      <motion.section
        aria-labelledby="planned-heading"
        className="space-y-3"
        initial={reduce ? false : "hidden"}
        animate="visible"
        variants={sectionVariants}
      >
        <motion.h2
          id="planned-heading"
          className="section-title"
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={sectionVariants}
        >
          Planned & Unsupported
        </motion.h2>
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: reduce ? 0 : 0.04,
                delayChildren: reduce ? 0 : 0.05,
              },
            },
          }}
        >
          {DOMAIN_CARDS.filter(d => !d.featured).map((domain) => (
            <motion.div
              key={domain.key}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring" as const, stiffness: 100, damping: 30 },
                },
              }}
            >
              <ElevatedCard
                className="p-4"
                interactive
                elevated={false}
                onClick={() => {}}
              >
                <a href={domain.href} className="block">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-brand-500 font-medium">{domain.label}</p>
                      <p className="mt-0.5 text-lg font-semibold text-brand-950 tracking-tight">{domain.status}</p>
                      <p className="mt-0.5 text-sm text-brand-500">{domain.description}</p>
                    </div>
                    <Badge variant={domain.badge} size="sm" className="flex-shrink-0 mt-1">
                      {domain.badge === 'warning' ? 'Unsupported' : 'Planned'}
                    </Badge>
                  </div>
                </a>
              </ElevatedCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}