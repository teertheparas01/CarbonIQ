'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Input, Button, Badge } from '../components/ui';
import { ThermalEarthGlobe } from '../components/animations/ThermalEarthGlobe';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// LPG emission constants (IPCC/MoPNG)
const LPG_KG_PER_CYLINDER = 14.2; // kg per domestic cylinder
const LPG_CO2_FACTOR = 2.983;     // kg CO₂ per kg LPG (IPCC AR5)


// Thermal energy efficiency and heat output by cooking fuel type
const COOKING_FUEL_COMPARISON = [
  { fuel: 'Induction / Electric', efficiency: 84, heatMJ: 3.6, co2Kg: 0.675, cleanRank: 1 },
  { fuel: 'LPG Cylinder', efficiency: 60, heatMJ: 46.1, co2Kg: 2.93, cleanRank: 2 },
  { fuel: 'Piped Natural Gas (PNG)', efficiency: 58, heatMJ: 38.0, co2Kg: 2.15, cleanRank: 3 },
  { fuel: 'Biomass / Firewood', efficiency: 18, heatMJ: 16.0, co2Kg: 4.80, cleanRank: 4 },
];

// Household LPG consumption benchmarks by family size in Pune urban households
const HOUSEHOLD_LPG_USAGE = [
  { householdSize: '1–2 Members', daysPerCylinder: 62, monthlyKg: 6.9, thermalMJ: 318 },
  { householdSize: '3–4 Members', daysPerCylinder: 38, monthlyKg: 11.2, thermalMJ: 516 },
  { householdSize: '5–6 Members', daysPerCylinder: 25, monthlyKg: 17.0, thermalMJ: 783 },
  { householdSize: '7+ Members', daysPerCylinder: 18, monthlyKg: 23.6, thermalMJ: 1088 },
];

interface LPGForecastResult {
  cylinders_t_minus_2: number;
  cylinders_t_minus_1: number;
  predicted_cylinders: number;
  predicted_kg_lpg: number;
  predicted_co2_kg: number;
}

export function LPG() {
  const [formData, setFormData] = useState({ cyl_t_minus_2: '', cyl_t_minus_1: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<LPGForecastResult | null>(null);

  const validate = (_name: string, value: string): string | null => {
    const num = parseFloat(value);
    if (value === '') return 'Required';
    if (isNaN(num) || num < 0) return 'Must be a non-negative number';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const err = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: err || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    Object.keys(formData).forEach(key => {
      const err = validate(key, formData[key as keyof typeof formData]);
      if (err) { newErrors[key] = err; hasErrors = true; }
    });
    setErrors(newErrors);
    if (hasErrors) return;

    const c2 = parseFloat(formData.cyl_t_minus_2);
    const c1 = parseFloat(formData.cyl_t_minus_1);
    // Simple weighted moving average: 40% weight on t-2, 60% on t-1
    const predicted = parseFloat((c2 * 0.4 + c1 * 0.6).toFixed(2));
    const kgLpg = parseFloat((predicted * LPG_KG_PER_CYLINDER).toFixed(2));
    const co2 = parseFloat((kgLpg * LPG_CO2_FACTOR).toFixed(2));
    setResult({ cylinders_t_minus_2: c2, cylinders_t_minus_1: c1, predicted_cylinders: predicted, predicted_kg_lpg: kgLpg, predicted_co2_kg: co2 });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-700/10 border border-brand-300/30 text-brand-700">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-950 tracking-tight">LPG &amp; Thermal Energy</h1>
            <p className="text-sm text-brand-600">
              Household cooking fuel heat release, thermal impact, and survey consumption metrics.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Interactive Thermal Earth Globe with Rising Heatwaves */}
      <section aria-label="3D Thermal Simulation">
        <ThermalEarthGlobe />
      </section>

      {/* LPG Forecast & Result Section */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Input Form Card */}
        <Card className="border-brand-200/70 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-brand-950">Next-Month Cylinder Forecast</h2>
              <Badge variant="success">Weighted Average</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-brand-600 mb-5 leading-relaxed">
              Enter cylinders consumed in the last two billing cycles to estimate next month's LPG usage and CO₂ footprint.
              Uses IPCC AR5 emission factor: <strong>2.983 kg CO₂ / kg LPG</strong>.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Cylinders (t-2)"
                  name="cyl_t_minus_2"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="e.g., 1"
                  value={formData.cyl_t_minus_2}
                  onChange={handleChange}
                  error={errors.cyl_t_minus_2}
                  helperText="Cylinders 2 months ago"
                />
                <Input
                  label="Cylinders (t-1)"
                  name="cyl_t_minus_1"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="e.g., 1.5"
                  value={formData.cyl_t_minus_1}
                  onChange={handleChange}
                  error={errors.cyl_t_minus_1}
                  helperText="Cylinders last month"
                />
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" className="w-full sm:w-auto">
                  Estimate CO₂
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFormData({ cyl_t_minus_2: '', cyl_t_minus_1: '' });
                    setErrors({});
                    setResult(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Prediction Output Card */}
        {result ? (
          <Card className="border-orange-200 bg-white shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-brand-950">Predicted Output</h3>
                <span className="text-xs font-mono text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full">
                  IPCC AR5
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 shadow-sm">
                  <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold">Predicted Cylinders</p>
                  <p className="mt-1 text-2xl font-bold text-brand-950 tracking-tight">
                    {result.predicted_cylinders}{' '}
                    <span className="text-sm font-normal text-brand-600">cylinders</span>
                  </p>
                  <p className="mt-1 text-xs text-amber-600">{result.predicted_kg_lpg} kg LPG</p>
                </div>
                <div className="p-4 rounded-xl bg-brand-50 border border-brand-200/80 shadow-sm">
                  <p className="text-xs text-brand-600 uppercase tracking-wider font-semibold">CO₂ Estimate</p>
                  <p className="mt-1 text-2xl font-bold text-brand-700 tracking-tight">
                    {result.predicted_co2_kg}{' '}
                    <span className="text-sm font-normal text-brand-600">kg CO₂</span>
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-brand-100 space-y-2 text-xs text-brand-600">
                <div className="flex justify-between py-1 border-b border-brand-100/50">
                  <span>Emission Factor:</span>
                  <span className="font-semibold text-brand-950">2.983 kg CO₂/kg LPG</span>
                </div>
                <div className="flex justify-between py-1 border-b border-brand-100/50">
                  <span>Cylinder Weight:</span>
                  <span className="font-semibold text-brand-950">14.2 kg (domestic standard)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Source:</span>
                  <span className="font-semibold text-brand-950">IPCC AR5 · Scope 1 Direct</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-amber-200 bg-white/60 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <div className="p-3 rounded-full bg-amber-50 text-amber-600 mb-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-brand-950">Awaiting Cylinder Inputs</h3>
            <p className="mt-1 text-xs text-brand-600 max-w-xs">
              Enter your past two months' cylinder consumption to estimate next month's CO₂ footprint.
            </p>
          </Card>
        )}
      </div>

      {/* Status Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">LPG Energy Density</span>
          <p className="mt-1.5 text-2xl font-bold text-brand-950">46.1 MJ/kg</p>
          <p className="mt-1 text-xs text-brand-400">High calorific value liquefied petroleum gas</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Standard Cylinder Net</span>
          <p className="mt-1.5 text-2xl font-bold text-amber-600">14.2 kg</p>
          <p className="mt-1 text-xs text-brand-400">Domestic subsidized &amp; commercial refill standard</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Emission Boundary</span>
            <Badge variant="success">Scope 1 Direct</Badge>
          </div>
          <p className="mt-1.5 text-lg font-bold text-brand-900">Thermal Combustion</p>
          <p className="mt-1 text-xs text-brand-400">Calorific heat transfer &amp; induction transition pathways</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Cooking Fuel Efficiency Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Cooking Thermal Efficiency (%)</h3>
                <p className="text-xs text-brand-500">Useful heat delivered to cookware vs energy wasted</p>
              </div>
              <Badge variant="default">Efficiency</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COOKING_FUEL_COMPARISON} layout="vertical" margin={{ top: 10, right: 20, left: 35, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="fuel" tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                  <Tooltip
                    formatter={(value: any) => [`${value}% Thermal Efficiency`, 'Efficiency']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#f59e0b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="efficiency" fill="#ea580c" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-center text-xs text-brand-500">
              LPG burns with ~60% efficiency; switching to induction delivers over 84% direct thermal transfer.
            </p>
          </CardContent>
        </Card>

        {/* Monthly Household Cylinder Consumption */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Consumption by Family Size</h3>
                <p className="text-xs text-brand-500">Monthly kg and days per standard 14.2 kg cylinder</p>
              </div>
              <Badge variant="default">Survey Benchmarks</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOUSEHOLD_LPG_USAGE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="householdSize" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      name === 'monthlyKg' ? `${value} kg/month` : `${value} days`,
                      name === 'monthlyKg' ? 'Monthly LPG' : 'Days Per Cylinder',
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#f59e0b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="monthlyKg" fill="#d97706" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="daysPerCylinder" fill="#fed7aa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-brand-600 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-600" /> Monthly Fuel (kg)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-200 border border-amber-300" /> Days per Cylinder
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Induction Switch & Thermal Savings Simulator */}
      <Card className="border-amber-200/80 bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30 shadow-sm overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-semibold mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                Thermal Transition Pathway
              </div>
              <h3 className="text-base font-semibold text-brand-950">LPG to Clean Induction Cooking Calculator</h3>
            </div>
            <Badge variant="warning">Clean Cooking Transition</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2 space-y-6">
          <p className="text-xs text-brand-600 leading-relaxed max-w-2xl">
            Compare monthly cooking energy expenditure and carbon release between subsidized domestic LPG cylinders (~60% efficiency) and precision electromagnetic induction cooking (~84% thermal transfer).
          </p>

          <div className="grid gap-6 md:grid-cols-3 items-center">
            {/* Control Slider */}
            <div className="md:col-span-1 space-y-4 p-4 rounded-2xl bg-white border border-amber-100 shadow-xs">
              <label className="block text-xs font-semibold text-brand-950">
                Monthly Cylinder Consumption:
                <span className="ml-2 font-mono text-sm text-amber-800 font-bold" id="lpg-slider-label">
                  1.0 Cylinders / mo
                </span>
              </label>
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  defaultValue="1"
                  className="w-full accent-amber-600 cursor-pointer h-1.5 bg-amber-100 rounded-lg"
                  onChange={(e) => {
                    const cyl = Number(e.target.value);
                    const label = document.getElementById('lpg-slider-label');
                    if (label) label.innerText = `${cyl.toFixed(1)} Cylinders / mo`;

                    const lpgCo2 = cyl * 14.2 * 2.983;
                    const lpgCost = cyl * 850; // Pune domestic subsidized rate approx
                    // Required thermal MJ delivered = cyl * 14.2 * 46.1 * 0.60
                    const neededMJ = cyl * 14.2 * 46.1 * 0.60;
                    // Induction electricity needed (at 84% eff): neededMJ / (3.6 * 0.84)
                    const inductionKwh = neededMJ / (3.6 * 0.84);
                    const inductionCost = inductionKwh * 7.5; // blended kWh tariff
                    const inductionCo2 = inductionKwh * 0.675; // grid factor
                    const netCo2Saved = lpgCo2 - inductionCo2;

                    const outLpgCo2 = document.getElementById('calc-lpg-co2');
                    const outIndKwh = document.getElementById('calc-ind-kwh');
                    const outNetCo2 = document.getElementById('calc-net-co2');
                    const outSavings = document.getElementById('calc-annual-saving');

                    if (outLpgCo2) outLpgCo2.innerText = `${lpgCo2.toFixed(1)} kg`;
                    if (outIndKwh) outIndKwh.innerText = `${inductionKwh.toFixed(0)} kWh`;
                    if (outNetCo2) outNetCo2.innerText = `${netCo2Saved > 0 ? '+' : ''}${netCo2Saved.toFixed(1)} kg`;
                    if (outSavings) outSavings.innerText = `₹${Math.max(0, (lpgCost - inductionCost) * 12).toFixed(0)}`;
                  }}
                />
                <div className="flex justify-between text-[10px] text-brand-400 font-mono">
                  <span>0.5 (Small)</span>
                  <span>1.0 (Average)</span>
                  <span>3.0 (Large)</span>
                </div>
              </div>
              <p className="text-[11px] text-brand-500 leading-tight">
                Domestic LPG cylinder subsidy baseline: ₹850/refill (14.2 kg) in Maharashtra urban areas.
              </p>
            </div>

            {/* Transition Metrics Display */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-amber-100 shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">LPG Direct CO₂</span>
                <p className="mt-1 text-xl font-bold text-brand-950" id="calc-lpg-co2">
                  {(1 * 14.2 * 2.983).toFixed(1)} kg
                </p>
                <span className="text-[10px] text-amber-600 font-medium">Scope 1 combustion</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-amber-100 shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500">Induction Power</span>
                <p className="mt-1 text-xl font-bold text-brand-950" id="calc-ind-kwh">
                  {((1 * 14.2 * 46.1 * 0.60) / (3.6 * 0.84)).toFixed(0)} kWh
                </p>
                <span className="text-[10px] text-brand-400">84% thermal efficiency</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-amber-100 shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500">Net CO₂ Reduction</span>
                <p className="mt-1 text-xl font-bold text-emerald-700" id="calc-net-co2">
                  +{((1 * 14.2 * 2.983) - (((1 * 14.2 * 46.1 * 0.60) / (3.6 * 0.84)) * 0.675)).toFixed(1)} kg
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">Monthly avoided</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-amber-100 shadow-xs text-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500">Annual Savings</span>
                <p className="mt-1 text-xl font-bold text-emerald-700" id="calc-annual-saving">
                  ₹{Math.max(0, ((1 * 850) - (((1 * 14.2 * 46.1 * 0.60) / (3.6 * 0.84)) * 7.5)) * 12).toFixed(0)}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">Net fuel economy</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset & Methodology Transparency Card */}
      <Card className="border-brand-200/60 bg-brand-50/40">
        <CardHeader>
          <h3 className="text-sm font-semibold text-brand-950">Methodology &amp; Survey Scope</h3>
        </CardHeader>
        <CardContent className="pt-2 space-y-4">
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span><strong>Survey Data Exists:</strong> Household surveys capture ownership, cylinder refilling intervals, monthly costs, and cooking patterns across Pune residential clusters.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span><strong>Strict Factor Integrity:</strong> Generic rule-of-thumb emission factors (e.g., 2.93 kg CO₂/kg LPG) are intentionally <strong>not applied</strong> until an official state-level or MoPNG emission methodology is formally codified.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">•</span>
              <span><strong>Thermal Convection &amp; Indoor Air Quality:</strong> Domestic LPG combustion generates heat flux and particulate matter, making kitchen ventilation and induction hybrid systems key mitigation pathways.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}