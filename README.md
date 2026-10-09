# CarbonIQ

Household energy and carbon monitoring, prediction, and reduction application. College AIML project.

## What It Does

CarbonIQ predicts next-month electricity consumption for a household using a Seasonal Gradient Boosting model trained on Pune household survey data (January 2018 – February 2020). CO₂ emissions are calculated deterministically from predicted kWh using the Central Electricity Authority (CEA) emission factor (0.675 kg CO₂/kWh, database version 22.0, reporting period FY 2025-26).

**Implemented (MVP):**
- Electricity forecasting via `POST /predict` endpoint (t-2, t-1 consumption + target month)
- Deterministic CO₂ calculation from predicted electricity
- Model health check via `GET /health`
- React + TypeScript frontend with Dashboard, Electricity, Forecast pages
- LocalStorage-based forecast history on the Forecast page

**Not Implemented (by design):**
- LPG, Water, Food, Transport CO₂ calculations — insufficient verified input data
- Historical electricity charts — no household-level history API endpoint
- User authentication, multi-household support, persistent forecast storage

## Architecture

```
┌─────────────┐     HTTP/JSON      ┌─────────────┐
│  Frontend   │ ◄─────────────────► │  Backend    │
│  (React 19, │   POST /predict    │  (FastAPI,  │
│   Vite,     │   GET /health      │   scikit-   │
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

**Frontend:** React 19 + TypeScript + Vite + Tailwind CSS (v4) + Motion (Framer Motion v14) + Recharts + Axios + React Router v7

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
curl http://127.0.0.1:8000/health

# Prediction example
curl -X POST http://127.0.0.1:8000/predict \
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
| MAE | 32.1234 kWh |
| RMSE | 186.3864 kWh |
| R² | 0.1689 |
| Model file | `backend/carboniq_seasonal_gb.joblib` |
| Metadata | `backend/carboniq_model_metadata.json` |

**Limitations (from metadata):**
- Trained on historical household electricity observations
- Evaluation uses a historical test period (Nov 2019 – Feb 2020)
- Current-period forecasts need validation against newer data
- The emission factor is configurable and separate from the ML model
- R² ≈ 0.17 indicates modest explanatory power; predictions are estimates

## Emission Factor

| Property | Value |
|----------|-------|
| Value | 0.675 kg CO₂/kWh |
| Source | Central Electricity Authority (CEA) |
| Database Version | 22.0 |
| Reporting Period | FY 2025-26 |
| Gas | CO₂ |
| Scope | Grid electricity only |

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
│   └── requirements.txt
├── frontend/                # React + TypeScript + Vite
│   ├── public/
│   ├── src/
│   │   ├── api/             # Axios client, API calls
│   │   ├── components/
│   │   │   ├── ui/          # Button, Card, Input, Select, Badge
│   │   │   └── layout/      # Sidebar, Header, PageContainer, Layout
│   │   ├── hooks/           # useForecast, useHealth
│   │   ├── lib/             # Motion animations (animations.tsx)
│   │   ├── pages/           # Dashboard, Electricity, Forecast, LPG, Water, Food, Transport, TodoNotTodo, Settings
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
│   ├── FRONTEND_IMPLEMENTATION_PLAN.md
│   ├── CHANGE_REPORT.md
│   └── development/               # Future development guides
├── scripts/
│   ├── check_nb.py
│   └── count_original.py
├── AGENT_OPERATING_GUIDE.md
├── README.md
└── .gitignore
```

## Development Commands

| Task | Command |
|------|---------|
| Frontend dev server | `cd frontend && npm run dev` |
| Frontend build | `cd frontend && npm run build` |
| Frontend lint | `cd frontend && npm run lint` |
| Backend dev server | `cd backend && uvicorn app:app --reload` |
| Backend tests | Run smoke tests in `notebooks/CarbonIQ_ML_Clean.ipynb` (cell M) |

## License

College project — no license specified.