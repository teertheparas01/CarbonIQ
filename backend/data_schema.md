# CarbonIQ Data Schema v1.0.0

## ElectricityRecord

Canonical input schema for household electricity consumption forecasting.
Used by both training pipeline and inference API.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| household_id | <class 'str'> | Yes | - | Unique household identifier (string to support any format) |
| target_month | <class 'str'> | Yes | pattern=^\d{4}-\d{2}-\d{2}$ | Target month in YYYY-MM-DD format (day must be 01) |
| electricity_t_minus_2 | <class 'float'> | Yes | - | Electricity consumption 2 months prior to target (kWh) |
| electricity_t_minus_1 | <class 'float'> | Yes | - | Electricity consumption 1 month prior to target (kWh) |
| electricity_target | typing.Optional[float] | No | - | Actual electricity consumption for target month (kWh) - training only |
| adults | typing.Optional[int] | No | - | - |
| children | typing.Optional[int] | No | - | - |
| seniors | typing.Optional[int] | No | - | - |
| rooms | typing.Optional[int] | No | - | - |
| income | typing.Optional[float] | No | - | - |

## InferenceRequest

Minimal schema for the `/forecast` API endpoint.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| electricity_t_minus_2 | <class 'float'> | Yes | - | - |
| electricity_t_minus_1 | <class 'float'> | Yes | - | - |
| target_month_num | <class 'int'> | Yes | - | - |