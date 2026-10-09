import { Card, CardContent } from '../components/ui';
import { Badge } from '../components/ui';

export function Transport() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-medium text-brand-950">Transport</h2>
        <p className="mt-1 text-sm text-brand-500">
          Vehicle ownership data from the household survey.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-500">CO₂ Calculation Status</p>
          <p className="mt-0.5 text-lg font-medium text-brand-950">Not Available</p>
        </div>
        <Badge variant="warning">Unsupported</Badge>
      </div>

      <Card className="border-red-200/50 bg-red-50/30">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-red-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Important: Transport CO₂ Is Not Calculated
          </h3>
          <ul className="space-y-2 text-sm text-red-700">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span><strong>Vehicle ownership ≠ travel distance or fuel use.</strong> The survey records whether a household owns a motorbike, auto-rickshaw, or car, but not how far they travel or how much fuel they consume.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span>Inferring emissions from ownership alone would be speculative and misleading.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span>CarbonIQ will never fabricate transport emissions from insufficient data.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span>If transport CO₂ is added in the future, it will require verified travel-distance or fuel-consumption data with proper source attribution.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-brand-950 mb-4">Available Survey Data</h3>
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Vehicle ownership: motorbike, auto-rickshaw, car (count per household)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>No distance travelled, fuel type, fuel consumption, or mileage data.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-brand-200/50 bg-brand-100/30">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-brand-950 mb-3">Principle</h3>
          <p className="text-sm text-brand-600">
            CarbonIQ only calculates emissions when sufficient, verified input data exists. Ownership data alone is insufficient for transport emissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}