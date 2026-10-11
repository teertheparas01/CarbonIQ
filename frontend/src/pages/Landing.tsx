import { motion, useReducedMotion } from "motion/react";
import { ElevatedCard, StaggerContainer, StaggerItem, cardVariants } from '../lib/animations';
import { Button, Badge } from '../components/ui';
import { Lightning, ArrowRight, Check, Shield, ChartBar, Cpu, ArrowUpRight } from '@phosphor-icons/react';

const FEATURES = [
  {
    icon: Lightning,
    title: 'Electricity Forecasting',
    description: 'Predict next-month consumption using Seasonal Gradient Boosting trained on 5,347 household samples.',
    metric: '32.12 kWh MAE',
  },
  {
    icon: ArrowUpRight,
    title: 'Deterministic CO₂',
    description: 'CO₂ calculated from predicted kWh using CEA v22.0 emission factor (0.675 kg CO₂/kWh).',
    metric: '0.675 kg CO₂/kWh',
  },
  {
    icon: Shield,
    title: 'Transparent Limitations',
    description: 'R² = 0.1689 documented. Model predicts electricity, not carbon. No fabricated emissions.',
    metric: 'Honest by design',
  },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Enter History', description: 'Input last two months of electricity consumption (t-2, t-1).' },
  { step: 2, title: 'Select Month', description: 'Choose the target month (1–12) for next-month prediction.' },
  { step: 3, title: 'Get Prediction', description: 'Receive kWh forecast + deterministic CO₂ with emission factor details.' },
];

const METRICS = [
  { label: 'Training Samples', value: '5,347', icon: Cpu },
  { label: 'Test MAE', value: '32.12 kWh', icon: ChartBar },
  { label: 'Emission Factor', value: '0.675', icon: Lightning },
  { label: 'CO₂ per Forecast', value: 'Deterministic', icon: ArrowUpRight },
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
      {/* Navigation placeholder */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center">
              <Lightning className="w-5 h-5 text-white" />
            </div>
            <span className="text-brand-950 font-semibold text-lg">CarbonIQ</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-brand-600">
            <a href="#features" className="hover:text-brand-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-900 transition-colors">How It Works</a>
            <a href="#metrics" className="hover:text-brand-900 transition-colors">Metrics</a>
            <a href="/forecast" className="px-4 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800 transition-colors">Try Forecast</a>
          </nav>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section id="hero" className="relative py-24 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                className="space-y-8"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700"
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live backend · Seasonal Gradient Boosting
                </motion.span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-brand-950 leading-[1.05]">
                  Household Energy &{' '}
                  <span className="text-brand-700">Carbon Intelligence</span>
                </h1>
                <p className="text-lg md:text-xl text-brand-500 max-w-2xl leading-relaxed">
                  Predict next-month electricity consumption and deterministic CO₂ emissions.
                  Powered by Seasonal Gradient Boosting trained on Pune household survey data (2018–2020).
                </p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Button size="lg" onClick={() => window.location.href = '/forecast'} className="group">
                    Start Forecast
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => window.location.href = '/electricity'}>
                    View Documentation
                  </Button>
                </motion.div>
                <motion.div
                  className="flex items-center gap-6 text-sm text-brand-400"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>No fabricated emissions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>CEA v22.0 factor</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>R² = 0.1689 documented</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div
                className="relative"
                initial={reduce ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative aspect-square max-w-md mx-auto lg:max-w-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-brand-50 to-brand-100 rounded-3xl blur-2xl opacity-50" />
                  <div className="relative bg-white rounded-3xl border border-brand-100/50 shadow-elevated p-8 md:p-12">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-brand-50 border border-brand-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-100">
                            <Lightning className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-brand-500">Last Forecast</p>
                            <p className="text-2xl font-semibold text-brand-950">117.1 kWh</p>
                          </div>
                        </div>
                        <Badge variant="success" size="sm">Live</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-brand-50 border border-brand-100">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-100">
                            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm text-brand-500">CO₂ Estimate</p>
                            <p className="text-2xl font-semibold text-brand-950">79.05 kg CO₂</p>
                          </div>
                        </div>
                        <span className="text-xs text-brand-400 font-mono">0.675 kg/kWh</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-center">
                          <p className="text-2xl font-semibold text-brand-950 font-mono">5,347</p>
                          <p className="text-xs text-brand-500">Train Samples</p>
                        </div>
                        <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-center">
                          <p className="text-2xl font-semibold text-brand-950 font-mono">1,434</p>
                          <p className="text-xs text-brand-500">Test Samples</p>
                        </div>
                        <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-center">
                          <p className="text-2xl font-semibold text-brand-950 font-mono">0.169</p>
                          <p className="text-xs text-brand-500">R² Score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-white border-y border-brand-100/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Core Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
                Built for Transparency
              </h2>
              <p className="text-lg text-brand-500 max-w-2xl mx-auto">
                Every prediction includes the emission factor, model metrics, and documented limitations.
                No hidden assumptions — just verifiable estimates.
              </p>
            </motion.div>

            <StaggerContainer staggerDelay={0.08} delayChildren={0.1}>
              <div className="grid gap-6 md:grid-cols-3">
                {FEATURES.map((feature, index) => (
                  <StaggerItem key={feature.title} customVariants={cardVariants} style={{ animationDelay: `${index * 80}ms` }}>
                    <ElevatedCard className="p-6 h-full hover:shadow-elevated transition-all duration-300">
                      <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 w-fit mb-4">
                        <feature.icon className="w-6 h-6 text-brand-700" />
                      </div>
                      <h3 className="text-lg font-semibold text-brand-950 mb-2">{feature.title}</h3>
                      <p className="text-brand-500 mb-4 leading-relaxed">{feature.description}</p>
                      <div className="pt-4 border-t border-brand-100/50">
                        <span className="text-sm font-medium text-brand-950 font-mono">{feature.metric}</span>
                      </div>
                    </ElevatedCard>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28 bg-brand-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-16"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-sm font-medium text-brand-700 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Three Steps
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
                From Data to Decision
              </h2>
            </motion.div>

            <StaggerContainer staggerDelay={0.1} delayChildren={0.1}>
              <div className="grid gap-8 md:grid-cols-3">
                {HOW_IT_WORKS.map((step, index) => (
                  <StaggerItem key={step.step} customVariants={cardVariants} style={{ animationDelay: `${index * 100}ms` }}>
                    <ElevatedCard className="p-8 relative hover:shadow-elevated transition-all duration-300">
                      <div className="absolute -top-3 left-8 w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="pt-6 text-center">
                        <h3 className="text-xl font-semibold text-brand-950 mb-3">{step.title}</h3>
                        <p className="text-brand-500 leading-relaxed">{step.description}</p>
                      </div>
                    </ElevatedCard>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Metrics Strip */}
        <section id="metrics" className="py-16 bg-brand-950">
          <div className="max-w-7xl mx-auto px-6">
            <StaggerContainer staggerDelay={0.06} delayChildren={0.1}>
              <div className="grid gap-8 md:grid-cols-4">
                {METRICS.map((metric, index) => (
                  <StaggerItem key={metric.label} customVariants={cardVariants} style={{ animationDelay: `${index * 60}ms` }}>
                    <div className="text-center">
                      <div className="mx-auto mb-4 p-3 rounded-xl bg-white/5 border border-white/10 w-fit">
                        <metric.icon className="w-7 h-7 text-brand-300" />
                      </div>
                      <motion.div
                        className="text-3xl md:text-4xl font-semibold text-white font-mono tracking-tight"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                      >
                        {metric.value}
                      </motion.div>
                      <p className="mt-2 text-sm text-brand-400 font-medium">{metric.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-white border-y border-brand-100/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-950 mb-4">
                Ready to Forecast?
              </h2>
              <p className="text-lg text-brand-500 mb-8 max-w-xl mx-auto">
                Enter your last two months of electricity consumption and get a next-month prediction
                with deterministic CO₂ emissions — all in seconds.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button size="lg" onClick={() => window.location.href = '/forecast'} className="group w-full sm:w-auto">
                  Create Your First Forecast
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="secondary" size="lg" onClick={() => window.location.href = '/electricity'}>
                  Read the Methodology
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-950 border-t border-brand-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="md:col-span-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center">
                  <Lightning className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">CarbonIQ</span>
              </div>
              <p className="text-brand-400 max-w-sm">
                Household energy and carbon monitoring, prediction, and reduction.
                College AIML project — built for transparency.
              </p>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h4 className="font-medium text-white mb-4">Product</h4>
              <nav className="space-y-2 text-sm text-brand-400">
                <a href="/forecast" className="hover:text-white transition-colors block">Forecast</a>
                <a href="/electricity" className="hover:text-white transition-colors block">Electricity</a>
                <a href="/settings" className="hover:text-white transition-colors block">Settings</a>
                <a href="/todo-not-todo" className="hover:text-white transition-colors block">To'Do & Not-To-Do</a>
              </nav>
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h4 className="font-medium text-white mb-4">Resources</h4>
              <nav className="space-y-2 text-sm text-brand-400">
                <a href="#" className="hover:text-white transition-colors block">Documentation</a>
                <a href="#" className="hover:text-white transition-colors block">API Reference</a>
                <a href="#" className="hover:text-white transition-colors block">Model Card</a>
                <a href="#" className="hover:text-white transition-colors block">Changelog</a>
              </nav>
            </motion.div>
          </div>
          <motion.div
            className="mt-12 pt-8 border-t border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="text-sm text-brand-500">College AIML project — not for commercial use.</p>
            <div className="flex items-center gap-4 text-sm text-brand-500">
              <span>Model: Seasonal Gradient Boosting</span>
              <span>Factor: CEA v22.0 (0.675 kg CO₂/kWh)</span>
              <span>R² = 0.1689</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
}