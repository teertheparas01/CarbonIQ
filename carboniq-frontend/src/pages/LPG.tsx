import { Card, CardContent } from '../components/ui';
import { Badge } from '../components/ui';

export function LPG() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-medium text-brand-950">LPG</h2>
        <p className="mt-1 text-sm text-brand-500">
          LPG consumption data from the household survey.
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
              <span>LPG consumption and purchase data exists in the survey dataset.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>No verified CarbonIQ CO₂ emission calculation for LPG has been implemented yet.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Rule-of-thumb emission factors (e.g., 2.93 kg CO₂/kg LPG) are NOT used in this project unless explicitly verified and documented.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-300 mt-0.5">•</span>
              <span>Future work may add LPG carbon estimation with proper source attribution.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-brand-200/50 bg-brand-100/30">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-brand-950 mb-3">Available Survey Data</h3>
          <p className="text-sm text-brand-600">
            The dataset includes: LPG ownership, purchase frequency, cylinder costs, consumption, weeks per cylinder, purpose, and live usage.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}