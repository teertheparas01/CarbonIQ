import pytest
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health_ok():
    """Test that /health endpoint returns OK when model is loaded."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True
    assert "model_name" in data


def test_predict_valid_input():
    """Test /predict with valid input returns expected structure."""
    payload = {
        "electricity_t_minus_2": 92.0,
        "electricity_t_minus_1": 114.0,
        "target_month_num": 3
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_electricity_kwh" in data
    assert "predicted_co2_kg" in data
    assert "emission_factor_kg_co2_per_kwh" in data
    assert data["emission_factor_kg_co2_per_kwh"] == 0.675
    assert isinstance(data["predicted_electricity_kwh"], float)
    assert isinstance(data["predicted_co2_kg"], float)
    assert data["predicted_electricity_kwh"] >= 0
    assert data["predicted_co2_kg"] >= 0


def test_predict_readme_example():
    """Test the exact example from README."""
    payload = {
        "electricity_t_minus_2": 92,
        "electricity_t_minus_1": 114,
        "target_month_num": 3
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Values should match the example approximately
    assert 110 < data["predicted_electricity_kwh"] < 130
    assert 70 < data["predicted_co2_kg"] < 90


def test_predict_invalid_month():
    """Test /predict rejects month outside 1-12."""
    payload = {
        "electricity_t_minus_2": 92.0,
        "electricity_t_minus_1": 114.0,
        "target_month_num": 13
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422


def test_predict_negative_kwh():
    """Test /predict rejects negative kWh."""
    payload = {
        "electricity_t_minus_2": -10.0,
        "electricity_t_minus_1": 114.0,
        "target_month_num": 3
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422


def test_predict_missing_field():
    """Test /predict rejects missing required field."""
    payload = {
        "electricity_t_minus_2": 92.0,
        "electricity_t_minus_1": 114.0
        # target_month_num missing
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422


def test_predict_excessive_kwh():
    """Test /predict rejects unrealistic kWh values."""
    payload = {
        "electricity_t_minus_2": 10000.0,
        "electricity_t_minus_1": 114.0,
        "target_month_num": 3
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 422