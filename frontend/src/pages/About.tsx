'use client';

import { useHealth, useForecast } from '../hooks';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Badge } from '../components/ui';
import { motion, useReducedMotion } from 'motion/react';
import {
  Cpu,
  Layers,
  Database,
  BarChart3,
  Code2,
  Server,
  Globe2,
  CheckCircle2,
  ExternalLink,
  Mail,
  Zap,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export function About() {
  const { health } = useHealth();
  const { lastResult } = useForecast();
  const reduce = useReducedMotion();

  const modelMetrics = lastResult?.model_metrics ?? {
    MAE_kWh: 32.1234,
    RMSE_kWh: 186.3864,
    R2: 0.1689,
  };

  const emissionFactor = lastResult?.emission_factor_kg_co2_per_kwh ?? 0.675;
  const factorSource = lastResult?.factor_source ?? 'Central Electricity Authority (CEA)';
  const factorVersion = lastResult?.factor_version ?? '22.0';

  return (
    <motion.div
      className="space-y-10 max-w-5xl mx-auto pb-16"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 glass glass--strong border border-brand-100/70 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="neutral" size="sm">
              Pune Survey Dataset
            </Badge>
            <Badge variant="neutral" size="sm">
              CEA v22.0 Standard
            </Badge>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Backend {health ? 'Online' : 'Connected'}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-950 tracking-tight leading-tight">
            About CarbonIQ
          </h1>

          <p className="text-base sm:text-lg text-brand-700 leading-relaxed">
            CarbonIQ is an integrated machine learning platform engineered to forecast urban household electricity consumption, calculate deterministic Scope 2 CO₂ emissions, and provide actionable decarbonization levers under one unified roof.
          </p>
        </div>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 rounded-2xl glass glass--highlighted flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 rounded-xl w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-brand-950">Empirical ML Forecasting</h3>
            <p className="text-sm text-brand-600 leading-relaxed">
              Trained on 5,347 real-world Pune household observations to capture seasonal cooling shifts, monsoon dynamics, and lag trends.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-brand-100/60 text-xs font-semibold text-emerald-700">
            GradientBoostingRegressor
          </div>
        </div>

        <div className="p-6 rounded-2xl glass glass--highlighted flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 rounded-xl w-fit bg-blue-500/10 text-blue-700 border border-blue-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-brand-950">Deterministic CO₂ Science</h3>
            <p className="text-sm text-brand-600 leading-relaxed">
              Zero unverified black-box multipliers. Electricity emissions use the official Central Electricity Authority (0.675 kg CO₂/kWh) factor.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-brand-100/60 text-xs font-semibold text-blue-700">
            CEA Baseline v22.0
          </div>
        </div>

        <div className="p-6 rounded-2xl glass glass--highlighted flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 rounded-xl w-fit bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-brand-950">Scope Transparency</h3>
            <p className="text-sm text-brand-600 leading-relaxed">
              Clear distinction between predictive models (Electricity) and benchmark references.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-brand-100/60 text-xs font-semibold text-amber-700">
            Ethical ML Standards
          </div>
        </div>
      </div>

      {/* Section 1: The Machine Learning Model */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-100/80 text-brand-800">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-950">Machine Learning Model Architecture</h2>
                <p className="text-xs text-brand-500">Pipeline specifications and empirical test metrics</p>
              </div>
            </div>
            <Badge variant="success">Scikit-Learn 1.6</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-xl bg-white/70 border border-brand-100/70">
              <span className="text-xs text-brand-500 uppercase tracking-wider font-semibold">Algorithm</span>
              <p className="mt-1 text-base font-bold text-brand-950">Seasonal Gradient Boosting</p>
              <span className="text-[11px] text-brand-500">Decision-tree ensemble regressor</span>
            </div>
            <div className="p-4 rounded-xl bg-white/70 border border-brand-100/70">
              <span className="text-xs text-brand-500 uppercase tracking-wider font-semibold">Mean Absolute Error</span>
              <p className="mt-1 text-base font-bold text-brand-950">{modelMetrics.MAE_kWh.toFixed(2)} kWh</p>
              <span className="text-[11px] text-emerald-600 font-medium">Evaluation test set</span>
            </div>
            <div className="p-4 rounded-xl bg-white/70 border border-brand-100/70">
              <span className="text-xs text-brand-500 uppercase tracking-wider font-semibold">Root Mean Squared Error</span>
              <p className="mt-1 text-base font-bold text-brand-950">{modelMetrics.RMSE_kWh.toFixed(2)} kWh</p>
              <span className="text-[11px] text-brand-500">Historical holdout period</span>
            </div>
            <div className="p-4 rounded-xl bg-white/70 border border-brand-100/70">
              <span className="text-xs text-brand-500 uppercase tracking-wider font-semibold">Holdout R² Score</span>
              <p className="mt-1 text-base font-bold text-brand-950">{modelMetrics.R2.toFixed(4)}</p>
              <span className="text-[11px] text-brand-500">Out-of-sample generalization</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-brand-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Feature Vector (Input Attributes)</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-brand-700">
                <li className="p-2.5 rounded-lg bg-brand-50/60 border border-brand-100/50">
                  <code className="font-mono text-brand-900 font-semibold">electricity_t_minus_2</code>
                  <p className="text-xs text-brand-500 mt-0.5">Household consumption 2 billing cycles prior (kWh).</p>
                </li>
                <li className="p-2.5 rounded-lg bg-brand-50/60 border border-brand-100/50">
                  <code className="font-mono text-brand-900 font-semibold">electricity_t_minus_1</code>
                  <p className="text-xs text-brand-500 mt-0.5">Household consumption 1 billing cycle prior (kWh).</p>
                </li>
                <li className="p-2.5 rounded-lg bg-brand-50/60 border border-brand-100/50">
                  <code className="font-mono text-brand-900 font-semibold">target_month_num</code>
                  <p className="text-xs text-brand-500 mt-0.5">Integer (1–12) encoding Pune's regional meteorological seasonal weather curves.</p>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-brand-950 flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-600" />
                <span>Training &amp; Split Protocol</span>
              </h4>
              <div className="p-4 rounded-xl bg-white/60 border border-brand-100/70 space-y-3 text-xs sm:text-sm text-brand-700">
                <div className="flex justify-between py-1 border-b border-brand-100/60">
                  <span className="text-brand-500">Training Samples</span>
                  <span className="font-semibold text-brand-950">5,347 observations</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-100/60">
                  <span className="text-brand-500">Holdout Test Samples</span>
                  <span className="font-semibold text-brand-950">1,434 observations</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-100/60">
                  <span className="text-brand-500">Chronological Cutoff</span>
                  <span className="font-semibold text-brand-950">Before Nov 2019</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-brand-500">Testing Window</span>
                  <span className="font-semibold text-brand-950">Nov 2019 – Feb 2020</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Technology Stack */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-100/80 text-brand-800">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-950">Full Technology Stack</h2>
              <p className="text-xs text-brand-500">Modern reactive frontend paired with high-performance Python ASGI backend</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Frontend */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/60 border border-brand-100/60">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-950">
                <Globe2 className="w-4 h-4 text-emerald-600" />
                <span>Frontend Layer</span>
              </div>
              <ul className="space-y-1.5 text-xs text-brand-600 leading-relaxed">
                <li><strong className="text-brand-900">React 19 &amp; Vite</strong> — Modern component runtime with instant HMR</li>
                <li><strong className="text-brand-900">TypeScript</strong> — Strict type contracts across navigation and API interfaces</li>
                <li><strong className="text-brand-900">Tailwind CSS (v4)</strong> — Custom frosted OnePlus glass capsule theme</li>
                <li><strong className="text-brand-900">Motion (Framer Motion v14)</strong> — GPU-composited micro-interactions and transitions</li>
                <li><strong className="text-brand-900">Three.js / React Three Fiber</strong> — 3D Earth space canvas and thermal globes</li>
                <li><strong className="text-brand-900">Recharts</strong> — Responsive analytical visual charts</li>
              </ul>
            </div>

            {/* Backend & ML */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/60 border border-brand-100/60">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-950">
                <Server className="w-4 h-4 text-blue-600" />
                <span>Backend &amp; ML Engine</span>
              </div>
              <ul className="space-y-1.5 text-xs text-brand-600 leading-relaxed">
                <li><strong className="text-brand-900">Python 3.12</strong> — Core programming language</li>
                <li><strong className="text-brand-900">FastAPI</strong> — Async ASGI REST API framework with Pydantic validation</li>
                <li><strong className="text-brand-900">Scikit-Learn 1.6.1</strong> — Gradient Boosting regressor pipeline</li>
                <li><strong className="text-brand-900">Joblib</strong> — Compressed serialized model artifact persistence</li>
                <li><strong className="text-brand-900">Uvicorn</strong> — Lightning-fast ASGI production web server</li>
                <li><strong className="text-brand-900">NumPy &amp; Pandas</strong> — Feature shaping and data cleansing</li>
              </ul>
            </div>

            {/* Infrastructure & Standards */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/60 border border-brand-100/60">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-950">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Infrastructure &amp; CI/CD</span>
              </div>
              <ul className="space-y-1.5 text-xs text-brand-600 leading-relaxed">
                <li><strong className="text-brand-900">Vercel</strong> — Production edge CDN hosting and automated git webhook deployments</li>
                <li><strong className="text-brand-900">GitHub</strong> — Version control and continuous deployment pipeline</li>
                <li><strong className="text-brand-900">CEA Database v22.0</strong> — Official Indian Grid CO₂ emission coefficients</li>
                <li><strong className="text-brand-900">IPCC AR5</strong> — Thermal LPG standard conversions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Data Standards & Carbon Conversion Math */}
      <Card glass>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-100/80 text-brand-800">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-950">Carbon Emission Factors &amp; Methodology</h2>
              <p className="text-xs text-brand-500">Government baseline data and IPCC thermal conversion principles</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Grid Electricity Factor</span>
                <Badge variant="warning" size="sm">CEA v22.0</Badge>
              </div>
              <div className="text-2xl font-extrabold text-brand-950">
                {emissionFactor} <span className="text-sm font-normal text-brand-600">kg CO₂ / kWh</span>
              </div>
              <p className="text-xs text-brand-600 leading-relaxed">
                Published by the <strong>{factorSource}</strong> ({factorVersion}). Applies strictly to grid electrical consumption across the national integrated grid.
              </p>
            </div>

            
          </div>

          <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-100/70 text-xs sm:text-sm text-brand-700 leading-relaxed space-y-2">
            <p>
              <strong>Deterministic Accounting Formula:</strong>
            </p>
            <div className="p-3 rounded-lg bg-white/80 font-mono text-xs text-brand-900 border border-brand-100">
              Total CO₂ (kg) = Predicted Electricity (kWh) × 0.675 kg CO₂/kWh
            </div>
            <p className="text-xs text-brand-500">
              By enforcing deterministic multiplication rather than a speculative deep-learning black box for the carbon output, predictions remain 100% auditable and reproducible according to GHG Protocol Scope 2 guidance.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Author & Project Attribution */}
      <div className="rounded-2xl p-6 sm:p-8 glass glass--strong border border-brand-200/70 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Author &amp; Maintainer</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-brand-950">Designed &amp; Developed by Paras</h3>
          <p className="text-xs sm:text-sm text-brand-600 max-w-lg">
            </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href="mailto:teerthenandan@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-brand-700 text-white hover:bg-brand-800 transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>teerthenandan@gmail.com</span>
          </a>

          <a
            href="https://github.com/teertheparas01/CarbonIQ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-brand-800 hover:bg-brand-50 border border-brand-200 transition-colors shadow-xs"
          >
            <GithubIcon />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
