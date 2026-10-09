# CarbonIQ Frontend Implementation Plan

---

## 1. Current Repository State

| Aspect | Status |
|--------|--------|
| Frontend | **Does not exist** — no `package.json`, no `src/`, no React/Vite setup |
| Backend | Exists as `CarbonIQ_Backend_Package/` with FastAPI app |
| ML Notebook | `CarbonIQ_ML_Clean.ipynb` — cleaned, reproducible pipeline |
| Data | Original CSV not in repo (expected at `/content/Pune_HHLD_Survey_Data_v2-0-0.csv` in Colab) |
| Tests | Backend smoke tests in notebook (cell 80); no frontend tests |

**Root directory contents:**
```
CarbonIQ_Backend_Package/     # FastAPI backend + model artifacts
CarbonIQ_Backend_Package.zip  # Packaged backend
CarbonIQ_ML_Clean.ipynb       # Cleaned ML notebook
CHANGE_REPORT.md              # Notebook cleanup report
```

---

## 2. Existing Frontend Architecture

**None.** This is a greenfield frontend implementation.

---

## 3. Existing Backend / API Integration

### Base URL (dev)
```
http://127.0.0.1:8000
```

### CORS
Configured for `http://localhost:5173` and `http://127.0.0.1:5173` (Vite default).

### Endpoints

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/health` | — | `{ status, model_loaded, model_name }` |
| POST | `/predict` | `{ electricity_t_minus_2, electricity_t_minus_1, target_month_num }` | See below |

### POST /predict — Request
```ts
interface PredictRequest {
  electricity_t_minus_2: number;  // >= 0
  electricity_t_minus_1: number;  // >= 0
  target_month_num: number;       // 1–12
}
```

### POST /predict — Response
```ts
interface PredictResponse {
  predicted_electricity_kwh: number;           // rounded to 2 decimals
  predicted_co2_kg: number;                    // rounded to 3 decimals
  emission_factor_kg_co2_per_kwh: number;      // 0.675
  factor_source: string;                       // "Central Electricity Authority (CEA)"
  factor_version: string;                      // "22.0"
  reporting_period: string;                    // "FY 2025-26"
  gas: string;                                 // "CO2"
  model_name: string;                          // "Seasonal Gradient Boosting"
  model_metrics: { MAE_kWh, RMSE_kWh, R2 };    // from metadata
  limitations: string[];
}
```

### Verified Example
```json
Input:  { "electricity_t_minus_2": 92, "electricity_t_minus_1": 114, "target_month_num": 3 }
Output: { "predicted_electricity_kwh": 117.11, "predicted_co2_kg": 79.049, ... }
```

### Model Details
- **Algorithm**: GradientBoostingRegressor (Seasonal)
- **Features**: `electricity_t_minus_2`, `electricity_t_minus_1`, `target_month_num`
- **Metrics**: MAE=32.1234, RMSE=186.3864, R²=0.1689
- **Emission factor**: 0.675 kg CO₂/kWh (CEA v22.0, FY 2025-26)

---

## 4. Recommended Frontend Architecture

### Stack
| Choice | Rationale |
|--------|-----------|
| **React 18 + TypeScript** | Required by brief |
| **Vite** | Fast dev server, simple config |
| **React Router v6** | Client-side routing |
| **Tailwind CSS** | Utility-first, supports custom palette, no runtime overhead |
| **Recharts** | Lightweight React charting, tree-shakeable |
| **React Hook Form + Zod** | Form validation, type-safe |
| **Axios** | HTTP client with interceptors |
| **Lucide React** | Clean icons, tree-shakeable |

### Project Structure
```
carboniq-frontend/
├── public/
├── src/
│   ├── api/                 # Axios instance, API calls
│   ├── components/
│   │   ├── ui/              # Reusable primitives (Button, Card, Input, Select, etc.)
│   │   ├── layout/          # Sidebar, Header, PageContainer
│   │   ├── charts/          # Chart wrappers (LineChart, BarChart, KPICard)
│   │   └── forms/           # PredictionForm, etc.
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Electricity.tsx
│   │   ├── LPG.tsx
│   │   ├── Water.tsx
│   │   ├── Food.tsx
│   │   ├── Transport.tsx
│   │   ├── Forecast.tsx
│   │   ├── TodoNotTodo.tsx
│   │   └── Settings.tsx
│   ├── hooks/               # useApi, useForecast, etc.
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # formatters, constants
│   ├── styles/              # Tailwind config, global CSS
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

---

## 5. Recommended Component Structure

### Layout Components
- `Sidebar` — fixed left nav, desktop-only, collapsible optional
- `Header` — top bar with page title, user/menu placeholder
- `PageContainer` — consistent padding, max-width, centered content

### UI Primitives (`components/ui/`)
- `Button` — primary, secondary, ghost variants
- `Card` — rounded white card, subtle shadow, consistent padding
- `Input` — styled input with label, error state
- `Select` — month selector (1–12)
- `Badge` — status indicators
- `Spinner` — loading states

### Data Display (`components/charts/`)
- `KPICard` — metric value, label, trend (optional), unit
- `LineChart` — electricity consumption over time
- `BarChart` — monthly comparison, CO₂ by category
- `AreaChart` — stacked emissions (future)

### Forms (`components/forms/`)
- `PredictionForm` — t-2, t-1 inputs + month select, validation, submit handler

---

## 6. Recommended Routing Structure

| Route | Page | Notes |
|-------|------|-------|
| `/` | Dashboard | Overview KPIs, recent forecast, quick actions |
| `/electricity` | Electricity | Historical chart, forecast form, emission factor info |
| `/lpg` | LPG | Placeholder — static info / manual calculator |
| `/water` | Water | Placeholder — static info |
| `/food` | Food | Placeholder — static info |
| `/transport` | Transport | Placeholder — vehicle ownership display only (no CO₂) |
| `/forecast` | Forecast | Dedicated forecast page with history log |
| `/todo-not-todo` | TodoNotTodo | Static rule-based tips (client-side) |
| `/settings` | Settings | Emission factor override, units, model info |

> **Note**: Only `/`, `/electricity`, `/forecast` have live backend integration in MVP. Others are static/placeholder.

---

## 7. Required Dependencies

### Production
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.22.0",
  "axios": "^1.6.0",
  "recharts": "^2.10.0",
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0",
  "lucide-react": "^0.303.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

### Development
```json
{
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "eslint": "^8.56.0",
  "@typescript-eslint/eslint-plugin": "^7.0.0",
  "@typescript-eslint/parser": "^7.0.0",
  "prettier": "^3.2.0"
}
```

---

## 8. API Integration Plan

### Axios Instance (`src/api/client.ts`)
- Base URL from `import.meta.env.VITE_API_BASE_URL` (default `http://127.0.0.1:8000`)
- Request/response interceptors for error handling
- Timeout: 10s

### API Functions (`src/api/forecast.ts`)
```ts
export const healthCheck = () => api.get<HealthResponse>('/health');
export const predictElectricity = (payload: PredictRequest) => 
  api.post<PredictResponse>('/predict', payload);
```

### Custom Hooks
- `useHealthCheck()` — polls /health on mount
- `useForecast()` — manages prediction form state, loading, error, result

---

## 9. Data Models / Interfaces

```ts
// src/types/api.ts
export interface PredictRequest {
  electricity_t_minus_2: number;
  electricity_t_minus_1: number;
  target_month_num: number;
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
  model_metrics: { MAE_kWh: number; RMSE_kWh: number; R2: number };
  limitations: string[];
}

export interface HealthResponse {
  status: 'ok';
  model_loaded: boolean;
  model_name: string;
}

// src/types/domain.ts
export interface ElectricityRecord {
  month: string;           // "2019-11"
  consumption_kwh: number;
  co2_kg: number;
}

export interface ForecastHistoryEntry {
  id: string;
  input: PredictRequest;
  output: PredictResponse;
  created_at: string;      // ISO timestamp
}
```

---

## 10. Page-by-Page Implementation Plan

### Phase 1 — Foundation (Week 1)
| Page | Components | Backend | Status |
|------|------------|---------|--------|
| `/` (Dashboard) | KPICards, recent forecast summary, quick link to Forecast | `healthCheck()` only | Live |
| Layout | Sidebar, Header, PageContainer | — | Static |

### Phase 2 — Electricity Domain (Week 1–2)
| Page | Components | Backend | Status |
|------|------------|---------|--------|
| `/electricity` | LineChart (historical), PredictionForm, emission factor card, model metrics card | `predictElectricity()` | Live |
| `/forecast` | Full-screen PredictionForm, history table (localStorage), model info | `predictElectricity()` | Live |

### Phase 3 — Placeholder Domains (Week 2)
| Page | Components | Backend | Status |
|------|------------|---------|--------|
| `/lpg` | Info card, manual calculator (rule-based) | — | Static |
| `/water` | Info card, usage tips | — | Static |
| `/food` | Info card, diet tips | — | Static |
| `/transport` | Vehicle ownership display (from dataset if available), **no CO₂** | — | Static |

### Phase 4 — Utility Pages (Week 2)
| Page | Components | Backend | Status |
|------|------------|---------|--------|
| `/todo-not-todo` | Categorized tips (Do / Don't), client-side filter | — | Static |
| `/settings` | Emission factor override (localStorage), units toggle, model metadata display | — | Static |

---

## 11. Currently Supported Functionality (Backend-Ready)

| Feature | Backend Support | Frontend Effort |
|---------|----------------|-----------------|
| Health check | ✅ GET /health | Low |
| Electricity forecast (next month) | ✅ POST /predict | Medium |
| Deterministic CO₂ from forecast | ✅ Included in /predict | Low |
| Model metadata (name, metrics, limitations) | ✅ Included in /predict | Low |
| Emission factor provenance | ✅ Included in /predict | Low |

---

## 12. Requires New Backend / Data Work

| Feature | Backend Needed | Notes |
|---------|----------------|-------|
| Historical electricity chart (per household) | ❌ No endpoint | Need `/history/:household_id` or CSV export |
| LPG / Water / Food / Transport CO₂ calculations | ❌ No endpoints | Not in current ML pipeline |
| Multi-household dashboard / aggregation | ❌ No endpoint | Requires new API design |
| User auth / households / saved forecasts | ❌ No endpoint | Out of scope for MVP |
| Forecast history persistence | ❌ No DB | Use localStorage for MVP |

---

## 13. Must Remain Mock / Static / Rule-Based (College MVP)

| Feature | Approach |
|---------|----------|
| LPG carbon calculator | Static formula: kg × 2.93 kg CO₂/kg (rule-of-thumb) |
| Water carbon | Static: m³ × 0.344 kg CO₂/m³ (rule-of-thumb) |
| Food carbon | Static tips only (no calculation) |
| Transport CO₂ | **Never calculate** — insufficient data (vehicle ownership ≠ distance/fuel) |
| Historical charts | Mock data from notebook CSV (embed sample) or localStorage forecast history |
| Todo/Not-Todo | Static curated list (client-side) |
| Settings (emission factor override) | localStorage only — does not affect backend |

---

## 14. Risks / Conflicts Found

| Risk | Severity | Mitigation |
|------|----------|------------|
| **No frontend exists** | High | Full greenfield build — allocate setup time |
| **No historical data API** | Medium | Embed sample CSV data in frontend or use localStorage forecast history for charts |
| **R² = 0.1689 (low)** | Medium | UI must show limitations prominently; don't overstate accuracy |
| **Emission factor period mismatch** | Low | Display "FY 2025-26" vs "Historical data 2018–2020" clearly |
| **Transport data incomplete** | High | Hard-code: "Transport emissions not calculated — insufficient travel data" |
| **Single-household model** | Medium | API accepts raw inputs; no household lookup. Frontend must not imply household selection. |
| **CORS only for localhost:5173** | Low | Update backend if deploying elsewhere |

---

## 15. Recommended Implementation Order

| Step | Task | Est. Time |
|------|------|-----------|
| 1 | Initialize Vite + React + TS + Tailwind + ESLint/Prettier | 2h |
| 2 | Configure Tailwind with brand palette, create UI primitives (Button, Card, Input, Select) | 3h |
| 3 | Build Layout: Sidebar, Header, PageContainer, routing | 2h |
| 4 | Create API client, types, `useForecast` hook | 2h |
| 5 | **Dashboard** — KPI cards, health check, quick forecast summary | 2h |
| 6 | **Electricity page** — historical chart (mock), PredictionForm, emission factor card, metrics card | 3h |
| 7 | **Forecast page** — full form, history log (localStorage), model info | 3h |
| 7 | **Placeholder pages** (LPG, Water, Food, Transport) — static cards + rule-based calculators | 2h |
| 8 | **Todo/Not-Todo** — static categorized tips | 1h |
| 9 | **Settings** — localStorage emission factor override, model metadata display | 1h |
| 10 | Polish: animations, hover states, loading skeletons, error toasts | 2h |
| 11 | Test end-to-end with running backend | 1h |

**Total estimate: ~22 hours**

---

## Next Step (After Approval)

1. Run `npm create vite@latest carboniq-frontend -- --template react-ts`
2. Install dependencies (production + dev)
3. Configure Tailwind with the exact brand palette:
   ```js
   // tailwind.config.js
   colors: {
     brand: {
       950: '#051F20',
       900: '#0B2B26',
       800: '#163832',
       700: '#235347',
       300: '#8EB69B',
       100: '#DAF1DE',
     }
   }
   ```
4. Build layout components (Sidebar, Header)
5. Implement Dashboard + Electricity + Forecast pages with live API

---

## Files Created / Changed

| File | Action |
|------|--------|
| `FRONTEND_IMPLEMENTATION_PLAN.md` | **Created** — this document |

No other files modified. Backend unchanged.

---

## Blockers

1. **Dataset not in repo** — Historical chart on Electricity page needs sample data. Options:
   - Embed a small JSON export from the notebook (e.g., 50 rows)
   - Use localStorage forecast history as "your predictions"
   - Skip historical chart in MVP, show only forecast result

2. **Backend not running** — Must start `uvicorn app:app --reload` from `CarbonIQ_Backend_Package/` before frontend dev.

---

## Exact Next Step I Recommend

> **Initialize the Vite + React + TypeScript project with Tailwind CSS**, then build the layout shell (Sidebar + Header + routing) and API client. After that, implement the **Dashboard** and **Electricity/Forecast** pages which are the only ones with live backend integration.

**Wait for your go-ahead before running any commands.**