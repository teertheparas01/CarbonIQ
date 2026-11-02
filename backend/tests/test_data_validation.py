"""
Tests for the CarbonIQ data validation pipeline.
"""

import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
import pandas as pd
import numpy as np
from pydantic import ValidationError as PydanticValidationError
from data_validation import (
    ElectricityRecord,
    InferenceRequest,
    ValidationConfig,
    validate_dataframe,
    clean_dataframe,
    validate_inference_request,
    ValidationSeverity,
)


class TestElectricityRecord:
    """Tests for the canonical ElectricityRecord schema."""

    def test_valid_record(self):
        record = ElectricityRecord(
            household_id="HH001",
            target_month="2024-03-01",
            electricity_t_minus_2=100.5,
            electricity_t_minus_1=110.2,
            electricity_target=115.0,
            adults=2,
            children=1,
            rooms=3,
            income=50000.0,
        )
        assert record.household_id == "HH001"
        assert record.target_month_num() == 3

    def test_valid_record_minimal(self):
        record = ElectricityRecord(
            household_id="HH001",
            target_month="2024-03-01",
            electricity_t_minus_2=100.5,
            electricity_t_minus_1=110.2,
        )
        assert record.electricity_target is None

    def test_invalid_target_month_format(self):
        with pytest.raises(PydanticValidationError):
            ElectricityRecord(
                household_id="HH001",
                target_month="2024/03/01",
                electricity_t_minus_2=100,
                electricity_t_minus_1=110,
            )

    def test_invalid_target_month_day_not_first(self):
        with pytest.raises(ValueError, match="first day"):
            ElectricityRecord(
                household_id="HH001",
                target_month="2024-03-15",
                electricity_t_minus_2=100,
                electricity_t_minus_1=110,
            )

    def test_negative_consumption_rejected(self):
        with pytest.raises(ValueError):
            ElectricityRecord(
                household_id="HH001",
                target_month="2024-03-01",
                electricity_t_minus_2=-10,
                electricity_t_minus_1=110,
            )

    def test_excessive_consumption_rejected(self):
        with pytest.raises(ValueError):
            ElectricityRecord(
                household_id="HH001",
                target_month="2024-03-01",
                electricity_t_minus_2=15000,
                electricity_t_minus_1=110,
            )

    def test_extra_fields_rejected(self):
        with pytest.raises(ValueError):
            ElectricityRecord(
                household_id="HH001",
                target_month="2024-03-01",
                electricity_t_minus_2=100,
                electricity_t_minus_1=110,
                unknown_field="not allowed",
            )


class TestInferenceRequest:
    """Tests for the API inference request schema."""

    def test_valid_request(self):
        req = InferenceRequest(
            electricity_t_minus_2=100.5,
            electricity_t_minus_1=110.2,
            target_month_num=3,
        )
        assert req.target_month_num == 3

    def test_invalid_month_number(self):
        with pytest.raises(ValueError):
            InferenceRequest(
                electricity_t_minus_2=100,
                electricity_t_minus_1=110,
                target_month_num=13,
            )

    def test_to_electricity_record(self):
        req = InferenceRequest(
            electricity_t_minus_2=100,
            electricity_t_minus_1=110,
            target_month_num=3,
        )
        record = req.to_electricity_record("HH001")
        assert record.household_id == "HH001"
        assert record.target_month_num() == 3


class TestValidateDataFrame:
    """Tests for DataFrame validation."""

    def make_valid_df(self, n: int = 10) -> pd.DataFrame:
        return pd.DataFrame({
            "household_id": [f"HH{i:03d}" for i in range(n)],
            "target_month": [f"2024-{(i % 12) + 1:02d}-01" for i in range(n)],
            "electricity_t_minus_2": np.random.uniform(50, 300, n),
            "electricity_t_minus_1": np.random.uniform(50, 300, n),
            "electricity_target": np.random.uniform(50, 300, n),
        })

    def test_valid_dataframe_passes(self):
        df = self.make_valid_df(20)
        report = validate_dataframe(df, is_training=True)
        assert not report.has_errors()
        assert report.rows_validated == 20

    def test_missing_required_column_error(self):
        df = self.make_valid_df(5).drop(columns=["electricity_t_minus_1"])
        report = validate_dataframe(df, is_training=True)
        assert report.has_errors()
        assert any(i.code == "MISSING_REQUIRED_COLUMNS" for i in report.get_errors())

    def test_missing_values_warning(self):
        df = self.make_valid_df(10)
        df.loc[0, "electricity_t_minus_2"] = np.nan
        df.loc[1, "electricity_t_minus_1"] = np.nan
        report = validate_dataframe(df, is_training=True)
        assert report.has_warnings()
        assert any(i.code == "MISSING_VALUES" for i in report.get_warnings())

    def test_negative_consumption_error(self):
        df = self.make_valid_df(5)
        df.loc[0, "electricity_t_minus_2"] = -50
        report = validate_dataframe(df, is_training=True)
        assert report.has_errors()
        assert any(i.code == "NEGATIVE_CONSUMPTION" for i in report.get_errors())

    def test_excessive_consumption_warning(self):
        df = self.make_valid_df(5)
        df.loc[0, "electricity_t_minus_2"] = 15000
        report = validate_dataframe(df, is_training=True)
        assert report.has_warnings()
        assert any(i.code == "EXCESSIVE_CONSUMPTION" for i in report.get_warnings())

    def test_outlier_detection(self):
        df = self.make_valid_df(20)
        df.loc[0, "electricity_t_minus_2"] = 5000  # Extreme outlier
        report = validate_dataframe(df, is_training=True)
        assert report.has_warnings()
        assert any(i.code == "STATISTICAL_OUTLIER" for i in report.get_warnings())

    def test_invalid_date_format_error(self):
        df = self.make_valid_df(5)
        df.loc[0, "target_month"] = "2024/03/01"
        report = validate_dataframe(df, is_training=True)
        assert report.has_errors()
        assert any(i.code == "INVALID_DATE_FORMAT" for i in report.get_errors())

    def test_duplicate_household_month_warning(self):
        df = self.make_valid_df(5)
        df.loc[1, "household_id"] = df.loc[0, "household_id"]
        df.loc[1, "target_month"] = df.loc[0, "target_month"]
        report = validate_dataframe(df, is_training=True)
        assert report.has_warnings()
        assert any(i.code == "DUPLICATE_HOUSEHOLD_MONTH" for i in report.get_warnings())


class TestCleanDataFrame:
    """Tests for data cleaning."""

    def test_drop_error_rows(self):
        df = pd.DataFrame({
            "household_id": ["HH001", "HH002", "HH003"],
            "target_month": ["2024-03-01", "2024-03-01", "2024-03-01"],
            "electricity_t_minus_2": [100, -50, 120],  # HH002 has negative
            "electricity_t_minus_1": [110, 120, 130],
        })
        cleaned, report = clean_dataframe(df, drop_errors=True)
        assert len(cleaned) == 2
        assert "HH002" not in cleaned["household_id"].values
        assert any(i.code == "ROWS_DROPPED" for i in report.issues)

    def test_impute_missing(self):
        df = pd.DataFrame({
            "household_id": ["HH001", "HH002", "HH003"],
            "target_month": ["2024-03-01", "2024-03-01", "2024-03-01"],
            "electricity_t_minus_2": [100, np.nan, 120],
            "electricity_t_minus_1": [110, 120, 130],
        })
        cleaned, report = clean_dataframe(df, impute_missing=True, drop_errors=False)
        assert not cleaned["electricity_t_minus_2"].isna().any()
        # Check imputation happened (median of [100, 120] = 110)
        assert cleaned.loc[1, "electricity_t_minus_2"] == 110.0
        assert any(i.code == "MISSING_IMPUTED" for i in report.issues)


class TestValidateInferenceRequest:
    """Tests for API request validation."""

    def test_valid_request(self):
        req = InferenceRequest(
            electricity_t_minus_2=100,
            electricity_t_minus_1=110,
            target_month_num=3,
        )
        report = validate_inference_request(req)
        assert not report.has_errors()

    def test_invalid_request_negative(self):
        # Pydantic validates on construction - verify it raises
        with pytest.raises(PydanticValidationError):
            InferenceRequest(
                electricity_t_minus_2=-10,
                electricity_t_minus_1=110,
                target_month_num=3,
            )

    def test_validate_inference_request_valid(self):
        req = InferenceRequest(
            electricity_t_minus_2=100,
            electricity_t_minus_1=110,
            target_month_num=3,
        )
        report = validate_inference_request(req)
        assert not report.has_errors()


class TestValidationConfig:
    """Tests for configurable validation."""

    def test_custom_config(self):
        config = ValidationConfig(
            max_consumption=5000,
            iqr_multiplier=1.5,
        )
        df = pd.DataFrame({
            "household_id": ["HH001"],
            "target_month": ["2024-03-01"],
            "electricity_t_minus_2": [6000],  # Exceeds custom max
            "electricity_t_minus_1": [110],
        })
        report = validate_dataframe(df, config=config)
        assert report.has_warnings()
        assert any(i.code == "EXCESSIVE_CONSUMPTION" for i in report.get_warnings())


if __name__ == "__main__":
    pytest.main([__file__, "-v"])