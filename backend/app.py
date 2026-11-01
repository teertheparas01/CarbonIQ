from pathlib import Path
import json
import os
from contextlib import asynccontextmanager

import joblib
import pandas as pd
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "carboniq_seasonal_gb.joblib"
METADATA_PATH = BASE_DIR / "carboniq_model_metadata.json"

# Load metadata at startup
with open(METADATA_PATH, "r", encoding="utf-8") as file:
    metadata = json.load(file)

emission_factor = metadata["emission_factor"]
factor = emission_factor["kg_co2_per_kwh"]

# Model loaded at startup - will raise on failure
try:
    model = joblib.load(MODEL_PATH)
    model_loaded = True
except Exception as e:
    model = None
    model_loaded = False
    model_error = str(e)

router = APIRouter()

# CORS origins from environment
def get_allowed_origins() -> list[str]:
    """Get allowed CORS origins from environment variable."""
    origins_env = os.getenv("ALLOWED_ORIGINS", "")
    if origins_env:
        return [o.strip() for o in origins_env.split(",") if o.strip()]
    # Defaults for local development
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    if not model_loaded:
        print(f"WARNING: Model failed to load: {model_error}")
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="CarbonIQ API",
    description="Electricity forecasting and carbon estimation",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS
allowed_origins = get_allowed_origins()
allow_origin_regex = r"https://.*\.vercel\.app" if os.getenv("VERCEL") else None

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    electricity_t_minus_2: float = Field(ge=0, le=5000, allow_inf_nan=False)
    electricity_t_minus_1: float = Field(ge=0, le=5000, allow_inf_nan=False)
    target_month_num: int = Field(ge=1, le=12)

    @field_validator("electricity_t_minus_2", "electricity_t_minus_1")
    @classmethod
    def validate_electricity(cls, v: float) -> float:
        if v < 0:
            raise ValueError("Electricity consumption must be non-negative")
        if v > 5000:
            raise ValueError("Electricity consumption exceeds maximum allowed (5000 kWh)")
        return v

    @field_validator("target_month_num")
    @classmethod
    def validate_month(cls, v: int) -> int:
        if v < 1 or v > 12:
            raise ValueError("Target month must be between 1 and 12")
        return v


@router.get("/health")
def health():
    if not model_loaded:
        raise HTTPException(status_code=503, detail=f"Model failed to load: {model_error}")
    return {
        "status": "ok",
        "model_loaded": True,
        "model_name": metadata["model_name"]
    }


@router.post("/predict")
def predict(request: PredictionRequest):
    if not model_loaded:
        raise HTTPException(status_code=503, detail=f"Model failed to load: {model_error}")

    # Construct inputs in the model's documented feature order.
    values = {
        "electricity_t_minus_2": request.electricity_t_minus_2,
        "electricity_t_minus_1": request.electricity_t_minus_1,
        "target_month_num": request.target_month_num
    }

    model_input = pd.DataFrame([
        {feature: values[feature] for feature in metadata["features"]}
    ])

    raw_prediction = float(model.predict(model_input)[0])

    # Keep reported electricity non-negative and round before
    # calculating emissions so the displayed values are consistent.
    predicted_kwh = round(max(0.0, raw_prediction), 2)
    predicted_co2 = round(predicted_kwh * factor, 3)

    return {
        "predicted_electricity_kwh": predicted_kwh,
        "predicted_co2_kg": predicted_co2,
        "emission_factor_kg_co2_per_kwh": factor,
        "factor_source": emission_factor["source"],
        "factor_version": emission_factor["database_version"],
        "reporting_period": emission_factor["reporting_period"],
        "gas": emission_factor["gas"],
        "model_name": metadata["model_name"],
        "model_metrics": metadata["evaluation"],
        "limitations": metadata["limitations"]
    }


# Include router with /api prefix (used by Vercel rewrite)
app.include_router(router, prefix="/api")

# Also include without prefix for direct access (local dev with Vite proxy)
app.include_router(router, include_in_schema=False)