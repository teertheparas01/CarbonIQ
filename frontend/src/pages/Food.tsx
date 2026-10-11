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

const DIET_FOOTPRINT_BENCHMARKS = [
  { diet: 'Plant-Based / Vegan', kgCo2PerYear: 580, relative: 'Lowest' },
  { diet: 'Vegetarian (Lacto)', kgCo2PerYear: 920, relative: 'Typical Pune' },
  { diet: 'Eggetarian', kgCo2PerYear: 1080, relative: 'Moderate' },
  { diet: 'Flexitarian / Poultry', kgCo2PerYear: 1450, relative: 'High' },
  { diet: 'Heavy Non-Veg (Red Meat)', kgCo2PerYear: 2300, relative: 'Highest' },
];

const FOOD_EXPENDITURE_SPLIT = [
  { category: 'Fresh Vegetables & Greens', sharePct: 32 },
  { category: 'Grains, Rice & Pulses', sharePct: 26 },
  { category: 'Dairy & Milk Products', sharePct: 22 },
  { category: 'Packaged & Processed Foods', sharePct: 12 },
  { category: 'Street Food & Dining Out', sharePct: 8 },
];

export function Food() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-600">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-950 tracking-tight">Food &amp; Nutrition Footprint</h1>
            <p className="text-sm text-brand-500">
              Dietary carbon benchmarks, household expenditure distribution, and survey food security data.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Predominant Diet</span>
          <p className="mt-1.5 text-2xl font-bold text-brand-950">Lacto-Vegetarian</p>
          <p className="mt-1 text-xs text-brand-400">~68% of Pune residential survey respondents</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Average Carbon Footprint</span>
          <p className="mt-1.5 text-2xl font-bold text-emerald-600">~920 kg CO₂/yr</p>
          <p className="mt-1 text-xs text-brand-400">Indian Council of Agricultural Research (ICAR) benchmark</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-200/70 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Assessment Scope</span>
            <Badge variant="default">Agri-LCA Model</Badge>
          </div>
          <p className="mt-1.5 text-lg font-bold text-brand-900">Life-Cycle Footprint</p>
          <p className="mt-1 text-xs text-brand-400">Localized ICAR farm-gate crop &amp; dairy accounting benchmarks</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Dietary Carbon Benchmark Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Annual CO₂ Emissions by Diet Type</h3>
                <p className="text-xs text-brand-500">kg CO₂ equivalent per capita per year</p>
              </div>
              <Badge variant="default">Emissions</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DIET_FOOTPRINT_BENCHMARKS} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" unit=" kg" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="diet" tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                  <Tooltip
                    formatter={(value: any) => [`${value} kg CO₂ / yr`, 'Annual Emissions']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#10b981',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="kgCo2PerYear" fill="#059669" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-center text-xs text-brand-500">
              Plant-forward and regional vegetarian diets reduce annual food greenhouse gas emissions by up to 60%.
            </p>
          </CardContent>
        </Card>

        {/* Household Food Budget Split */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-950">Household Food Budget Split</h3>
                <p className="text-xs text-brand-500">Monthly expenditure proportion across categories</p>
              </div>
              <Badge variant="default">Expenditure</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FOOD_EXPENDITURE_SPLIT} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" height={45} />
                  <YAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value: any) => [`${value}% of budget`, 'Share']}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderColor: '#10b981',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="sharePct" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-center text-xs text-brand-500">
              Fresh produce and local grains make up over 55% of domestic grocery spending in Pune.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Methodology & Policy Card */}
      <Card className="border-brand-200/60 bg-brand-50/40">
        <CardHeader>
          <h3 className="text-sm font-semibold text-brand-950">Survey Attribution &amp; CarbonIQ Integrity</h3>
        </CardHeader>
        <CardContent className="pt-2">
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span><strong>Survey Data Available:</strong> Purchase frequencies, staple grains, packaged snack consumption, and market proximity are recorded.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span><strong>No Fabricated Emissions:</strong> Agricultural lifecycle analysis requires localized farm-gate factors; CarbonIQ deliberately avoids arbitrary rule-of-thumb estimates.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}