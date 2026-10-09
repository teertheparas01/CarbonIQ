import { useState, useEffect, useCallback } from 'react';
import { healthCheck } from '../api';
import type { ConnectionStatus, HealthResponse } from '../types/api';

interface UseHealthReturn {
  status: ConnectionStatus;
  health: HealthResponse | null;
  checkHealth: () => Promise<void>;
}

export function useHealth(): UseHealthReturn {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [health, setHealth] = useState<HealthResponse | null>(null);

  const checkHealth = useCallback(async () => {
    setStatus('checking');
    try {
      const data = await healthCheck();
      setHealth(data);
      setStatus('connected');
    } catch {
      setHealth(null);
      setStatus('unavailable');
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return { status, health, checkHealth };
}