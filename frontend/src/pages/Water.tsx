import { Card, CardContent } from '../components/ui';
import { Badge } from '../components/ui';

export function Water() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-medium text-brand-950">Water</h2>
        <p className="mt-1 text-sm text-brand-500">
          Water consumption and source data from the household survey.
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
              <span>Water source, storage, consumption, and payment data exists in the survey dataset.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>No verified CarbonIQ CO₂ emission calculation for water has been implemented yet.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Rule-of-thumb emission factors (e.g., 0.344 kg CO₂/m³) are NOT used in this project unless explicitly verified and documented.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Future work may add water carbon estimation with proper source attribution.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-brand-200/50 bg-brand-100/30">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-brand-950 mb-3">Available Survey Data</h3>
          <p className="text-sm text-brand-600">
            The dataset includes: water sources (piped, tanker, well, etc.), storage, pumping, consumption by use (shower, toilet, laundry, etc.), payment, and scarcity information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}