import { Card, CardContent } from '../components/ui';
import { Badge } from '../components/ui';

export function Food() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-medium text-brand-950">Food</h2>
        <p className="mt-1 text-sm text-brand-500">
          Food purchase, consumption, and vulnerability data from the household survey.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-brand-500">CO₂ Calculation Status</p>
          <p className="mt-0.5 text-lg font-medium text-brand-950">Not Available</p>
        </div>
        <Badge variant="warning">Unsupported</Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-brand-950 mb-4">Current Status</h3>
          <ul className="space-y-2 text-sm text-brand-600">
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Food purchase (street food, packaged, vegetables, fruits, etc.), frequency, budget, and vulnerability data exists in the survey dataset.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>No verified CarbonIQ CO₂ emission calculation for food has been implemented yet.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Food carbon footprints vary significantly by diet, source, and preparation. Generic factors are not applied without verification.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Future work may add food carbon estimation with proper source attribution.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-brand-200/50 bg-brand-100/30">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-brand-950 mb-3">Available Survey Data</h3>
          <p className="text-sm text-brand-600">
            The dataset includes: food purchase by category (street food, packaged, vegetables, fruits, protein, etc.), frequency, budget, local sourcing, and food vulnerability indicators.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}