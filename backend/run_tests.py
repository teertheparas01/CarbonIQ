from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

# TC01: Valid request
print("=" * 60)
print("TC01 - Valid request (t-2=92, t-1=114, month=3)")
print("=" * 60)
response = client.post('/api/predict', json={'electricity_t_minus_2': 92, 'electricity_t_minus_1': 114, 'target_month_num': 3})
print(f"Status: {response.status_code}")
data = response.json()
print(f"Predicted kWh: {data['predicted_electricity_kwh']}")
print(f"Predicted CO2: {data['predicted_co2_kg']}")
print(f"Emission Factor: {data['emission_factor_kg_co2_per_kwh']}")
print(f"Has kWh field: {'predicted_electricity_kwh' in data}")
print(f"Has CO2 field: {'predicted_co2_kg' in data}")

# TC05: CO2 validation
print("\n" + "=" * 60)
print("TC05 - CO2 Validation (CO2 = kWh * factor)")
print("=" * 60)
expected_co2 = round(data['predicted_electricity_kwh'] * data['emission_factor_kg_co2_per_kwh'], 3)
print(f"Predicted kWh: {data['predicted_electricity_kwh']}")
print(f"Emission Factor: {data['emission_factor_kg_co2_per_kwh']}")
print(f"Expected CO2 (kWh * factor, 3 decimals): {expected_co2}")
print(f"Actual CO2 from API: {data['predicted_co2_kg']}")
print(f"Match (3 decimals): {data['predicted_co2_kg'] == expected_co2}")

# TC06: Health endpoint
print("\n" + "=" * 60)
print("TC06 - Health Check (GET /health)")
print("=" * 60)
health = client.get('/api/health').json()
print(f"Status: {health['status']}")
print(f"Model Loaded: {health['model_loaded']}")
print(f"Model Name: {health['model_name']}")

# TC03: target_month_num = 0
print("\n" + "=" * 60)
print("TC03 - Invalid month (target_month_num = 0)")
print("=" * 60)
resp = client.post('/api/predict', json={'electricity_t_minus_2': 92, 'electricity_t_minus_1': 114, 'target_month_num': 0})
print(f"Status: {resp.status_code}")
print(f"Expected: 422")
print(f"Pass: {resp.status_code == 422}")

# TC04: target_month_num = 13
print("\n" + "=" * 60)
print("TC04 - Invalid month (target_month_num = 13)")
print("=" * 60)
resp = client.post('/api/predict', json={'electricity_t_minus_2': 92, 'electricity_t_minus_1': 114, 'target_month_num': 13})
print(f"Status: {resp.status_code}")
print(f"Expected: 422")
print(f"Pass: {resp.status_code == 422}")

# TC02: Negative electricity
print("\n" + "=" * 60)
print("TC02 - Negative electricity reading")
print("=" * 60)
resp = client.post('/api/predict', json={'electricity_t_minus_2': -10, 'electricity_t_minus_1': 114, 'target_month_num': 3})
print(f"Status: {resp.status_code}")
print(f"Expected: 422")
print(f"Pass: {resp.status_code == 422}")