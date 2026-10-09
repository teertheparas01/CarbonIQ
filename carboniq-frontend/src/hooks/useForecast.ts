import { useState, useCallback } from 'react';
import { predictElectricity } from '../api';
import type { PredictRequest, PredictResponse } from '../types/api';

interface UseForecastReturn {
  predict: (payload: PredictRequest) => Promise<PredictResponse | null>;
  loading: boolean;
  error: string | null;
  lastResult: PredictResponse | null;
  clearError: () => void;
}

export function useForecast(): UseForecastReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<PredictResponse | null>(null);

  const predict = useCallback(async (payload: PredictRequest): Promise<PredictResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await predictElectricity(payload);
      setLastResult(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Prediction failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { predict, loading, error, lastResult, clearError };
}