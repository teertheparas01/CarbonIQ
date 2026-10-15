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

const LPG_KG_PER_CYLINDER = 14.2;
const LPG_CO2_FACTOR = 2.983;

interface HistoryEntry {
  id: string;
  type: 'electricity' | 'lpg';
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
    predicted_cylinders?: number;
    predicted_kg_lpg?: number;
  };
}

interface LPGResult {
  cyl_t_minus_2: number;
  cyl_t_minus_1: number;
  predicted_cylinders: number;
  predicted_kg_lpg: number;
  predicted_co2_kg: number;
}

const STORAGE_KEY = 'carboniq_forecast_history';

export function Forecast() {
  const [activeTab, setActiveTab] = useState<'electricity' | 'lpg'>('electricity');

  // Electricity state
  const [formData, setFormData] = useState({
    electricity_t_minus_2: '',
    electricity_t_minus_1: '',
    target_month_num: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // LPG state
  const [lpgFormData, setLpgFormData] = useState({
    cyl_t_minus_2: '',
    cyl_t_minus_1: '',
  });
  const [lpgErrors, setLpgErrors] = useState<Record<string, string>>({});
  const [lpgResult, setLpgResult] = useState<LPGResult | null>(null);

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

  const validateLPGField = (value: string): string | null => {
    const num = parseFloat(value);
    if (value === '') return 'Required';
    if (isNaN(num) || num < 0) return 'Must be a non-negative number';
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
    const fieldError = validateLPGField(value);
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
        type: 'electricity',
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
      const err = validateLPGField(lpgFormData[key as keyof typeof lpgFormData]);
      if (err) {
        newErrors[key] = err;
        hasErrors = true;
      }
    });

    setLpgErrors(newErrors);
    if (hasErrors) return;

    const c2 = parseFloat(lpgFormData.cyl_t_minus_2);
    const c1 = parseFloat(lpgFormData.cyl_t_minus_1);
    const predicted = parseFloat((c2 * 0.4 + c1 * 0.6).toFixed(2));
    const kgLpg = parseFloat((predicted * LPG_KG_PER_CYLINDER).toFixed(2));
    const co2 = parseFloat((kgLpg * LPG_CO2_FACTOR).toFixed(2));

    const resultPayload: LPGResult = {
      cyl_t_minus_2: c2,
      cyl_t_minus_1: c1,
      predicted_cylinders: predicted,
      predicted_kg_lpg: kgLpg,
      predicted_co2_kg: co2,
    };

    setLpgResult(resultPayload);

    saveToHistory({
      id: crypto.randomUUID(),
      type: 'lpg',
      timestamp: new Date().toISOString(),
      input: {
        cyl_t_minus_2: c2,
        cyl_t_minus_1: c1,
      },
      output: {
        predicted_cylinders: predicted,
        predicted_kg_lpg: kgLpg,
        predicted_co2_kg: co2,
        factor_source: 'IPCC AR5 (2.983 kg CO₂/kg)',
        model_name: 'Weighted Moving Average (40/60)',
      },
    });
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

  const getMonthLabel = (num?: number) => {
    if (!num) return '';
    return MONTH_OPTIONS.find((m) => m.value === num)?.label || String(num);
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-header-title">Emissions Forecasting</h1>
        <p className="page-header-subtitle">
          Predict next-month household energy demand and calculate deterministic carbon footprints.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6 p-1 bg-brand-100/60 rounded-xl w-fit border border-brand-200/60">
          <button
            onClick={() => setActiveTab('electricity')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'electricity'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-brand-700 hover:text-brand-950 hover:bg-brand-50'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Electricity Forecast
          </button>
          <button
            onClick={() => setActiveTab('lpg')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'lpg'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-brand-700 hover:text-brand-950 hover:bg-brand-50'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            LPG Thermal Forecast
          </button>
        </div>
      </header>

      {/* Info Card Dynamic to Selected Tab */}
      <Card className="border-brand-300/30 bg-brand-100/30">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <svg className="flex-shrink-0 mt-0.5 w-5 h-5 text-brand-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            {activeTab === 'electricity' ? (
              <div>
                <p className="text-sm font-medium text-brand-950">Electricity Pipeline</p>
                <p className="mt-1 text-sm text-brand-600">
                  <strong>The model predicts electricity consumption (kWh).</strong> CO₂ is calculated deterministically from the predicted kWh using the official baseline emission factor (0.675 kg CO₂/kWh, CEA v22.0, FY 2025-26).
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-brand-950">LPG Thermal Pipeline</p>
                <p className="mt-1 text-sm text-brand-600">
                  <strong>Weighted moving average (40/60) predicts cylinder demand.</strong> CO₂ is calculated deterministically using the IPCC AR5 domestic standard: 14.2 kg LPG per cylinder × 2.983 kg CO₂/kg LPG.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: Electricity Form */}
          {activeTab === 'electricity' && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-brand-950">Electricity Forecast</h3>
                    <Badge variant="success">Gradient Boosting</Badge>
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

              {/* Electricity Latest Result */}
              {lastResult && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-brand-950">Electricity Prediction Result</h3>
                      <span className="text-xs font-mono text-brand-800 font-semibold bg-brand-100 px-2.5 py-0.5 rounded-full">
                        CEA v22.0
                      </span>
                    </div>
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
            </>
          )}

          {/* TAB 2: LPG Form */}
          {activeTab === 'lpg' && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-brand-950">LPG Thermal Cylinder Forecast</h3>
                    <Badge variant="success">Weighted Moving Avg</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-brand-600 mb-4 leading-relaxed">
                    Enter cylinders consumed in preceding cycles to forecast next month&apos;s LPG requirement and direct Scope 1 CO₂ footprint using IPCC AR5 standards.
                  </p>
                  <form onSubmit={handleLpgSubmit} className="space-y-4">
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
                        helperText="Cylinders consumed 2 months ago"
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
                        helperText="Cylinders consumed last month"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button type="submit" className="w-full sm:w-auto">
                        Estimate LPG CO₂
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setLpgFormData({ cyl_t_minus_2: '', cyl_t_minus_1: '' });
                          setLpgErrors({});
                          setLpgResult(null);
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* LPG Latest Result */}
              {lpgResult && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-brand-950">LPG Prediction Result</h3>
                      <span className="text-xs font-mono text-amber-800 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        IPCC AR5
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200/60">
                        <p className="text-sm text-amber-800 font-medium">Predicted Cylinders</p>
                        <p className="mt-1 text-2xl font-bold text-brand-950 tracking-tight">
                          {lpgResult.predicted_cylinders}{' '}
                          <span className="text-sm font-normal text-brand-600">cylinders</span>
                        </p>
                        <p className="text-xs text-amber-700 mt-1">{lpgResult.predicted_kg_lpg} kg LPG</p>
                      </div>
                      <div className="p-4 rounded-lg bg-brand-100/50 border border-brand-200/50">
                        <p className="text-sm text-brand-600 font-medium">Deterministic CO₂</p>
                        <p className="mt-1 text-2xl font-bold text-brand-700 tracking-tight">
                          {lpgResult.predicted_co2_kg}{' '}
                          <span className="text-sm font-normal text-brand-600">kg CO₂</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-100/50 text-xs text-brand-600 space-y-2">
                      <div className="flex justify-between py-1 border-b border-brand-100/50">
                        <span>Emission Factor:</span>
                        <span className="font-semibold text-brand-950">2.983 kg CO₂/kg LPG</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-brand-100/50">
                        <span>Standard Cylinder:</span>
                        <span className="font-semibold text-brand-950">14.2 kg net domestic</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Boundary:</span>
                        <span className="font-semibold text-brand-950">Scope 1 Direct Thermal Combustion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          {/* History Column */}
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
                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1" role="list">
                  {history.map((entry) => (
                    <article key={entry.id} className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200/60 text-xs">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <time className="text-[11px] text-brand-500 font-mono" dateTime={entry.timestamp}>
                          {formatTimestamp(entry.timestamp)}
                        </time>
                        <Badge variant={entry.type === 'lpg' ? 'warning' : 'success'} size="sm">
                          {entry.type === 'lpg' ? 'LPG' : getMonthLabel(entry.input.target_month_num) || 'Electricity'}
                        </Badge>
                      </div>

                      {entry.type === 'lpg' ? (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-brand-500">Cylinders:</span>{' '}
                            <span className="text-brand-950 font-semibold">{entry.output.predicted_cylinders}</span>
                          </div>
                          <div>
                            <span className="text-brand-500">CO₂:</span>{' '}
                            <span className="text-brand-950 font-semibold">{entry.output.predicted_co2_kg} kg</span>
                          </div>
                        </div>
                      ) : (
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

                      <div className="mt-2 pt-1.5 border-t border-brand-100/60 text-[10px] text-brand-500 truncate">
                        {entry.output.factor_source}
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