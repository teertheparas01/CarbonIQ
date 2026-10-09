import { useState } from 'react';
import { useForecast } from '../hooks';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Input, Select, Button, Badge } from '../components/ui';

const MONTH_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export function Electricity() {
  const [formData, setFormData] = useState({
    electricity_t_minus_2: '',
    electricity_t_minus_1: '',
    target_month_num: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { predict, loading, error, lastResult, clearError } = useForecast();

  const validateField = (name: string, value: string): string | null => {
    if (name === 'electricity_t_minus_2' || name === 'electricity_t_minus_1') {
      const num = parseFloat(value);
      if (value === '') return 'Required';
      if (isNaN(num)) return 'Must be a number';
      if (num < 0) return 'Must be non-negative';
    }
    if (name === 'target_month_num') {
      const num = parseInt(value, 10);
      if (value === '') return 'Required';
      if (isNaN(num) || num < 1 || num > 12) return 'Must be 1–12';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError || '' }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(key, formData[key as keyof typeof formData]);
      if (fieldError) {
        newErrors[key] = fieldError;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    if (hasErrors) return;

    await predict({
      electricity_t_minus_2: parseFloat(formData.electricity_t_minus_2),
      electricity_t_minus_1: parseFloat(formData.electricity_t_minus_1),
      target_month_num: parseInt(formData.target_month_num, 10),
    });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-3xl">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-header-title">Electricity</h1>
        <p className="page-header-subtitle">
          Electricity consumption forecasting and CO₂ estimation.
        </p>
      </header>

      {/* Overview */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-brand-500">Data Availability</p>
              <p className="mt-1 text-xl font-semibold text-brand-950 tracking-tight">Live</p>
              <p className="mt-0.5 text-sm text-brand-500">Forecasting & deterministic CO₂ available</p>
            </div>
            <Badge variant="success" size="sm" className="flex-shrink-0 mt-1">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Section */}
      <section aria-labelledby="forecast-heading" className="space-y-6">
        <h2 id="forecast-heading" className="section-title">Next-Month Forecast</h2>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-brand-950">Predict Next Month</h3>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-brand-500 mb-4">
              Enter the last two months of electricity consumption to predict next month&apos;s usage and associated CO₂ emissions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Electricity (t-2) [kWh]"
                  name="electricity_t_minus_2"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 92"
                  value={formData.electricity_t_minus_2}
                  onChange={handleChange}
                  error={errors.electricity_t_minus_2}
                  helperText="Consumption two months ago"
                />
                <Input
                  label="Electricity (t-1) [kWh]"
                  name="electricity_t_minus_1"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g., 114"
                  value={formData.electricity_t_minus_1}
                  onChange={handleChange}
                  error={errors.electricity_t_minus_1}
                  helperText="Consumption last month"
                />
              </div>

              <Select
                label="Target Month"
                name="target_month_num"
                options={MONTH_OPTIONS}
                placeholder="Select month"
                value={formData.target_month_num}
                onChange={handleChange}
                error={errors.target_month_num}
                helperText="Month to forecast"
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" loading={loading} className="w-full sm:w-auto" disabled={loading}>
                  {loading ? 'Predicting…' : 'Predict'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => {
                  setFormData({ electricity_t_minus_2: '', electricity_t_minus_1: '', target_month_num: '' });
                  setErrors({});
                  clearError();
                }} disabled={loading}>
                  Clear
                </Button>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {lastResult && (
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-brand-950">Prediction Result</h3>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-brand-100/50 border border-brand-200/50">
                  <p className="text-sm text-brand-500">Predicted Electricity</p>
                  <p className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">
                    {lastResult.predicted_electricity_kwh.toFixed(2)} kWh
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-brand-100/50 border border-brand-200/50">
                  <p className="text-sm text-brand-500">Predicted CO₂</p>
                  <p className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">
                    {lastResult.predicted_co2_kg.toFixed(3)} kg CO₂
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-100/50 space-y-3">
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div>
                    <dt className="text-brand-500">Emission Factor</dt>
                    <dd className="text-brand-950 font-medium">{lastResult.emission_factor_kg_co2_per_kwh} kg CO₂/kWh</dd>
                  </div>
                  <div>
                    <dt className="text-brand-500">Source</dt>
                    <dd className="text-brand-950 font-medium">{lastResult.factor_source}</dd>
                  </div>
                  <div>
                    <dt className="text-brand-500">Version</dt>
                    <dd className="text-brand-950 font-medium">{lastResult.factor_version}</dd>
                  </div>
                  <div>
                    <dt className="text-brand-500">Reporting Period</dt>
                    <dd className="text-brand-950 font-medium">{lastResult.reporting_period}</dd>
                  </div>
                  <div>
                    <dt className="text-brand-500">Gas</dt>
                    <dd className="text-brand-950 font-medium">{lastResult.gas}</dd>
                  </div>
                  <div>
                    <dt className="text-brand-500">Model</dt>
                    <dd className="text-brand-950 font-medium">{lastResult.model_name}</dd>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2">
                    <dt className="text-brand-500">Model Metrics (Test: Nov 2019–Feb 2020)</dt>
                    <dd className="text-brand-950 font-medium">
                      MAE: {lastResult.model_metrics.MAE_kWh.toFixed(4)} kWh · RMSE: {lastResult.model_metrics.RMSE_kWh.toFixed(4)} kWh · R²: {lastResult.model_metrics.R2.toFixed(4)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-4 border-t border-brand-100/50">
                <p className="text-sm text-brand-500">
                  <strong>Limitations:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-sm text-brand-600">
                    {lastResult.limitations.map((limitation, i) => (
                      <li key={i}>{limitation}</li>
                    ))}
                  </ul>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Emission Factor Section */}
      <section aria-labelledby="emission-heading" className="space-y-6">
        <h2 id="emission-heading" className="section-title">Emission Factor</h2>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-brand-950">Electricity Emission Factor</h3>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="sm:col-span-2">
                <dt className="text-brand-500">Value</dt>
                <dd className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">0.675 kg CO₂/kWh</dd>
              </div>
              <div>
                <dt className="text-brand-500">Source</dt>
                <dd className="text-brand-950 font-medium">Central Electricity Authority (CEA)</dd>
              </div>
              <div>
                <dt className="text-brand-500">Database Version</dt>
                <dd className="text-brand-950 font-medium">22.0</dd>
              </div>
              <div>
                <dt className="text-brand-500">Reporting Period</dt>
                <dd className="text-brand-950 font-medium">FY 2025-26</dd>
              </div>
              <div>
                <dt className="text-brand-500">Gas</dt>
                <dd className="text-brand-950 font-medium">CO₂</dd>
              </div>
            </dl>

            <div className="pt-4 border-t border-brand-100/50 space-y-2">
              <p className="text-sm text-brand-500">
                <strong>Scope:</strong> This factor applies <strong>only to grid electricity consumption</strong>. It is not used for LPG, water, food, or transport calculations.
              </p>
              <p className="text-sm text-brand-500">
                <strong>Period Note:</strong> The reporting period (FY 2025-26) differs from the historical survey period (Jan 2018 – Feb 2020).
              </p>
              <p className="text-sm text-brand-500">
                <strong>Immutability:</strong> The emission factor is <strong>not user-editable</strong>. It is sourced from the backend model metadata and versioned for reproducibility.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Historical Section - Empty State */}
      <section aria-labelledby="historical-heading" className="space-y-6">
        <h2 id="historical-heading" className="section-title">Historical Electricity</h2>

        <Card className="border-brand-200/50 bg-brand-100/30">
          <CardContent className="pt-8 pb-8 text-center">
            <svg className="mx-auto mb-4 w-12 h-12 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 4-4 4 4" />
            </svg>
            <h3 className="text-lg font-medium text-brand-950 mb-2">Historical Electricity Visualization</h3>
            <p className="text-sm text-brand-500 max-w-md mx-auto">
              Historical survey data is not currently exposed by the CarbonIQ API.
            </p>
            <p className="mt-2 text-xs text-brand-400">
              When available, this section will display monthly electricity consumption trends from the household survey dataset (Jan 2018 – Feb 2020).
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Important Notes */}
      <Card className="border-brand-200/50 bg-brand-100/30">
        <CardContent className="pt-5">
          <h3 className="text-sm font-medium text-brand-950 mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span><strong>Model predicts electricity consumption</strong> — CO₂ is calculated deterministically from the predicted kWh using the emission factor (0.675 kg CO₂/kWh).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Model trained on historical household survey data (Jan 2018 – Feb 2020). Current-period forecasts need validation against newer data.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Emission factor source: <strong>Central Electricity Authority (CEA)</strong>, database v22.0, reporting period FY 2025-26.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>R² = 0.1689 indicates modest explanatory power. Predictions should be treated as estimates.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}