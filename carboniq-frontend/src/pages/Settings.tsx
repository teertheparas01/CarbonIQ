import { useHealth } from '../hooks';
import { useForecast } from '../hooks';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Badge, Button } from '../components/ui';

export function Settings() {
  const { health, checkHealth } = useHealth();
  const { lastResult } = useForecast();

  const modelMetrics = lastResult?.model_metrics ?? {
    MAE_kWh: 32.1234,
    RMSE_kWh: 186.3864,
    R2: 0.1689,
  };

  const emissionFactor = lastResult?.emission_factor_kg_co2_per_kwh ?? 0.675;
  const factorSource = lastResult?.factor_source ?? 'Central Electricity Authority (CEA)';
  const factorVersion = lastResult?.factor_version ?? '22.0';
  const reportingPeriod = lastResult?.reporting_period ?? 'FY 2025-26';
  const gas = lastResult?.gas ?? 'CO2';

  return (
    <div className="animate-fade-in space-y-8 max-w-3xl">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-header-title">Settings</h1>
        <p className="page-header-subtitle">
          View model configuration, emission factor, and system information.
        </p>
      </header>

      {/* Backend Connection */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium text-brand-950">Backend Connection</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-brand-100/30 border border-brand-200/50">
            <div>
              <p className="text-sm text-brand-500">Status</p>
              <p className="mt-0.5 font-medium text-brand-950 capitalize">{health ? 'connected' : 'unavailable'}</p>
            </div>
            <Badge variant={health ? 'success' : 'warning'} size="sm">
              {health ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-brand-100/30 border border-brand-200/50">
            <div>
              <p className="text-sm text-brand-500">Model</p>
              <p className="mt-0.5 font-medium text-brand-950">{health?.model_name || '—'}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={checkHealth}>
              Refresh
            </Button>
          </div>
          {health && (
            <div className="p-4 rounded-lg bg-brand-100/30 border border-brand-200/50">
              <p className="text-sm text-brand-500">API Base URL</p>
              <p className="mt-0.5 font-mono text-sm text-brand-950">{import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000 (default)'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* A. Model */}
      <section aria-labelledby="model-heading" className="space-y-6">
        <h2 id="model-heading" className="section-title">Model</h2>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-brand-950">Configuration</h3>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-brand-500">Algorithm</dt>
                <dd className="text-brand-950 font-medium">Seasonal Gradient Boosting</dd>
              </div>
              <div>
                <dt className="text-brand-500">Features</dt>
                <dd className="text-brand-950 font-medium font-mono text-xs">electricity_t_minus_2, electricity_t_minus_1, target_month_num</dd>
              </div>
              <div>
                <dt className="text-brand-500">Target</dt>
                <dd className="text-brand-950 font-medium">electricity_target (kWh/month)</dd>
              </div>
              <div>
                <dt className="text-brand-500">Training Samples</dt>
                <dd className="text-brand-950 font-medium">5,347</dd>
              </div>
              <div>
                <dt className="text-brand-500">Testing Samples</dt>
                <dd className="text-brand-950 font-medium">1,434</dd>
              </div>
              <div>
                <dt className="text-brand-500">Training Cutoff</dt>
                <dd className="text-brand-950 font-medium">Before November 2019</dd>
              </div>
              <div>
                <dt className="text-brand-500">Testing Period</dt>
                <dd className="text-brand-950 font-medium">November 2019 – February 2020</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-brand-950">Metrics (Test Period: Nov 2019 – Feb 2020)</h3>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="grid gap-3 sm:grid-cols-3 text-sm">
              <div className="p-3 rounded-lg bg-brand-100/50 border border-brand-200/50">
                <dt className="text-brand-500 text-xs uppercase tracking-wide">MAE</dt>
                <dd className="mt-1 text-lg font-semibold text-brand-950">{modelMetrics.MAE_kWh.toFixed(4)} kWh</dd>
              </div>
              <div className="p-3 rounded-lg bg-brand-100/50 border border-brand-200/50">
                <dt className="text-brand-500 text-xs uppercase tracking-wide">RMSE</dt>
                <dd className="mt-1 text-lg font-semibold text-brand-950">{modelMetrics.RMSE_kWh.toFixed(4)} kWh</dd>
              </div>
              <div className="p-3 rounded-lg bg-brand-100/50 border border-brand-200/50">
                <dt className="text-brand-500 text-xs uppercase tracking-wide">R²</dt>
                <dd className="mt-1 text-lg font-semibold text-brand-950">{modelMetrics.R2.toFixed(4)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      {/* B. Emission Factor */}
      <section aria-labelledby="emission-heading" className="space-y-6">
        <h2 id="emission-heading" className="section-title">Emission Factor</h2>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-brand-950">Electricity Emission Factor</h3>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="sm:col-span-2">
                <dt className="text-brand-500">Value</dt>
                <dd className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">{emissionFactor} kg CO₂/kWh</dd>
              </div>
              <div>
                <dt className="text-brand-500">Source</dt>
                <dd className="text-brand-950 font-medium">{factorSource}</dd>
              </div>
              <div>
                <dt className="text-brand-500">Database Version</dt>
                <dd className="text-brand-950 font-medium">{factorVersion}</dd>
              </div>
              <div>
                <dt className="text-brand-500">Reporting Period</dt>
                <dd className="text-brand-950 font-medium">{reportingPeriod}</dd>
              </div>
              <div>
                <dt className="text-brand-500">Gas</dt>
                <dd className="text-brand-950 font-medium">{gas}</dd>
              </div>
            </dl>

            <div className="pt-4 border-t border-brand-100/50 space-y-2">
              <p className="text-sm text-brand-500">
                <strong>Scope:</strong> This factor applies <strong>only to grid electricity consumption</strong>. It is not used for LPG, water, food, or transport calculations.
              </p>
              <p className="text-sm text-brand-500">
                <strong>Period Note:</strong> The reporting period ({reportingPeriod}) differs from the historical survey period (Jan 2018 – Feb 2020).
              </p>
              <p className="text-sm text-brand-500">
                <strong>Immutability:</strong> The emission factor is <strong>not user-editable</strong>. It is sourced from the backend model metadata and versioned for reproducibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* C. Limitations */}
      <section aria-labelledby="limitations-heading" className="space-y-6">
        <h2 id="limitations-heading" className="section-title">Limitations</h2>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-brand-950">Important Limitations</h3>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2 text-sm text-brand-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-300 mt-0.5">•</span>
                <span>Trained on historical household electricity observations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-300 mt-0.5">•</span>
                <span>Evaluation uses a historical test period (Nov 2019 – Feb 2020).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-300 mt-0.5">•</span>
                <span>Current-period forecasts need validation against newer data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-300 mt-0.5">•</span>
                <span>The emission factor is configurable and separate from the ML model.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-300 mt-0.5">•</span>
                <span>R² = 0.1689 indicates modest explanatory power. Predictions should be treated as estimates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-300 mt-0.5">•</span>
                <span>The model predicts electricity consumption. CO₂ is calculated deterministically using the configured emission factor.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Application Info */}
      <section aria-labelledby="app-heading" className="space-y-6">
        <h2 id="app-heading" className="section-title">Application</h2>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-brand-950">Information</h3>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-brand-100/30 border border-brand-200/50">
              <p className="text-brand-500">Version</p>
              <p className="font-mono text-brand-950">0.1.0</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-100/30 border border-brand-200/50">
              <p className="text-brand-500">Frontend</p>
              <p className="text-brand-600">React 18 + TypeScript + Vite + Tailwind CSS</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-100/30 border border-brand-200/50">
              <p className="text-brand-500">Backend</p>
              <p className="text-brand-600">FastAPI (Python) — Seasonal Gradient Boosting</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}