from pathlib import Path
import json

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "carboniq_seasonal_gb.joblib"
METADATA_PATH = BASE_DIR / "carboniq_model_metadata.json"

with open(METADATA_PATH, "r", encoding="utf-8") as file:
    metadata = json.load(file)

model = joblib.load(MODEL_PATH)

emission_factor = metadata["emission_factor"]
factor = emission_factor["kg_co2_per_kwh"]

app = FastAPI(
    title="CarbonIQ API",
    description="Electricity forecasting and carbon estimation",
    version="0.1.0"
)

# Local development origins for the React/Vite frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)


class PredictionRequest(BaseModel):
    electricity_t_minus_2: float = Field(ge=0, allow_inf_nan=False)
    electricity_t_minus_1: float = Field(ge=0, allow_inf_nan=False)
    target_month_num: int = Field(ge=1, le=12)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_name": metadata["model_name"]
    }


@app.post("/predict")
def predict(request: PredictionRequest):
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
