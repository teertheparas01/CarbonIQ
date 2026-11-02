import { useHealth } from '../hooks';
import { Card, CardContent, CardHeader } from '../components/ui';
import { Badge, Button } from '../components/ui';
import { API_BASE_URL } from '../api';

export function Settings() {
  const { health, checkHealth } = useHealth();

  return (
    <div className="animate-fade-in space-y-8 max-w-3xl">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-header-title">Settings</h1>
        <p className="page-header-subtitle">
          View model configuration, emission factor, and system information.
        </p>
      </header>

      {/* Backend Connection */}
      <Card>
        <CardHeader>
          <h3 className="text-sm font-medium text-brand-950">Backend Connection</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-brand-100/30 border border-brand-200/50">
            <div>
              <p className="text-sm text-brand-500">Status</p>
              <p className="mt-0.5 font-medium text-brand-950 capitalize">{health ? 'connected' : 'unavailable'}</p>
            </div>
            <Badge variant={health ? 'success' : 'warning'} size="sm">
              {health ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-brand-100/30 border border-brand-200/50">
            <div>
              <p className="text-sm text-brand-500">Model</p>
              <p className="mt-0.5 font-medium text-brand-950">{health?.model_name || '—'}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={checkHealth}>
              Refresh
            </Button>
          </div>
          {health && (
            <div className="p-4 rounded-lg bg-brand-100/30 border border-brand-200/50">
              <p className="text-sm text-brand-500">API Base URL</p>
              <p className="mt-0.5 font-mono text-sm text-brand-950">{API_BASE_URL}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Centralized About & Technical Specifications Link */}
      <Card glass className="border border-brand-200/70 bg-gradient-to-br from-white/90 to-emerald-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-950">Technical Specifications &amp; Architecture</h2>
            <Badge variant="success" size="sm">Centralized</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2 space-y-4">
          <p className="text-sm text-brand-600 leading-relaxed">
            All detailed specifications—including the machine learning model architecture, training protocols, empirical metrics (MAE, RMSE, R²), full technology stack, and CEA baseline emission factors—are unified under one roof in the <strong>About</strong> section.
          </p>
          <div className="pt-2">
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-brand-700 text-white hover:bg-brand-800 transition-colors shadow-xs"
            >
              <span>Explore About CarbonIQ</span>
              <span>↗</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}