'use client';

import { Card, CardContent, CardHeader } from '../components/ui';
import { Badge } from '../components/ui';
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

export function LPG() {
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