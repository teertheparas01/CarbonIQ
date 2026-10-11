'use client';

import { Card, CardContent, CardHeader } from '../components/ui';
import { Badge } from '../components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const TRANSPORT_MODE_EMISSIONS = [
  { mode: 'Walking / Cycling', gCo2PerKm: 0, category: 'Zero Emission' },
  { mode: 'Pune Metro / Electric Bus', gCo2PerKm: 28, category: 'Mass Transit' },
  { mode: 'Electric 2-Wheeler (EV)', gCo2PerKm: 34, category: 'EV Mobility' },
  { mode: 'Petrol Motorcycle / Scooter', gCo2PerKm: 78, category: 'Fossil Fuel' },
  { mode: 'Shared Auto-Rickshaw (CNG)', gCo2PerKm: 85, category: 'Intermediate' },
  { mode: 'Private Petrol Car (Solo)', gCo2PerKm: 182, category: 'High Emission' },
];

const PUNE_VEHICLE_OWNERSHIP = [
  { type: 'Two-Wheeler (Scooter/Bike)', pct: 74 },
  { type: 'Bicycle / Cycle', pct: 36 },
  { type: 'Four-Wheeler (Car/SUV)', pct: 21 },
  { type: 'Commercial / Auto', pct: 5 },
];

export function Transport() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-700/10 border border-brand-300/30 text-brand-700">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-950 tracking-tight">Urban Mobility &amp; Transport</h1>
            <p className="text-sm text-brand-600">
              Vehicle fleet distribution, transit emission intensities (g CO₂/km), and survey ownership insights.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Two-Wheeler Penetration</span>
          <p className="mt-1.5 text-2xl font-bold text-brand-950">74% of Households</p>
          <p className="mt-1 text-xs text-brand-500">Pune holds one of India&apos;s highest 2W-per-capita ratios</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Public Transit Efficiency</span>
          <p className="mt-1.5 text-2xl font-bold text-brand-700">28 g CO₂ / pass-km</p>
          <p className="mt-1 text-xs text-brand-500">PMPML e-Buses &amp; Pune Metro operational factor</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Mobility Analytics</span>
            <Badge variant="default">Modal Split</Badge>
          </div>
          <p className="mt-1.5 text-lg font-bold text-brand-900">Fleet Diagnostics</p>
          <p className="mt-1 text-xs text-brand-500">Standardized grams CO₂ per passenger-km across urban transit</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Transit Emission Intensity Chart */}
        <Card className="bg-white border-brand-200/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Emissions by Transport Mode</h3>
                <p className="text-xs text-brand-600">Grams of CO₂ per passenger-kilometer (g/p-km)</p>
              </div>
              <Badge variant="default">Lifecycle Intensity</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TRANSPORT_MODE_EMISSIONS} layout="vertical" margin={{ top: 10, right: 20, left: 35, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" unit=" g" tick={{ fontSize: 11, fill: '#5D7A6B' }} />
                  <YAxis type="category" dataKey="mode" tick={{ fontSize: 11, fill: '#5D7A6B' }} width={135} />
                  <Tooltip
                    formatter={(value: any) => [`${value} g CO₂ / pass-km`, 'Intensity']}
                    contentStyle={{
                      backgroundColor: '#051F20',
                      borderColor: '#8EB69B',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="gCo2PerKm" fill="#235347" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-center text-xs text-brand-600">
              Metro and electric public transit emit up to 85% less carbon per passenger than private petrol cars.
            </p>
          </CardContent>
        </Card>

        {/* Pune Household Vehicle Ownership */}
        <Card className="bg-white border-brand-200/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Vehicle Ownership Breakdown</h3>
                <p className="text-xs text-brand-600">Survey proportion of households possessing vehicles</p>
              </div>
              <Badge variant="default">Ownership</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PUNE_VEHICLE_OWNERSHIP} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#5D7A6B' }} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#5D7A6B' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value}% of households`, 'Ownership']}
                    contentStyle={{
                      backgroundColor: '#051F20',
                      borderColor: '#8EB69B',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="pct" fill="#8EB69B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-center text-xs text-brand-500">
              Over 70% of respondents rely on motorized two-wheelers for daily primary commuting.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Methodology & Safety Warning Card */}
      <Card className="border-brand-200/60 bg-brand-50/40">
        <CardHeader>
          <h3 className="text-sm font-semibold text-brand-950">Attribution &amp; Integrity Standards</h3>
        </CardHeader>
        <CardContent className="pt-2 space-y-3">
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-violet-500 font-bold mt-0.5">•</span>
              <span><strong>Ownership ≠ Travel Distance:</strong> The survey records whether a household owns a motorbike, auto, or car, but does not monitor daily kilometers driven or fuel receipts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500 font-bold mt-0.5">•</span>
              <span><strong>No Fabricated Commute Numbers:</strong> CarbonIQ strictly prevents calculating carbon numbers based on vehicle possession alone without measured odometer readings.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}