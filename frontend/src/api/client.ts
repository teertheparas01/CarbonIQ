import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { PredictRequest, PredictResponse, HealthResponse } from '../types/api';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') || '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('[API Error]', error.message);
    return Promise.reject(error);
  }
);

export async function healthCheck(): Promise<HealthResponse> {
  const { data } = await api.get<HealthResponse>('/health');
  return data;
}

export async function predictElectricity(payload: PredictRequest): Promise<PredictResponse> {
  const { data } = await api.post<PredictResponse>('/predict', payload);
  return data;
}

export { api };