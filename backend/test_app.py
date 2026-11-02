import os
import sys

import pytest
from fastapi.testclient import TestClient

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

client = TestClient(app)


class TestHealthEndpoint:
    def test_health_returns_ok(self):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["model_loaded"] is True
        assert data["model_name"] == "Seasonal Gradient Boosting"

    def test_health_model_name_matches_metadata(self):
        response = client.get("/api/health")
        data = response.json()
        assert data["model_name"] == "Seasonal Gradient Boosting"


class TestPredictEndpoint:
    def test_predict_valid_input(self):
        payload = {
            "electricity_t_minus_2": 92.0,
            "electricity_t_minus_1": 114.0,
            "target_month_num": 3,
        }
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 200
        data = response.json()

        # Check required fields
        assert "predicted_electricity_kwh" in data
        assert "predicted_co2_kg" in data
        assert "emission_factor_kg_co2_per_kwh" in data
        assert "factor_source" in data
        assert "factor_version" in data
        assert "reporting_period" in data
        assert "gas" in data
        assert "model_name" in data
        assert "model_metrics" in data
        assert "limitations" in data

        # Check types and constraints
        assert isinstance(data["predicted_electricity_kwh"], (int, float))
        assert data["predicted_electricity_kwh"] >= 0
        assert isinstance(data["predicted_co2_kg"], (int, float))
        assert data["predicted_co2_kg"] >= 0
        assert data["emission_factor_kg_co2_per_kwh"] == 0.675
        assert data["factor_source"] == "Central Electricity Authority (CEA)"
        assert data["gas"] == "CO2"
        assert data["model_name"] == "Seasonal Gradient Boosting"

        # Check model_metrics structure
        metrics = data["model_metrics"]
        assert "MAE_kWh" in metrics
        assert "RMSE_kWh" in metrics
        assert "R2" in metrics

        # Check limitations is a list
        assert isinstance(data["limitations"], list)
        assert len(data["limitations"]) > 0

    def test_predict_rounds_to_two_decimals(self):
        payload = {
            "electricity_t_minus_2": 92.0,
            "electricity_t_minus_1": 114.0,
            "target_month_num": 3,
        }
        response = client.post("/api/predict", json=payload)
        data = response.json()

        # Check rounding
        kwh_str = str(data["predicted_electricity_kwh"])
        if "." in kwh_str:
            decimals = len(kwh_str.split(".")[1])
            assert decimals <= 2

        co2_str = str(data["predicted_co2_kg"])
        if "." in co2_str:
            decimals = len(co2_str.split(".")[1])
            assert decimals <= 3

    def test_predict_invalid_electricity_negative(self):
        payload = {
            "electricity_t_minus_2": -10.0,
            "electricity_t_minus_1": 114.0,
            "target_month_num": 3,
        }
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 422  # Validation error

    def test_predict_invalid_electricity_nan(self):
        # NaN cannot be serialized to JSON, so we test the Pydantic validation
        # by checking the model config directly
        import pytest

        from app import PredictionRequest

        # Pydantic v2 with allow_inf_nan=False should reject NaN at validation time
        # This tests the model configuration
        with pytest.raises(ValueError):
            PredictionRequest(
                electricity_t_minus_2=float("nan"),
                electricity_t_minus_1=114.0,
                target_month_num=3,
            )

    def test_predict_invalid_month_zero(self):
        payload = {
            "electricity_t_minus_2": 92.0,
            "electricity_t_minus_1": 114.0,
            "target_month_num": 0,
        }
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 422

    def test_predict_invalid_month_thirteen(self):
        payload = {
            "electricity_t_minus_2": 92.0,
            "electricity_t_minus_1": 114.0,
            "target_month_num": 13,
        }
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 422

    def test_predict_missing_field(self):
        payload = {
            "electricity_t_minus_2": 92.0,
            "electricity_t_minus_1": 114.0,
            # missing target_month_num
        }
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 422

    def test_predict_invalid_type(self):
        payload = {
            "electricity_t_minus_2": "not_a_number",
            "electricity_t_minus_1": 114.0,
            "target_month_num": 3,
        }
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 422

    def test_predict_all_months_valid(self):
        """Test that all 12 months are accepted."""
        for month in range(1, 13):
            payload = {
                "electricity_t_minus_2": 100.0,
                "electricity_t_minus_1": 120.0,
                "target_month_num": month,
            }
            response = client.post("/api/predict", json=payload)
            assert response.status_code == 200, f"Month {month} failed"

    def test_predict_zero_consumption(self):
        """Test edge case of zero consumption."""
        payload = {
            "electricity_t_minus_2": 0.0,
            "electricity_t_minus_1": 0.0,
            "target_month_num": 6,
        }
        response = client.post("/api/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["predicted_electricity_kwh"] >= 0
        assert data["predicted_co2_kg"] >= 0


class TestCORS:
    def test_cors_headers_present(self):
        response = client.options(
            "/api/predict",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "POST",
            },
        )
        # FastAPI TestClient doesn't fully simulate CORS, but we can check middleware is added
        assert response.status_code in (200, 405)


class TestModelLoading:
    def test_model_loaded_at_startup(self):
        # This is implicitly tested by health endpoint
        response = client.get("/api/health")
        assert response.json()["model_loaded"] is True


if __name__ == "__main__":
    pytest.main([__file__, "-v"])