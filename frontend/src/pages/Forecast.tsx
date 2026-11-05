import { useState, useEffect } from 'react';
import { useForecast } from '../hooks';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Input, Select, Badge } from '../components/ui';
import { GlassButton } from '../lib/animations';
import { Flame, Zap } from 'lucide-react';

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

// LPG emission constants (IPCC AR5)
const LPG_KG_PER_CYLINDER = 14.2; // kg per domestic cylinder
const LPG_CO2_FACTOR = 2.983;     // kg CO₂ per kg LPG

interface HistoryEntry {
  id: string;
  timestamp: string;
  input: {
    electricity_t_minus_2?: number;
    electricity_t_minus_1?: number;
    target_month_num?: number;
    cyl_t_minus_2?: number;
    cyl_t_minus_1?: number;
  };
  output: {
    predicted_electricity_kwh?: number;
    predicted_co2_kg: number;
    emission_factor_kg_co2_per_kwh?: number;
    factor_source: string;
    factor_version?: string;
    reporting_period?: string;
    model_name: string;
    // LPG specific
    predicted_cylinders?: number;
    predicted_kg_lpg?: number;
    predicted_lpg_co2_kg?: number;
  };
}

const STORAGE_KEY = 'carboniq_forecast_history';

export function Forecast() {
  // Electricity state
  const [formData, setFormData] = useState({
    electricity_t_minus_2: '',
    electricity_t_minus_1: '',
    target_month_num: '',
  });
  // LPG state
  const [lpgFormData, setLpgFormData] = useState({
    cyl_t_minus_2: '',
    cyl_t_minus_1: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lpgErrors, setLpgErrors] = useState<Record<string, string>>({});

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
    if (name === 'electricity_t_minus_2' || name === 'electricity_t_minus_1' || name === 'cyl_t_minus_2' || name === 'cyl_t_minus_1') {
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

  const handleLpgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLpgFormData((prev) => ({ ...prev, [name]: value }));
    const fieldError = validateField(name, value);
    setLpgErrors((prev) => ({ ...prev, [name]: fieldError || '' }));
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

  const handleLpgSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    Object.keys(lpgFormData).forEach((key) => {
      const fieldError = validateField(key, lpgFormData[key as keyof typeof lpgFormData]);
      if (fieldError) {
        newErrors[key] = fieldError;
        hasErrors = true;
      }
    });

    setLpgErrors(newErrors);
    if (hasErrors) return;

    const c2 = parseFloat(lpgFormData.cyl_t_minus_2);
    const c1 = parseFloat(lpgFormData.cyl_t_minus_1);
    // Simple weighted moving average: 40% weight on t-2, 60% on t-1
    const predicted = parseFloat((c2 * 0.4 + c1 * 0.6).toFixed(2));
    const kgLpg = parseFloat((predicted * LPG_KG_PER_CYLINDER).toFixed(2));
    const co2 = parseFloat((kgLpg * LPG_CO2_FACTOR).toFixed(2));

    saveToHistory({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      input: {
        cyl_t_minus_2: c2,
        cyl_t_minus_1: c1,
      },
      output: {
        predicted_co2_kg: co2,
        factor_source: 'IPCC AR5 (LPG direct combustion)',
        factor_version: '2013',
        model_name: 'Weighted Average (0.4×t-2 + 0.6×t-1)',
        predicted_cylinders: predicted,
        predicted_kg_lpg: kgLpg,
        predicted_lpg_co2_kg: co2,
      },
    });

    setLpgFormData({ cyl_t_minus_2: '', cyl_t_minus_1: '' });
    setLpgErrors({});
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

  return (
    <div className="animate-fade-in space-y-8 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-header-title">Emissions Forecasting</h1>
        <p className="page-header-subtitle">
          Predict next-month household electricity demand and LPG cylinder consumption with deterministic carbon footprints.
        </p>

        {/* Info Card - Glass Card */}
        <Card glass className="glass-card--interactive mt-6">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5 p-2 rounded-xl glass glass--highlighted">
                <svg className="w-5 h-5 text-brand-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-brand-950">Electricity Pipeline</p>
                <p className="mt-1 text-sm text-brand-600">
                  <strong>The model predicts electricity consumption (kWh).</strong> CO₂ is calculated deterministically from your predicted kilowatt-hours using the CEA grid emission factor (0.675 kg CO₂/kWh).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <div className="flex-shrink-0 mt-0.5 p-2 rounded-xl glass glass--highlighted">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-brand-950">LPG Pipeline</p>
                <p className="mt-1 text-sm text-brand-600">
                  <strong>Simple weighted average forecast.</strong> CO₂ uses IPCC AR5 direct combustion factor (2.983 kg CO₂/kg LPG). 14.2 kg per standard domestic cylinder.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Electricity Form */}
          <Card glass>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-medium text-brand-950">Electricity Forecast</h3>
                </div>
                <Badge variant="success" glass>ML Model</Badge>
              </div>
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
                    glass
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
                    glass
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
                  glass
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <GlassButton type="submit" variant="primary" size="md" loading={loading} disabled={loading} className="w-full sm:w-auto">
                    {loading ? 'Predicting…' : 'Predict'}
                  </GlassButton>
                  <GlassButton type="button" variant="secondary" size="md" onClick={() => {
                    setFormData({ electricity_t_minus_2: '', electricity_t_minus_1: '', target_month_num: '' });
                    setErrors({});
                    clearError();
                  }} disabled={loading}>
                    Clear
                  </GlassButton>
                </div>

                {error && (
                  <div className="p-3 rounded-xl glass glass--highlighted border-red-400/50 bg-red-50/30 text-red-700 text-sm" role="alert">
                    {error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* LPG Form */}
          <Card glass>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-medium text-brand-950">LPG Cylinder Forecast</h3>
                </div>
                <Badge variant="warning" glass>Weighted Average</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLpgSubmit} className="space-y-4">
                <p className="text-xs text-brand-600 mb-2 leading-relaxed">
                  Enter cylinders consumed in the last two billing cycles to estimate next month's LPG requirements and thermal emissions.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Cylinders (t-2)"
                    name="cyl_t_minus_2"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g., 1"
                    value={lpgFormData.cyl_t_minus_2}
                    onChange={handleLpgChange}
                    error={lpgErrors.cyl_t_minus_2}
                    helperText="Cylinders 2 months ago"
                    glass
                  />
                  <Input
                    label="Cylinders (t-1)"
                    name="cyl_t_minus_1"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="e.g., 1.5"
                    value={lpgFormData.cyl_t_minus_1}
                    onChange={handleLpgChange}
                    error={lpgErrors.cyl_t_minus_1}
                    helperText="Cylinders last month"
                    glass
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <GlassButton type="submit" variant="primary" size="md" className="w-full sm:w-auto">
                    Estimate CO₂
                  </GlassButton>
                  <GlassButton type="button" variant="secondary" size="md" onClick={() => {
                    setLpgFormData({ cyl_t_minus_2: '', cyl_t_minus_1: '' });
                    setLpgErrors({});
                  }}>
                    Clear
                  </GlassButton>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Electricity Latest Result - Glass Card */}
          {lastResult && (
            <Card glass>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-medium text-brand-950">Electricity Prediction Result</h3>
                  </div>
                  <Badge variant="info" glass size="sm">Standardized</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl glass glass--highlighted">
                    <p className="text-sm text-brand-500">Predicted Electricity</p>
                    <p className="mt-1 text-2xl font-semibold text-brand-950 tracking-tight">
                      {lastResult.predicted_electricity_kwh.toFixed(2)} kWh
                    </p>
                  </div>
                  <div className="p-4 rounded-xl glass glass--highlighted">
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
                      <dt className="text-brand-500">Reporting Period</dt>
                      <dd className="text-brand-950 font-medium">{lastResult.reporting_period}</dd>
                    </div>
                    <div>
                      <dt className="text-brand-500">Model</dt>
                      <dd className="text-brand-950 font-medium">{lastResult.model_name}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* History Column - Glass Card */}
          <Card glass>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-sm font-medium text-brand-950">Prediction History</h3>
              {history.length > 0 && (
                <GlassButton variant="ghost" size="sm" onClick={() => {
                  if (confirm('Clear all prediction history?')) {
                    setHistory([]);
                    localStorage.removeItem(STORAGE_KEY);
                  }
                }}>
                  Clear All
                </GlassButton>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {history.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 p-3 rounded-2xl glass glass--highlighted w-fit">
                    <svg className="w-10 h-10 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-sm text-brand-500">No predictions yet</p>
                  <p className="mt-1 text-xs text-brand-400">Make your first prediction to see history here.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1" role="list">
                  {history.map((entry) => {
                    const isElectricity = entry.input.electricity_t_minus_2 !== undefined;
                    const isLPG = entry.input.cyl_t_minus_2 !== undefined;
                    return (
                      <article key={entry.id} className="p-3.5 rounded-xl glass glass--highlighted text-xs">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <time className="text-[11px] text-brand-500 font-mono" dateTime={entry.timestamp}>
                            {formatTimestamp(entry.timestamp)}
                          </time>
                          <Badge variant={isElectricity ? "success" : "warning"} size="sm" glass>
                            {isElectricity ? 'Electricity' : 'LPG'}
                          </Badge>
                        </div>

                        {isElectricity && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-brand-500">Usage:</span>{' '}
                              <span className="text-brand-950 font-semibold">{entry.output.predicted_electricity_kwh?.toFixed(1)} kWh</span>
                            </div>
                            <div>
                              <span className="text-brand-500">CO₂:</span>{' '}
                              <span className="text-brand-950 font-semibold">{entry.output.predicted_co2_kg?.toFixed(2)} kg</span>
                            </div>
                          </div>
                        )}

                        {isLPG && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-brand-500">Cylinders:</span>{' '}
                              <span className="text-brand-950 font-semibold">{entry.output.predicted_cylinders?.toFixed(2)} cyl</span>
                            </div>
                            <div>
                              <span className="text-brand-500">CO₂:</span>{' '}
                              <span className="text-brand-950 font-semibold">{entry.output.predicted_lpg_co2_kg?.toFixed(2)} kg</span>
                            </div>
                          </div>
                        )}

                        <div className="mt-2 pt-1.5 border-t border-brand-100/60 text-[10px] text-brand-500 truncate">
                          {entry.output.factor_source}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}