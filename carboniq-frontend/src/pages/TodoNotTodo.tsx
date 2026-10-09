import { Card, CardContent } from '../components/ui';
import { Badge } from '../components/ui';

const TODO_ITEMS = [
  'Use the electricity forecast to plan high-consumption activities',
  'Compare actual bills with forecasts to improve awareness',
  'Track monthly electricity consumption consistently',
  'Consider energy-efficient appliances for high-consumption households',
  'Monitor seasonal patterns (higher consumption in summer/monsoon)',
];

const NOT_TODO_ITEMS = [
  'Do not assume the forecast is exact — R² = 0.1689 indicates modest accuracy',
  'Do not use the model for commercial or regulatory decisions',
  'Do not apply the electricity emission factor (0.675 kg CO₂/kWh) to LPG, water, or food',
  'Do not calculate transport CO₂ from vehicle ownership alone',
  'Do not extrapolate forecasts beyond the next month',
  'Do not ignore the emission factor reporting period (FY 2025-26) vs. historical data (2018–2020)',
];

export function TodoNotTodo() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-medium text-brand-950">To'Do & Not-To-Do</h2>
        <p className="mt-1 text-sm text-brand-500">
          Actionable guidance and important limitations for using CarbonIQ responsibly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="success">To'Do</Badge>
              <h3 className="text-sm font-medium text-brand-950">Recommended Actions</h3>
            </div>
            <ul className="space-y-3" role="list">
              {TODO_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-brand-600">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-medium">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200/50 bg-red-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="warning">Not-To-Do</Badge>
              <h3 className="text-sm font-medium text-red-800">Actions to Avoid</h3>
            </div>
            <ul className="space-y-3" role="list">
              {NOT_TODO_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-red-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-medium">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-brand-200/50 bg-brand-100/30">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-brand-950 mb-3">Key Reminders</h3>
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span><strong>Model predicts electricity, not carbon.</strong> CO₂ is derived deterministically from predicted kWh.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span><strong>Emission factor:</strong> 0.675 kg CO₂/kWh (CEA v22.0, FY 2025-26).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span><strong>Training data:</strong> Jan 2018 – Feb 2020. Test period: Nov 2019 – Feb 2020.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span><strong>Metrics:</strong> MAE = 32.12 kWh, RMSE = 186.39 kWh, R² = 0.1689.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}