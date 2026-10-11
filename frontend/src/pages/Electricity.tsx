'use client';

import { useState } from 'react';
import { useForecast } from '../hooks';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Input, Select, Button, Badge } from '../components/ui';
import { PowerGridIsland } from '../components/animations/PowerGridIsland';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

const SEASONAL_TREND_DATA = [
  { month: 'Jan', kwh: 88, co2: 59.4, season: 'Winter' },
  { month: 'Feb', kwh: 94, co2: 63.4, season: 'Winter' },
  { month: 'Mar', kwh: 118, co2: 79.6, season: 'Pre-Summer' },
  { month: 'Apr', kwh: 142, co2: 95.8, season: 'Summer Peak' },
  { month: 'May', kwh: 156, co2: 105.3, season: 'Summer Peak' },
  { month: 'Jun', kwh: 122, co2: 82.3, season: 'Monsoon' },
  { month: 'Jul', kwh: 104, co2: 70.2, season: 'Monsoon' },
  { month: 'Aug', kwh: 98, co2: 66.1, season: 'Monsoon' },
  { month: 'Sep', kwh: 102, co2: 68.8, season: 'Monsoon' },
  { month: 'Oct', kwh: 115, co2: 77.6, season: 'Post-Monsoon' },
  { month: 'Nov', kwh: 95, co2: 64.1, season: 'Winter' },
  { month: 'Dec', kwh: 86, co2: 58.0, season: 'Winter' },
];

const END_USE_DATA = [
  { category: 'Air Conditioning', share: 38, avgKwh: 52 },
  { category: 'Refrigeration', share: 22, avgKwh: 30 },
  { category: 'Fans & Lighting', share: 18, avgKwh: 25 },
  { category: 'Water Heating', share: 14, avgKwh: 19 },
  { category: 'Electronics & Misc', share: 8, avgKwh: 11 },
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
      const err = validateField(key, formData[key as keyof typeof formData]);
      if (err) {
        newErrors[key] = err;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    if (hasErrors) return;

    try {
      await predict({
        electricity_t_minus_2: parseFloat(formData.electricity_t_minus_2),
        electricity_t_minus_1: parseFloat(formData.electricity_t_minus_1),
        target_month_num: parseInt(formData.target_month_num, 10),
      });
    } catch {
      // Error handled by hook
    }
  };

  const activeKwh = lastResult
    ? lastResult.predicted_electricity_kwh
    : parseFloat(formData.electricity_t_minus_1) || parseFloat(formData.electricity_t_minus_2) || 110;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header - Green & White Palette */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-700/10 border border-brand-300/30 text-brand-700">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-950 tracking-tight">Electricity Intelligence</h1>
            <p className="text-sm text-brand-600">
              Household consumption forecasting, regional grid factor, and live electrical distribution.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Interactive Power Grid Island Animation */}
      <section aria-label="3D Grid Simulation">
        <PowerGridIsland usageKwh={activeKwh} />
      </section>

      {/* Forecast & Result Section */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Input Form Card */}
        <Card className="border-brand-200/70 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-brand-950">Next-Month Consumption Forecast</h2>
              <Badge variant="success">Gradient Boosting</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-brand-600 mb-5 leading-relaxed">
              Enter consumption from the preceding two billing cycles to forecast next month using our seasonal ML pipeline trained on 5,347 household samples.
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
                  helperText="Consumption 2 months prior"
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
                placeholder="Select forecast month"
                value={formData.target_month_num}
                onChange={handleChange}
                error={errors.target_month_num}
                helperText="Month to predict"
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" loading={loading} className="w-full sm:w-auto" disabled={loading}>
                  {loading ? 'Predicting…' : 'Generate Forecast'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormData({ electricity_t_minus_2: '', electricity_t_minus_1: '', target_month_num: '' });
                    setErrors({});
                    clearError();
                  }}
                  disabled={loading}
                >
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

        {/* Prediction Output Card */}
        {lastResult ? (
          <Card className="border-brand-700/30 bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-brand-950">Predicted Output</h3>
                <span className="text-xs font-mono text-brand-800 font-semibold bg-brand-100 px-2.5 py-0.5 rounded-full">
                  CEA v22.0
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-brand-50 border border-brand-200/80 shadow-sm">
                  <p className="text-xs text-brand-600 uppercase tracking-wider font-semibold">Predicted Usage</p>
                  <p className="mt-1 text-2xl font-bold text-brand-950 tracking-tight">
                    {lastResult.predicted_electricity_kwh.toFixed(1)}{' '}
                    <span className="text-sm font-normal text-brand-600">kWh</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-brand-50 border border-brand-200/80 shadow-sm">
                  <p className="text-xs text-brand-600 uppercase tracking-wider font-semibold">Deterministic CO₂</p>
                  <p className="mt-1 text-2xl font-bold text-brand-700 tracking-tight">
                    {lastResult.predicted_co2_kg.toFixed(2)}{' '}
                    <span className="text-sm font-normal text-brand-600">kg CO₂</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-100 space-y-2 text-xs text-brand-600">
                <div className="flex justify-between py-1 border-b border-brand-100/50">
                  <span className="text-brand-600">Grid Factor:</span>
                  <span className="font-semibold text-brand-950">{lastResult.emission_factor_kg_co2_per_kwh} kg CO₂/kWh</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-100/50">
                  <span className="text-brand-600">Reporting Period:</span>
                  <span className="font-semibold text-brand-950">{lastResult.reporting_period}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-brand-600">Test MAE:</span>
                  <span className="font-semibold text-brand-950">{lastResult.model_metrics.MAE_kWh.toFixed(2)} kWh</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-brand-200 bg-white/60 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <div className="p-3 rounded-full bg-brand-100 text-brand-700 mb-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-brand-950">Awaiting Prediction Inputs</h3>
            <p className="mt-1 text-xs text-brand-600 max-w-xs">
              Fill in your consumption numbers on the left and submit to view your deterministic CO₂ footprint.
            </p>
          </Card>
        )}
      </div>

      {/* Interactive Charts Section - Green & White Palette */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Seasonal Electricity Profile Chart */}
        <Card className="bg-white border-brand-200/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Pune Seasonal Electricity Profile</h3>
                <p className="text-xs text-brand-600">Household consumption vs carbon footprint across the year</p>
              </div>
              <Badge variant="default">Historical Median</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SEASONAL_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="kwhGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#235347" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#235347" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8EB69B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8EB69B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5D7A6B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5D7A6B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#051F20',
                      borderColor: '#8EB69B',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="kwh" name="Consumption (kWh)" stroke="#235347" fillOpacity={1} fill="url(#kwhGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="co2" name="Emissions (kg CO₂)" stroke="#8EB69B" fillOpacity={1} fill="url(#co2Grad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-brand-700 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-700" /> Electricity (kWh)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-300 border border-brand-400" /> Carbon (kg CO₂)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* End-Use Appliance Breakdown */}
        <Card className="bg-white border-brand-200/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Household Load by Appliance</h3>
                <p className="text-xs text-brand-600">Average power distribution for Pune residences</p>
              </div>
              <Badge variant="default">Distribution</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={END_USE_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#5D7A6B' }} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#5D7A6B' }} width={110} />
                  <Tooltip
                    formatter={(value: any) => [`${value}% share`, 'Grid Load']}
                    contentStyle={{
                      backgroundColor: '#051F20',
                      borderColor: '#8EB69B',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="share" fill="#235347" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-center text-xs text-brand-600">
              Cooling accounts for nearly 40% of peak household power during summer months (April–May).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Emission Factor & Notes */}
      <Card className="border-brand-200/60 bg-white shadow-sm">
        <CardHeader>
          <h3 className="text-sm font-semibold text-brand-950">Grid Emission Standards &amp; Attribution</h3>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="p-3 rounded-lg bg-brand-50 border border-brand-100">
              <span className="text-brand-600 font-medium">Emission Factor:</span>
              <p className="text-base font-bold text-brand-950 mt-0.5">0.675 kg CO₂/kWh</p>
              <p className="text-brand-500 mt-1">Central Electricity Authority (CEA) Database v22.0</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-50 border border-brand-100">
              <span className="text-brand-600 font-medium">Validation Metric:</span>
              <p className="text-base font-bold text-brand-950 mt-0.5">32.12 kWh MAE</p>
              <p className="text-brand-500 mt-1">Evaluated across 5,347 sample points</p>
            </div>
            <div className="p-3 rounded-lg bg-brand-50 border border-brand-100">
              <span className="text-brand-600 font-medium">Scope Boundary:</span>
              <p className="text-base font-bold text-brand-950 mt-0.5">Scope 2 Indirect</p>
              <p className="text-brand-500 mt-1">Restricted to grid electricity; not combined with fuel</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}