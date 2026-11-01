# CarbonIQ

Household electricity forecasting and deterministic CO₂ estimation — College AIML mini-project.

## What It Does

CarbonIQ predicts next-month electricity consumption for a household using a Seasonal Gradient Boosting model trained on Pune household survey data (January 2018 – February 2020). CO₂ emissions are calculated deterministically from predicted kWh using the Central Electricity Authority (CEA) emission factor (0.675 kg CO₂/kWh, database version 22.0, reporting period FY 2025-26).

**Implemented (MVP):**
- Electricity forecasting via `POST /api/predict` endpoint (t-2, t-1 consumption + target month)
- Deterministic CO₂ calculation from predicted electricity
- Model health check via `GET /api/health`
- React 19 + TypeScript frontend with Dashboard, Electricity, Forecast, About pages
- LocalStorage-based forecast history on the Forecast page

**Not Implemented (by design):**
- LPG, Water, Food, Transport CO₂ calculations — insufficient verified input data
- Historical electricity charts — no household-level history API endpoint
- User authentication, multi-household support, persistent forecast storage

> ⚠️ **Note on evaluation metrics**: The training dataset (`Pune_HHLD_Survey_Data_v2-0-0.csv`) is not included in this repository. All reported metrics (MAE 32.12 kWh, RMSE 186.39 kWh, R² 0.1689) are NOTEBOOK-REPORTED ONLY and have not been independently verified. See [Evaluation Honesty](#evaluation-honesty--phase-4) section.

## Live Demo

🔗 **https://carboniq-hazel.vercel.app** (Vercel deployment)

*Screenshot placeholder: `docs/images/dashboard.png`*

## Architecture

```
┌─────────────┐     HTTP/JSON      ┌─────────────┐
│  Frontend   │ ◄─────────────────► │  Backend    │
│  (React 19, │   POST /api/predict │  (FastAPI,  │
│   Vite,     │   GET /api/health   │   scikit-   │
│   Tailwind) │                    │   learn)    │
└─────────────┘                    └─────────────┘
                                            │
                                            ▼
                                   ┌─────────────────┐
                                   │  ML Model       │
                                   │  (Gradient      │
                                   │   Boosting,     │
                                   │   joblib)       │
                                   └─────────────────┘
```

**Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion (Framer Motion v14) + Recharts + Axios + React Router v7 + Phosphor Icons

**Backend:** FastAPI + scikit-learn 1.6.1 + joblib + uvicorn

**Model:** `GradientBoostingRegressor` (Seasonal), features: `electricity_t_minus_2`, `electricity_t_minus_1`, `target_month_num`

## Quick Start

### Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
# Runs on http://127.0.0.1:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (CORS configured for this origin)
```

### API Verification
```bash
# Health check
curl http://127.0.0.1:8000/api/health

# Prediction example
curl -X POST http://127.0.0.1:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"electricity_t_minus_2": 92, "electricity_t_minus_1": 114, "target_month_num": 3}'
```

Expected response:
```json
{
  "predicted_electricity_kwh": 117.11,
  "predicted_co2_kg": 79.049,
  "emission_factor_kg_co2_per_kwh": 0.675,
  "factor_source": "Central Electricity Authority (CEA)",
  "factor_version": "22.0",
  "reporting_period": "FY 2025-26",
  "gas": "CO2",
  "model_name": "Seasonal Gradient Boosting",
  "model_metrics": { "MAE_kWh": 32.1234, "RMSE_kWh": 186.3864, "R2": 0.1689 },
  "limitations": [ ... ]
}
```

## ML Model

| Property | Value |
|----------|-------|
| Algorithm | GradientBoostingRegressor (Seasonal) |
| Features | `electricity_t_minus_2`, `electricity_t_minus_1`, `target_month_num` |
| Target | Next-month electricity (kWh) |
| Training samples | 5,347 |
| Test samples | 1,434 (November 2019 – February 2020) |
| Training cutoff | Before November 2019 |
| MAE | 32.12 kWh *(notebook-reported)* |
| RMSE | 186.39 kWh *(notebook-reported)* |
| R² | 0.1689 *(notebook-reported)* |
| Model file | `backend/carboniq_seasonal_gb.joblib` |
| Metadata | `backend/carboniq_model_metadata.json` |

**Limitations (from metadata):**
- Trained on historical household electricity observations
- Evaluation uses a historical test period (Nov 2019 – Feb 2020)
- Current-period forecasts need validation against newer data
- The emission factor is configurable and separate from the ML model
- R² ≈ 0.17 indicates modest explanatory power; predictions are estimates

### Baseline Comparison *(TODO — requires dataset)*

| Model | MAE (kWh) | RMSE (kWh) | R² |
|-------|-----------|------------|-----|
| Seasonal Gradient Boosting (current) | 32.12 | 186.39 | 0.1689 |
| Persistence baseline (t-1) | — | — | — |
| Seasonal-naive (same month last year) | — | — | — |

> **Evaluation Honesty**: The training dataset is not included in this repository. All metrics above are NOTEBOOK-REPORTED ONLY. See [Evaluation Honesty](#evaluation-honesty--phase-4) for details.

## Emission Factor

| Property | Value |
|----------|-------|
| Value | 0.675 kg CO₂/kWh |
| Source | Central Electricity Authority (CEA) |
| Database Version | 22.0 |
| Reporting Period | FY 2025-26 |
| Gas | CO₂ |
| Scope | Grid electricity only |

**Source**: [CEA CO₂ Baseline Database v22.0](https://cea.nic.in/) — *TODO: verify exact URL and access date*

The emission factor is **not applied** to LPG, water, food, or transport. It is versioned in the model metadata and sourced from the backend at runtime (not hardcoded in the frontend).

## Unsupported Functionality

| Domain | Status | Reason |
|--------|--------|--------|
| LPG CO₂ | Not available | No verified emission calculation implemented; survey data exists but no CEA-equivalent factor |
| Water CO₂ | Not available | No verified emission calculation implemented |
| Food CO₂ | Not available | Highly variable by diet/source; no generic factor without verification |
| Transport CO₂ | Not available | Vehicle ownership ≠ distance/fuel use; survey lacks travel data |
| Historical charts | Not available | No `/history/:household_id` endpoint; would need new API |
| Multi-household | Not available | API accepts raw inputs; no household lookup |
| Persistent history | Not available | No database; frontend uses localStorage |

## Project Structure

```
.
├── backend/                 # FastAPI + model artifacts
│   ├── app.py
│   ├── carboniq_model_metadata.json
│   ├── carboniq_seasonal_gb.joblib
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── tests/
│       └── test_api.py
├── frontend/                # React + TypeScript + Vite
│   ├── public/
│   ├── src/
│   │   ├── api/             # Axios client, API calls
│   │   ├── components/
│   │   │   ├── ui/          # Button, Card, Input, Select, Badge
│   │   │   └── layout/      # TopNav, Header, PageContainer, Layout
│   │   ├── hooks/           # useForecast, useHealth
│   │   ├── lib/             # Motion animations (animations.tsx)
│   │   ├── pages/           # Dashboard, Electricity, Forecast, Landing, About
│   │   ├── types/           # TypeScript interfaces (api.ts, navigation.ts)
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── routes.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── notebooks/
│   └── CarbonIQ_ML_Clean.ipynb    # Cleaned, reproducible ML pipeline
├── docs/
│   └── development/               # Future development guides
├── scripts/
│   ├── generate_report.py
│   ├── launch.py
│   └── launch.bat
├── .gitignore
├── README.md
└── LICENSE
```

## Development Commands

| Task | Command |
|------|---------|
| Frontend dev server | `cd frontend && npm run dev` |
| Frontend build | `cd frontend && npm run build` |
| Frontend lint | `cd frontend && npm run lint` |
| Backend dev server | `cd backend && uvicorn app:app --reload` |
| Backend tests | `cd backend && pytest` |
| Backend test coverage | `cd backend && pytest --cov=app` |

## Evaluation Honesty (Phase 4)

The training dataset (`Pune_HHLD_Survey_Data_v2-0-0.csv`) is **NOT included in this repository**. It was originally loaded from Google Colab at `/content/Pune_HHLD_Survey_Data_v2-0-0.csv`.

All reported metrics in this README and the notebook are **NOTEBOOK-REPORTED ONLY** and have not been independently verified from source data in this repository.

### TODO for Complete Evaluation
- [ ] Obtain the Pune Household Survey dataset (1,872 households, 26 monthly columns Jan 2018–Feb 2020)
- [ ] Re-run notebook to compute on the existing time-based test split:
  - MAE, RMSE, Median Absolute Error, MAPE (guard against zeros), R² for:
    - (a) Current Seasonal Gradient Boosting model
    - (b) Persistence baseline (predict t-1)
    - (c) Seasonal-naive baseline (same month last year)
  - Share of squared error contributed by top 1% largest errors (RMSE 186 >> MAE 32)
  - Predicted-vs-actual plot and feature-importance plot saved to `docs/images/`
- [ ] If dataset cannot be obtained, clearly mark all metrics in README as NOTEBOOK-REPORTED ONLY

## Deployment

**Vercel** (frontend + backend as separate services)

### Vercel Configuration (`vercel.json`)
- Frontend: Vite static build with SPA rewrite
- Backend: FastAPI service
- Rewrites: `/api/*` → backend service, `/*` → frontend

### Environment Variables

**Backend** (`backend/.env`):
```bash
ALLOWED_ORIGINS=http://localhost:5173,https://carboniq-hazel.vercel.app
VERCEL_ORIGIN=https://carboniq-hazel.vercel.app
```

**Frontend** (`frontend/.env`):
```bash
# VITE_API_BASE_URL is optional.
# In local development, Vite proxy handles /api -> http://127.0.0.1:8000
# In Vercel, rewrite rules route /api/* to backend service automatically.
# VITE_API_BASE_URL=https://your-backend.example.com
```

## Testing

### Backend
```bash
cd backend
pip install -r requirements-dev.txt
pytest
pytest --cov=app
```

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- On push and PR: frontend `npm ci`, lint, build; backend `pip install`, `pytest`

## License

MIT License — Copyright (c) 2026 Paras Tirthe

See [LICENSE](LICENSE) for details.