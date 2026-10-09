import { useState, useEffect } from 'react';
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

interface HistoryEntry {
  id: string;
  timestamp: string;
  input: {
    electricity_t_minus_2: number;
    electricity_t_minus_1: number;
    target_month_num: number;
  };
  output: {
    predicted_electricity_kwh: number;
    predicted_co2_kg: number;
    emission_factor_kg_co2_per_kwh: number;
    factor_source: string;
    factor_version: string;
    reporting_period: string;
    model_name: string;
  };
}

const STORAGE_KEY = 'carboniq_forecast_history';

export function Forecast() {
  const [formData, setFormData] = useState({
    electricity_t_minus_2: '',
    electricity_t_minus_1: '',
    target_month_num: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const { predict, loading, error, lastResult, clearError } = useForecast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  const saveToHistory = (entry: HistoryEntry) => {
    const newHistory = [entry, ...history.slice(0, 19)];
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore quota errors
    }
  };

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

    const payload = {
      electricity_t_minus_2: parseFloat(formData.electricity_t_minus_2),
      electricity_t_minus_1: parseFloat(formData.electricity_t_minus_1),
      target_month_num: parseInt(formData.target_month_num, 10),
    };

    const result = await predict(payload);

    if (result) {
      saveToHistory({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        input: payload,
        output: {
          predicted_electricity_kwh: result.predicted_electricity_kwh,
          predicted_co2_kg: result.predicted_co2_kg,
          emission_factor_kg_co2_per_kwh: result.emission_factor_kg_co2_per_kwh,
          factor_source: result.factor_source,
          factor_version: result.factor_version,
          reporting_period: result.reporting_period,
          model_name: result.model_name,
        },
      });
    }
  };

  const formatTimestamp = (iso: string) => {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMonthLabel = (num: number) => {
    return MONTH_OPTIONS.find((m) => m.value === num)?.label || String(num);
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-header-title">Forecast</h1>
        <p className="page-header-subtitle">
          Predict next-month electricity consumption and associated CO₂ emissions.
        </p>
      </header>

      {/* Important Note */}
      <Card className="border-brand-300/30 bg-brand-100/30">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <svg className="flex-shrink-0 mt-0.5 w-5 h-5 text-brand-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <div>
              <p className="text-sm font-medium text-brand-950">How it works</p>
              <p className="mt-1 text-sm text-brand-600">
                <strong>The model predicts electricity consumption.</strong> CO₂ is calculated deterministically from the predicted kWh using the configured emission factor (0.675 kg CO₂/kWh, CEA v22.0, FY 2025-26).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Form */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-brand-950">New Forecast</h3>
            </CardHeader>
            <CardContent>
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

          {/* Latest Result */}
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
        </div>

        <div className="space-y-6">
          {/* History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-sm font-medium text-brand-950">Prediction History</h3>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => {
                  if (confirm('Clear all prediction history?')) {
                    setHistory([]);
                    localStorage.removeItem(STORAGE_KEY);
                  }
                }}>
                  Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {history.length === 0 ? (
                <div className="py-10 text-center">
                  <svg className="mx-auto mb-3 w-10 h-10 text-brand-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <p className="text-sm text-brand-500">No predictions yet</p>
                  <p className="mt-1 text-xs text-brand-400">Make your first prediction to see history here.</p>
                </div>
              ) : (
                <div className="space-y-2" role="list">
                  {history.map((entry) => (
                    <article key={entry.id} className="p-4 rounded-lg bg-brand-100/30 border border-brand-100/50">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <time className="text-xs text-brand-500 font-mono" dateTime={entry.timestamp}>
                          {formatTimestamp(entry.timestamp)}
                        </time>
                        <Badge variant="neutral" size="sm">{getMonthLabel(entry.input.target_month_num)}</Badge>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                        <div>
                          <span className="text-brand-500">t-2:</span>{' '}
                          <span className="text-brand-950 font-medium">{entry.input.electricity_t_minus_2} kWh</span>
                        </div>
                        <div>
                          <span className="text-brand-500">t-1:</span>{' '}
                          <span className="text-brand-950 font-medium">{entry.input.electricity_t_minus_1} kWh</span>
                        </div>
                        <div>
                          <span className="text-brand-500">Electricity:</span>{' '}
                          <span className="text-brand-950 font-medium">{entry.output.predicted_electricity_kwh.toFixed(2)} kWh</span>
                        </div>
                        <div>
                          <span className="text-brand-500">CO₂:</span>{' '}
                          <span className="text-brand-950 font-medium">{entry.output.predicted_co2_kg.toFixed(3)} kg</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-brand-100/50 text-xs text-brand-500">
                        Factor: {entry.output.emission_factor_kg_co2_per_kwh} kg CO₂/kWh · {entry.output.factor_source} v{entry.output.factor_version} ({entry.output.reporting_period}) · {entry.output.model_name}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}