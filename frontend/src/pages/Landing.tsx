import { EarthAnimation } from '../components/EarthAnimation';
import { AnimatedGradientBackground } from '../components/AnimatedGradientBackground';
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
  { label: 'Validated Samples', value: '5,347' },
  { label: 'Test MAE', value: '32.12 kWh' },
  { label: 'Grid Emission Factor', value: '0.675' },
  { label: 'Emission Factor Source', value: 'CEA v22.0' },
];

export function Landing() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="min-h-screen bg-brand-50"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedGradientBackground />
      <EarthAnimation />

      <main className="relative bg-brand-50">
        <section id="features" className="py-20 md:py-28 bg-white border-y border-brand-100/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Platform Architecture
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
                  className="p-7 bg-white rounded-2xl border border-brand-200/70 shadow-xs hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div>
                    <div className="p-3 rounded-xl bg-brand-50 border border-brand-100/80 w-fit mb-5">
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

        <section id="how-it-works" className="py-20 md:py-28 bg-brand-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Prediction Pipeline
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
                From Raw Usage to Actionable Intelligence
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((step, index) => (
                <div
                  key={step.step}
                  className="p-8 relative hover:shadow-lg transition-all duration-300 bg-white rounded-2xl border border-brand-100/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="pt-6 text-center">
                    <h3 className="text-xl font-semibold text-brand-950 mb-3">{step.title}</h3>
                    <p className="text-brand-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="metrics" className="py-16 bg-brand-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid gap-8 md:grid-cols-4">
              {METRICS.map((metric, index) => (
                <div key={metric.label} className="text-center" style={{ animationDelay: `${index * 60}ms` }}>
                  <div className="mx-auto mb-4 p-3 rounded-xl bg-white/5 border border-white/10 w-fit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-brand-300">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <rect x="9" y="9" width="6" height="6" />
                    </svg>
                  </div>
                  <div className="text-3xl md:text-4xl font-semibold text-white font-mono tracking-tight">{metric.value}</div>
                  <p className="mt-2 text-sm text-brand-400 font-medium">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-white border-y border-brand-100/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
              Ready to Forecast Household Emissions?
            </h2>
            <p className="text-lg text-brand-500 mb-8 max-w-xl mx-auto">
              Enter your historical consumption metrics and generate an accurate next-month prediction calibrated with regional grid emission factors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/forecast"
                className="px-8 py-3 bg-brand-300 text-brand-950 font-semibold rounded-full hover:bg-brand-400 transition-colors inline-block"
              >
                Create Household Forecast
              </a>
              <a
                href="/electricity"
                className="px-8 py-3 bg-white/10 text-brand-950 font-semibold rounded-full backdrop-blur-sm border border-brand-200 hover:bg-brand-50 transition-colors inline-block"
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