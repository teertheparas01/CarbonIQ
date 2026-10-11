import { EarthAnimation } from '../components/EarthAnimation';
import { ElevatedCard, StaggerContainer, StaggerItem, cardVariants } from '../lib/animations';
import { Button, Badge } from '../components/ui';
import { motion, useReducedMotion } from 'motion/react';

const FEATURES = [
  { title: 'Electricity Forecasting', description: 'Predict next-month consumption using Seasonal Gradient Boosting trained on 5,347 household samples.', metric: '32.12 kWh MAE' },
  { title: 'Deterministic CO₂', description: 'CO₂ calculated from predicted kWh using CEA v22.0 emission factor (0.675 kg CO₂/kWh).', metric: '0.675 kg CO₂/kWh' },
  { title: 'Transparent Limitations', description: 'R² = 0.1689 documented. Model predicts electricity, not carbon. No fabricated emissions.', metric: 'Honest by design' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Enter History', description: 'Input last two months of electricity consumption (t-2, t-1).' },
  { step: 2, title: 'Select Month', description: 'Choose the target month (1–12) for next-month prediction.' },
  { step: 3, title: 'Get Prediction', description: 'Receive kWh forecast + deterministic CO₂ with emission factor details.' },
];

const METRICS = [
  { label: 'Training Samples', value: '5,347' },
  { label: 'Test MAE', value: '32.12 kWh' },
  { label: 'Emission Factor', value: '0.675' },
  { label: 'CO₂ per Forecast', value: 'Deterministic' },
];

export function Landing() {
  const reduce = useReducedMotion();

  return (
    <motion.div className="min-h-screen bg-brand-50" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <EarthAnimation />

      <main className="relative bg-brand-50">
        <section id="features" className="py-20 md:py-28 bg-white border-y border-brand-100/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700 mb-4"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Core Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">Built for Transparency</h2>
              <p className="text-lg text-brand-500 max-w-2xl mx-auto">Every prediction includes the emission factor, model metrics, and documented limitations. No hidden assumptions — just verifiable estimates.</p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature, index) => (
                <div key={feature.title} className="p-6 bg-white rounded-2xl border border-brand-100/50 shadow-sm hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 w-fit mb-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-brand-700"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></div>
                  <h3 className="text-lg font-semibold text-brand-950 mb-2">{feature.title}</h3>
                  <p className="text-brand-500 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="pt-4 border-t border-brand-100/50"><span className="text-sm font-medium text-brand-950 font-mono">{feature.metric}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 md:py-28 bg-brand-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700 mb-4"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Three Steps</span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">From Data to Decision</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((step, index) => (
                <div key={step.step} className="p-8 relative hover:shadow-lg transition-all duration-300 bg-white rounded-2xl border border-brand-100/50" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold text-lg">{step.step}</div>
                  <div className="pt-6 text-center"><h3 className="text-xl font-semibold text-brand-950 mb-3">{step.title}</h3><p className="text-brand-500 leading-relaxed">{step.description}</p></div>
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
                  <div className="mx-auto mb-4 p-3 rounded-xl bg-white/5 border border-white/10 w-fit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-brand-300"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></svg></div>
                  <div className="text-3xl md:text-4xl font-semibold text-white font-mono tracking-tight">{metric.value}</div>
                  <p className="mt-2 text-sm text-brand-400 font-medium">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-white border-y border-brand-100/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">Ready to Forecast?</h2>
            <p className="text-lg text-brand-500 mb-8 max-w-xl mx-auto">Enter your last two months of electricity consumption and get a next-month prediction with deterministic CO₂ emissions — all in seconds.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/forecast" className="px-8 py-3 bg-brand-300 text-brand-950 font-semibold rounded-full hover:bg-brand-400 transition-colors inline-block">Create Your First Forecast</a>
              <a href="/electricity" className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors inline-block">Learn More</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-brand-950 border-t border-brand-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2"><div className="flex items-center gap-2 mb-4"><div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-white"><path d="M12 2v20M12 2a10 10 0 0 1 0 20" /><path d="M2 12h20M2 12a10 10 0 0 1 20 0" /></svg></div><span className="text-white font-semibold text-lg">CarbonIQ</span></div><p className="text-brand-400 max-w-sm">Household energy and carbon monitoring, prediction, and reduction. College AIML project — built for transparency.</p></div>
            <div><h4 className="font-medium text-white mb-4">Product</h4><nav className="space-y-2 text-sm text-brand-400"><a href="/forecast" className="hover:text-white transition-colors block">Forecast</a><a href="/electricity" className="hover:text-white transition-colors block">Electricity</a><a href="/settings" className="hover:text-white transition-colors block">Settings</a><a href="/todo-not-todo" className="hover:text-white transition-colors block">To'Do & Not-To-Do</a></nav></div>
            <div><h4 className="font-medium text-white mb-4">Resources</h4><nav className="space-y-2 text-sm text-brand-400"><a href="#" className="hover:text-white transition-colors block">Documentation</a><a href="#" className="hover:text-white transition-colors block">API Reference</a><a href="#" className="hover:text-white transition-colors block">Model Card</a><a href="#" className="hover:text-white transition-colors block">Changelog</a></nav></div>
          </div>
          <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-sm text-brand-500">College AIML project — not for commercial use.</p><div className="flex items-center gap-4 text-sm text-brand-500"><span>Model: Seasonal Gradient Boosting</span><span>Factor: CEA v22.0 (0.675 kg CO₂/kWh)</span><span>R² = 0.1689</span></div></div>
        </div>
      </footer>
    </motion.div>
  );
}