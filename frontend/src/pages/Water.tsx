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

const WATER_SOURCE_BREAKDOWN = [
  { source: 'Municipal Supply (PMC/PCMC)', share: 64, reliability: 'High' },
  { source: 'Borewell / Groundwater', share: 22, reliability: 'Medium' },
  { source: 'Private Water Tankers', share: 11, reliability: 'Variable' },
  { source: 'Rainwater Harvesting', share: 3, reliability: 'Seasonal' },
];

const WATER_END_USE = [
  { activity: 'Bathing & Shower', dailyLitres: 55, pct: 40 },
  { activity: 'Toilet Flushing', dailyLitres: 30, pct: 22 },
  { activity: 'Washing Clothes & Dishes', dailyLitres: 28, pct: 20 },
  { activity: 'Cooking & Drinking', dailyLitres: 12, pct: 9 },
  { activity: 'Gardening & Cleaning', dailyLitres: 12, pct: 9 },
];

export function Water() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-700/10 border border-brand-300/30 text-brand-700">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-950 tracking-tight">Water Footprint &amp; Supply</h1>
            <p className="text-sm text-brand-600">
              Household water source distribution, consumption end-use, and conservation metrics.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Average Daily Consumption</span>
          <p className="mt-1.5 text-2xl font-bold text-brand-950">137 L / person</p>
          <p className="mt-1 text-xs text-brand-500">Urban Pune domestic benchmark (BIS standard 135 L)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Primary Municipal Grid</span>
          <p className="mt-1.5 text-2xl font-bold text-brand-700">64% Supply</p>
          <p className="mt-1 text-xs text-brand-500">Piped municipal grid from Khadakwasla complex</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Embedded Energy</span>
            <Badge variant="default">Pumping &amp; Treatment</Badge>
          </div>
          <p className="mt-1.5 text-lg font-bold text-brand-900">Hydro-Power Diagnostics</p>
          <p className="mt-1 text-xs text-brand-500">~0.34 kg CO₂/m³ lifecycle pumping intensity benchmark</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Water Source Chart */}
        <Card className="bg-white border-brand-200/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Water Sources in Pune</h3>
                <p className="text-xs text-brand-600">Residential household primary supply breakdown</p>
              </div>
              <Badge variant="default">Distribution</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WATER_SOURCE_BREAKDOWN} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#5D7A6B' }} />
                  <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: '#5D7A6B' }} width={120} />
                  <Tooltip
                    formatter={(value: any) => [`${value}% of households`, 'Supply Share']}
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
              Tanker water reliance surges up to 30% in eastern &amp; western suburban Pune during summer.
            </p>
          </CardContent>
        </Card>

        {/* End-Use Breakdown Chart */}
        <Card className="bg-white border-brand-200/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Household Water End-Use</h3>
                <p className="text-xs text-brand-600">Daily liters per capita distribution</p>
              </div>
              <Badge variant="default">End-Use</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WATER_END_USE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="activity" tick={{ fontSize: 10, fill: '#5D7A6B' }} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis tick={{ fontSize: 11, fill: '#5D7A6B' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} Litres / day`, 'Consumption']}
                    contentStyle={{
                      backgroundColor: '#051F20',
                      borderColor: '#8EB69B',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="dailyLitres" fill="#8EB69B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-center text-xs text-brand-500">
              Bathing and sanitation consume over 60% of daily indoor household water.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dataset & Methodology Card */}
      <Card className="border-brand-200/60 bg-brand-50/40">
        <CardHeader>
          <h3 className="text-sm font-semibold text-brand-950">Survey Attribution &amp; CarbonIQ Policy</h3>
        </CardHeader>
        <CardContent className="pt-2">
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold mt-0.5">•</span>
              <span><strong>Survey Data Collected:</strong> Storage type, municipal piped frequency, tanker costs, and payment mechanisms are recorded in the 5,347 household dataset.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold mt-0.5">•</span>
              <span><strong>No Fabricated Carbon Claims:</strong> Because electricity pumping and water treatment factors vary widely between municipal dams and groundwater borewells, CarbonIQ does not fabricate a synthetic CO₂ number.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}