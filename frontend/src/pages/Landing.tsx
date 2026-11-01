import { EarthAnimation } from '../components/EarthAnimation';
import { motion, useReducedMotion } from 'motion/react';

const FEATURES = [
  {
    title: 'Electricity Demand Forecasting',
    description: 'Predict next-month household consumption using Seasonal Gradient Boosting trained on 5,347 residential billing cycles.',
    metric: '32.12 kWh MAE',
  },
  {
    title: 'Deterministic Carbon Accounting',
    description: 'CO₂ quantified strictly from predicted kWh using Central Electricity Authority (CEA v22.0) baseline grid emission factor.',
    metric: '0.675 kg CO₂/kWh',
  },
  {
    title: 'Transparent Model Validation',
    description: 'Empirical cross-validation across climatic zones with verifiable feature attribution and full methodology transparency.',
    metric: 'Standardized CEA v22.0',
  },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Enter Billing History', description: 'Input electricity consumption from the previous two months (t-2, t-1).' },
  { step: 2, title: 'Select Target Period', description: 'Choose the upcoming calendar month for seasonal weather adjustments.' },
  { step: 3, title: 'Receive Actionable Forecast', description: 'Review predicted kWh demand, deterministic CO₂ footprint, and reduction levers.' },
];

const METRICS = [
  {
    label: 'Validated Samples',
    value: '5,347',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-600">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    label: 'Test MAE',
    value: '32.12 kWh',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-amber-600">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    label: 'Grid Emission Factor',
    value: '0.675',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-sky-600">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: 'Emission Factor Source',
    value: 'CEA v22.0',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-600">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

export function Landing() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="min-h-screen relative"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <EarthAnimation />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-20">
        <section id="features" className="glass-card p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass glass--highlighted text-sm font-medium text-brand-700 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Platform Architecture
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
                Engineered for Measurement Precision
              </h2>
              <p className="text-lg text-brand-500 max-w-2xl mx-auto">
                Every calculation references official government emission standards and verified machine learning pipelines without synthetic assumptions.
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-7 glass glass--highlighted glass-card--interactive rounded-2xl flex flex-col justify-between"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div>
                    <div className="p-3 rounded-xl glass glass--highlighted w-fit mb-5">
                      {index === 0 ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-amber-600">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      ) : index === 1 ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-emerald-600">
                          <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-sky-600">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-brand-950 mb-2.5">{feature.title}</h3>
                    <p className="text-sm text-brand-600 mb-6 leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="pt-4 border-t border-brand-100/70 flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-brand-400">Benchmark</span>
                    <span className="text-sm font-semibold text-brand-950 font-mono">{feature.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="glass-card p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass glass--highlighted text-sm font-medium text-brand-700 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Prediction Pipeline
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
                From Raw Usage to Actionable Intelligence
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((step, index) => (
                <div
                  key={step.step}
                  className="p-8 glass glass--highlighted glass-card--interactive rounded-2xl transition-all duration-300 text-center"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-700/10 text-brand-700 mb-4 border border-brand-200/50">
                    Step {step.step}
                  </span>
                  <h3 className="text-xl font-semibold text-brand-950 mb-3">{step.title}</h3>
                  <p className="text-brand-600 leading-relaxed text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="metrics" className="space-y-6">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass glass--highlighted text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Standards
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-950">
              Empirical Benchmarks &amp; Grid Accuracy
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric, index) => (
              <div
                key={metric.label}
                className="glass-card glass-card--interactive glass--highlighted p-7 rounded-2xl flex flex-col items-center justify-between text-center group"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="mx-auto mb-4 p-3.5 rounded-xl glass glass--highlighted w-fit group-hover:scale-110 transition-transform">
                  {metric.icon}
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-brand-950 font-mono tracking-tight my-2">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-brand-600 font-medium">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-8 md:p-14 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
              Ready to Forecast Household Emissions?
            </h2>
            <p className="text-lg text-brand-600 mb-8 max-w-xl mx-auto">
              Enter your historical consumption metrics and generate an accurate next-month prediction calibrated with regional grid emission factors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/forecast"
                className="glass-btn glass-btn--primary glass-btn--lg px-8 py-3 font-semibold rounded-full inline-flex items-center justify-center shadow-lg"
              >
                Create Household Forecast
              </a>
              <a
                href="/electricity"
                className="glass-btn glass-btn--secondary glass-btn--lg px-8 py-3 font-semibold rounded-full inline-flex items-center justify-center shadow-sm"
              >
                Explore Electrical Grid
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-950 border-t border-brand-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-white">
                    <path d="M12 2v20M12 2a10 10 0 0 1 0 20" />
                    <path d="M2 12h20M2 12a10 10 0 0 1 20 0" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-lg">CarbonIQ</span>
              </div>
              <p className="text-brand-400 max-w-sm">
                Advanced household energy and carbon intelligence platform delivering empirical forecasting and localized decarbonization analytics.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Intelligence Modules</h4>
              <nav className="space-y-2 text-sm text-brand-400">
                <a href="/forecast" className="hover:text-white transition-colors block">Energy Forecasting</a>
                <a href="/electricity" className="hover:text-white transition-colors block">Electrical Distribution</a>
                <a href="/lpg" className="hover:text-white transition-colors block">Thermal Energy</a>
                <a href="/todo-not-todo" className="hover:text-white transition-colors block">Mitigation Levers</a>
              </nav>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4">Standards &amp; Citations</h4>
              <nav className="space-y-2 text-sm text-brand-400">
                <a href="#" className="hover:text-white transition-colors block">CEA Baseline Database v22.0</a>
                <a href="#" className="hover:text-white transition-colors block">Model Architecture Card</a>
                <a href="#" className="hover:text-white transition-colors block">GHG Protocol Scope 2</a>
              </nav>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-brand-500">CarbonIQ • Urban Energy &amp; Decarbonization Intelligence Platform</p>
            <div className="flex items-center gap-4 text-sm text-brand-500">
              <span>Model: Seasonal Gradient Boosting</span>
              <span>Factor: CEA v22.0 (0.675 kg CO₂/kWh)</span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}