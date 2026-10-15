'use client';

import { Card, CardContent, CardHeader } from '../components/ui';
import { Badge } from '../components/ui';
import { motion, useReducedMotion } from 'motion/react';
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

function EVvsICAnimation() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl" style={{ minHeight: 260 }}>
      {/* Sky gradient top */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-sky-900/40 to-transparent pointer-events-none" />

      {/* Road */}
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-b from-slate-600 to-slate-700 border-t-2 border-slate-500">
        {/* Road dashes */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 flex items-center gap-6 px-4 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="h-0.5 w-12 bg-yellow-300/50 flex-shrink-0 rounded"
              animate={reduce ? {} : { x: ['0%', '-100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* ── EV Lane (top) ── */}
      <div className="absolute left-0 right-0" style={{ top: '8%', height: '38%' }}>
        {/* Label */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/40">EV</span>
          <span className="text-xs text-emerald-300 font-medium">34 g CO₂/km</span>
        </div>

        {/* EV Car SVG — moves right across the lane */}
        <motion.div
          className="absolute"
          style={{ top: '15%', left: 0 }}
          animate={reduce ? {} : { x: ['8%', '72%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94], repeatType: 'reverse' }}
        >
          <svg width="80" height="38" viewBox="0 0 80 38" fill="none">
            {/* Body */}
            <rect x="6" y="14" width="60" height="18" rx="5" fill="#22c55e" />
            {/* Roof */}
            <path d="M18 14 Q22 4 42 4 Q58 4 62 14Z" fill="#16a34a" />
            {/* Windows */}
            <rect x="20" y="6" width="16" height="9" rx="2" fill="#bae6fd" opacity="0.9" />
            <rect x="40" y="6" width="16" height="9" rx="2" fill="#bae6fd" opacity="0.9" />
            {/* Wheels */}
            <circle cx="18" cy="32" r="6" fill="#1e293b" />
            <circle cx="18" cy="32" r="3" fill="#64748b" />
            <circle cx="56" cy="32" r="6" fill="#1e293b" />
            <circle cx="56" cy="32" r="3" fill="#64748b" />
            {/* EV badge */}
            <rect x="28" y="18" width="18" height="8" rx="2" fill="#15803d" />
            <text x="37" y="25" textAnchor="middle" fontSize="6" fill="#bbf7d0" fontWeight="bold">EV</text>
            {/* Lightning bolt */}
            <polygon points="70,12 66,21 70,21 65,30 70,21 66,21" fill="#facc15" opacity="0.9" />
          </svg>
          {/* Clean air particles */}
          {!reduce && [0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/60"
              style={{ right: -8 - i * 6, top: 16 + i * 4 }}
              animate={{ x: [0, -20], opacity: [0.8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.25, ease: 'easeOut' }}
            />
          ))}
        </motion.div>

        {/* EV trail — green glow */}
        <motion.div
          className="absolute h-1 rounded-full bg-gradient-to-r from-emerald-500/0 to-emerald-400/50"
          style={{ top: '45%', left: '10%', width: '55%' }}
          animate={reduce ? {} : { opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* ── IC Engine Lane (bottom) ── */}
      <div className="absolute left-0 right-0" style={{ top: '46%', height: '22%' }}>
        {/* Label */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          <span className="text-xs font-bold text-red-400 bg-red-900/60 px-2 py-0.5 rounded-full border border-red-500/40">IC</span>
          <span className="text-xs text-red-300 font-medium">182 g CO₂/km</span>
        </div>

        {/* IC Car SVG — moves right more slowly */}
        <motion.div
          className="absolute"
          style={{ top: '5%', left: 0 }}
          animate={reduce ? {} : { x: ['8%', '48%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94], repeatType: 'reverse' }}
        >
          <svg width="76" height="34" viewBox="0 0 76 34" fill="none">
            {/* Body */}
            <rect x="4" y="12" width="58" height="16" rx="4" fill="#ef4444" />
            {/* Roof */}
            <path d="M14 12 Q18 4 36 4 Q52 4 56 12Z" fill="#dc2626" />
            {/* Windows */}
            <rect x="16" y="5" width="14" height="8" rx="2" fill="#fca5a5" opacity="0.5" />
            <rect x="34" y="5" width="14" height="8" rx="2" fill="#fca5a5" opacity="0.5" />
            {/* Wheels */}
            <circle cx="16" cy="28" r="6" fill="#1e293b" />
            <circle cx="16" cy="28" r="3" fill="#64748b" />
            <circle cx="52" cy="28" r="6" fill="#1e293b" />
            <circle cx="52" cy="28" r="3" fill="#64748b" />
            {/* Exhaust pipe */}
            <rect x="0" y="20" width="6" height="3" rx="1" fill="#78716c" />
          </svg>
          {/* Exhaust smoke puffs */}
          {!reduce && [0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-slate-400/40 border border-slate-500/20"
              style={{ width: 10 + i * 4, height: 10 + i * 4, right: 8 + i * 12, top: 16 - i * 2 }}
              animate={{ x: [0, -30 - i * 10], opacity: [0.6, 0], scale: [0.8, 1.6] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
            />
          ))}
        </motion.div>
      </div>

      {/* Comparison badge */}
      <div className="absolute top-3 right-4 flex flex-col items-end gap-1">
        <span className="text-xs font-bold text-white bg-emerald-600/80 px-2.5 py-1 rounded-full shadow">EV is 5.4× cleaner</span>
        <span className="text-xs text-slate-400">per passenger-km vs solo petrol car</span>
      </div>
    </div>
  );
}

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

      {/* EV vs IC Engine Animation */}
      <section aria-label="EV vs IC Engine Comparison">
        <EVvsICAnimation />
      </section>

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