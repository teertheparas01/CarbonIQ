export interface PredictRequest {
  electricity_t_minus_2: number;
  electricity_t_minus_1: number;
  target_month_num: number;
}

export interface ModelMetrics {
  MAE_kWh: number;
  RMSE_kWh: number;
  R2: number;
}

export interface PredictResponse {
  predicted_electricity_kwh: number;
  predicted_co2_kg: number;
  emission_factor_kg_co2_per_kwh: number;
  factor_source: string;
  factor_version: string;
  reporting_period: string;
  gas: string;
  model_name: string;
  model_metrics: ModelMetrics;
  limitations: string[];
}

export interface HealthResponse {
  status: 'ok';
  model_loaded: boolean;
  model_name: string;
}

export type ConnectionStatus = 'checking' | 'connected' | 'unavailable';