"""
CarbonIQ Data Validation Pipeline

Defines the canonical input schema for household electricity consumption data,
validation rules, and preprocessing steps. Used by both training and inference
to guarantee identical data contracts.

Version: 1.0.0
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any, Optional

import numpy as np
import pandas as pd
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ValidationSeverity(str, Enum):
    """Severity levels for validation issues."""
    ERROR = "error"       # Blocks processing - data cannot be used
    WARNING = "warning"   # Data usable but quality concern noted
    INFO = "info"         # Informational - no action required


@dataclass(frozen=True)
class ValidationIssue:
    """A single validation finding."""
    severity: ValidationSeverity
    code: str
    message: str
    column: Optional[str] = None
    row_indices: Optional[list[int]] = None
    details: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "severity": self.severity.value,
            "code": self.code,
            "message": self.message,
            "column": self.column,
            "row_indices": self.row_indices,
            "details": self.details,
        }


@dataclass
class ValidationReport:
    """Complete validation report for a dataset."""
    issues: list[ValidationIssue] = field(default_factory=list)
    rows_validated: int = 0
    columns_validated: list[str] = field(default_factory=list)
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
    schema_version: str = "1.0.0"

    def add_issue(self, issue: ValidationIssue) -> None:
        self.issues.append(issue)

    def has_errors(self) -> bool:
        return any(i.severity == ValidationSeverity.ERROR for i in self.issues)

    def has_warnings(self) -> bool:
        return any(i.severity == ValidationSeverity.WARNING for i in self.issues)

    def get_errors(self) -> list[ValidationIssue]:
        return [i for i in self.issues if i.severity == ValidationSeverity.ERROR]

    def get_warnings(self) -> list[ValidationIssue]:
        return [i for i in self.issues if i.severity == ValidationSeverity.WARNING]

    def to_dict(self) -> dict[str, Any]:
        return {
            "schema_version": self.schema_version,
            "timestamp": self.timestamp,
            "rows_validated": self.rows_validated,
            "columns_validated": self.columns_validated,
            "summary": {
                "errors": len(self.get_errors()),
                "warnings": len(self.get_warnings()),
                "info": len([i for i in self.issues if i.severity == ValidationSeverity.INFO]),
            },
            "issues": [i.to_dict() for i in self.issues],
        }

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)


# ──────────────────────────────────────────────────────────────────────
# Canonical Input Schema
# ──────────────────────────────────────────────────────────────────────

class ElectricityRecord(BaseModel):
    """
    Single household electricity consumption record for forecasting.

    This is the canonical schema used by both training pipeline and inference API.
    All fields are required unless marked optional.
    """
    model_config = ConfigDict(
        extra="forbid",
        validate_assignment=True,
        ser_json_timedelta="iso8601",
    )

    # Core identification
    household_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Unique household identifier (string to support any format)",
    )

    # Timestamp of the target month being predicted (ISO 8601, first day of month)
    target_month: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Target month in YYYY-MM-DD format (day must be 01)",
    )

    # Historical consumption (kWh) - two prior consecutive months
    electricity_t_minus_2: float = Field(
        ...,
        ge=0.0,
        le=10000.0,
        description="Electricity consumption 2 months prior to target (kWh)",
    )
    electricity_t_minus_1: float = Field(
        ...,
        ge=0.0,
        le=10000.0,
        description="Electricity consumption 1 month prior to target (kWh)",
    )

    # Optional: actual target consumption (for training/evaluation only)
    electricity_target: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=10000.0,
        description="Actual electricity consumption for target month (kWh) - training only",
    )

    # Optional household characteristics (for future feature enrichment)
    adults: Optional[int] = Field(default=None, ge=0, le=20)
    children: Optional[int] = Field(default=None, ge=0, le=20)
    seniors: Optional[int] = Field(default=None, ge=0, le=20)
    rooms: Optional[int] = Field(default=None, ge=1, le=50)
    income: Optional[float] = Field(default=None, ge=0.0)

    @field_validator("target_month")
    @classmethod
    def validate_target_month(cls, v: str) -> str:
        try:
            dt = datetime.strptime(v, "%Y-%m-%d")
            if dt.day != 1:
                raise ValueError("target_month must be the first day of the month (DD=01)")
            if not (1 <= dt.month <= 12):
                raise ValueError("Invalid month")
        except ValueError as e:
            if "first day" in str(e) or "Invalid month" in str(e):
                raise
            raise ValueError("target_month must be in YYYY-MM-DD format")
        return v

    @model_validator(mode="after")
    def validate_consecutive_months(self) -> ElectricityRecord:
        """Ensure t-2 and t-1 are chronologically before target_month."""
        target_dt = datetime.strptime(self.target_month, "%Y-%m-%d")
        # We can't fully validate without the actual month values of t-2, t-1,
        # but we can at least ensure target is reasonable
        if target_dt.year < 2010 or target_dt.year > 2030:
            warnings.warn(
                f"target_month year {target_dt.year} outside expected range [2010, 2030]",
                UserWarning,
                stacklevel=2,
            )
        return self

    def target_month_num(self) -> int:
        """Extract month number (1-12) for model input."""
        return datetime.strptime(self.target_month, "%Y-%m-%d").month


class InferenceRequest(BaseModel):
    """
    Request schema for the /forecast API endpoint.
    Minimal fields required for prediction (no household_id, no target).
    """
    model_config = ConfigDict(extra="forbid")

    electricity_t_minus_2: float = Field(..., ge=0.0, le=10000.0)
    electricity_t_minus_1: float = Field(..., ge=0.0, le=10000.0)
    target_month_num: int = Field(..., ge=1, le=12)

    def to_electricity_record(self, household_id: str = "api_request") -> ElectricityRecord:
        """Convert to full record with synthetic target_month for validation."""
        # Construct a target_month from month_num (use current year as default)
        year = datetime.now(timezone.utc).year
        target_month = f"{year}-{self.target_month_num:02d}-01"
        return ElectricityRecord(
            household_id=household_id,
            target_month=target_month,
            electricity_t_minus_2=self.electricity_t_minus_2,
            electricity_t_minus_1=self.electricity_t_minus_1,
        )


# ──────────────────────────────────────────────────────────────────────
# Validation Rules Configuration
# ──────────────────────────────────────────────────────────────────────

@dataclass(frozen=True)
class ValidationConfig:
    """Configurable validation thresholds."""
    # Consumption bounds (kWh/month)
    min_consumption: float = 0.0
    max_consumption: float = 10000.0

    # Outlier detection (IQR multiplier)
    iqr_multiplier: float = 3.0

    # Missing value thresholds
    max_missing_fraction: float = 0.1  # 10% missing allowed per column

    # Consecutive months check
    require_consecutive: bool = True

    # Household ID
    require_household_id: bool = True


DEFAULT_CONFIG = ValidationConfig()


# ──────────────────────────────────────────────────────────────────────
# Core Validation Functions
# ──────────────────────────────────────────────────────────────────────

def validate_dataframe(
    df: pd.DataFrame,
    config: ValidationConfig = DEFAULT_CONFIG,
    is_training: bool = False,
) -> ValidationReport:
    """
    Validate a DataFrame against the canonical electricity schema.

    Args:
        df: Input DataFrame with electricity consumption data
        config: Validation configuration
        is_training: If True, require electricity_target column

    Returns:
        ValidationReport with all issues found
    """
    report = ValidationReport()
    report.rows_validated = len(df)
    report.columns_validated = list(df.columns)

    if df.empty:
        report.add_issue(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code="EMPTY_DATAFRAME",
            message="Input DataFrame is empty",
        ))
        return report

    # 1. Required columns check
    required_cols = [
        "household_id",
        "target_month",
        "electricity_t_minus_2",
        "electricity_t_minus_1",
    ]
    if is_training:
        required_cols.append("electricity_target")

    missing_cols = [c for c in required_cols if c not in df.columns]
    if missing_cols:
        report.add_issue(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code="MISSING_REQUIRED_COLUMNS",
            message=f"Missing required columns: {missing_cols}",
            details={"missing_columns": missing_cols, "required_columns": required_cols},
        ))
        # Can't continue validation without required columns
        return report

    # 2. Data type validation
    _validate_dtypes(df, report)

    # 3. Missing value analysis
    _validate_missing_values(df, config, report)

    # 4. Value range validation
    _validate_ranges(df, config, report)

    # 5. Outlier detection
    _validate_outliers(df, config, report)

    # 6. Temporal consistency
    _validate_temporal_consistency(df, config, report)

    # 7. Household ID validation
    _validate_household_ids(df, config, report)

    # 8. Consecutive months check (if we have the month columns)
    if config.require_consecutive:
        _validate_consecutive_months(df, report)

    return report


def _validate_dtypes(df: pd.DataFrame, report: ValidationReport) -> None:
    """Check column data types match expectations."""
    expected_types = {
        "household_id": "object",
        "target_month": "object",
        "electricity_t_minus_2": "float64",
        "electricity_t_minus_1": "float64",
        "electricity_target": "float64",
        "adults": "int64",
        "children": "int64",
        "seniors": "int64",
        "rooms": "int64",
        "income": "float64",
    }

    for col, expected in expected_types.items():
        if col not in df.columns:
            continue
        actual = str(df[col].dtype)
        if expected.startswith("int") and not np.issubdtype(df[col].dtype, np.integer):
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                code="TYPE_MISMATCH",
                message=f"Column '{col}' expected integer type, got {actual}",
                column=col,
                details={"expected": expected, "actual": actual},
            ))
        elif expected.startswith("float") and not np.issubdtype(df[col].dtype, np.floating):
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                code="TYPE_MISMATCH",
                message=f"Column '{col}' expected float type, got {actual}",
                column=col,
                details={"expected": expected, "actual": actual},
            ))


def _validate_missing_values(df: pd.DataFrame, config: ValidationConfig, report: ValidationReport) -> None:
    """Check for missing values in critical columns."""
    critical_cols = ["household_id", "target_month", "electricity_t_minus_2", "electricity_t_minus_1"]

    for col in critical_cols:
        if col not in df.columns:
            continue
        missing_count = df[col].isna().sum()
        missing_frac = missing_count / len(df)

        if missing_count > 0:
            severity = ValidationSeverity.ERROR if missing_frac > config.max_missing_fraction else ValidationSeverity.WARNING
            report.add_issue(ValidationIssue(
                severity=severity,
                code="MISSING_VALUES",
                message=f"Column '{col}' has {missing_count} missing values ({missing_frac:.1%})",
                column=col,
                row_indices=df[df[col].isna()].index.tolist(),
                details={"missing_count": int(missing_count), "missing_fraction": missing_frac},
            ))


def _validate_ranges(df: pd.DataFrame, config: ValidationConfig, report: ValidationReport) -> None:
    """Validate consumption values are within physical bounds."""
    consumption_cols = ["electricity_t_minus_2", "electricity_t_minus_1"]
    if "electricity_target" in df.columns:
        consumption_cols.append("electricity_target")

    for col in consumption_cols:
        if col not in df.columns:
            continue

        # Negative values
        neg_mask = df[col] < config.min_consumption
        if neg_mask.any():
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.ERROR,
                code="NEGATIVE_CONSUMPTION",
                message=f"Column '{col}' has {neg_mask.sum()} negative values",
                column=col,
                row_indices=df[neg_mask].index.tolist(),
                details={"count": int(neg_mask.sum())},
            ))

        # Excessive values
        high_mask = df[col] > config.max_consumption
        if high_mask.any():
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                code="EXCESSIVE_CONSUMPTION",
                message=f"Column '{col}' has {high_mask.sum()} values exceeding {config.max_consumption} kWh",
                column=col,
                row_indices=df[high_mask].index.tolist(),
                details={"count": int(high_mask.sum()), "max_allowed": config.max_consumption},
            ))


def _validate_outliers(df: pd.DataFrame, config: ValidationConfig, report: ValidationReport) -> None:
    """Detect statistical outliers using IQR method."""
    consumption_cols = ["electricity_t_minus_2", "electricity_t_minus_1"]
    if "electricity_target" in df.columns:
        consumption_cols.append("electricity_target")

    for col in consumption_cols:
        if col not in df.columns:
            continue

        vals = df[col].dropna()
        if len(vals) < 4:
            continue

        q1 = vals.quantile(0.25)
        q3 = vals.quantile(0.75)
        iqr = q3 - q1

        if iqr == 0:
            continue

        lower = q1 - config.iqr_multiplier * iqr
        upper = q3 + config.iqr_multiplier * iqr

        outlier_mask = (df[col] < lower) | (df[col] > upper)
        if outlier_mask.any():
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                code="STATISTICAL_OUTLIER",
                message=f"Column '{col}' has {outlier_mask.sum()} statistical outliers (IQR × {config.iqr_multiplier})",
                column=col,
                row_indices=df[outlier_mask].index.tolist(),
                details={
                    "count": int(outlier_mask.sum()),
                    "q1": float(q1),
                    "q3": float(q3),
                    "iqr": float(iqr),
                    "lower_bound": float(lower),
                    "upper_bound": float(upper),
                },
            ))


def _validate_temporal_consistency(df: pd.DataFrame, config: ValidationConfig, report: ValidationReport) -> None:
    """Validate target_month format and reasonable date ranges."""
    if "target_month" not in df.columns:
        return

    # Check format
    invalid_format = []
    valid_years = []
    for idx, val in df["target_month"].items():
        if pd.isna(val):
            continue
        try:
            dt = datetime.strptime(str(val), "%Y-%m-%d")
            if dt.day != 1:
                invalid_format.append(idx)
            else:
                valid_years.append(dt.year)
        except (ValueError, TypeError):
            invalid_format.append(idx)

    if invalid_format:
        report.add_issue(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code="INVALID_DATE_FORMAT",
            message=f"target_month has {len(invalid_format)} invalid format entries (expected YYYY-MM-01)",
            column="target_month",
            row_indices=invalid_format,
        ))

    # Check year range (only for valid dates)
    if valid_years:
        min_year = min(valid_years)
        max_year = max(valid_years)
        if min_year < 2010 or max_year > 2030:
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                code="DATE_RANGE_UNUSUAL",
                message=f"target_month years outside typical range [2010, 2030]: [{min_year}, {max_year}]",
                column="target_month",
                details={"min_year": min_year, "max_year": max_year},
            ))


def _validate_household_ids(df: pd.DataFrame, config: ValidationConfig, report: ValidationReport) -> None:
    """Validate household_id column."""
    if "household_id" not in df.columns:
        return

    # Empty strings
    empty_mask = df["household_id"].astype(str).str.strip() == ""
    if empty_mask.any():
        report.add_issue(ValidationIssue(
            severity=ValidationSeverity.ERROR,
            code="EMPTY_HOUSEHOLD_ID",
            message=f"Found {empty_mask.sum()} empty household_id values",
            column="household_id",
            row_indices=df[empty_mask].index.tolist(),
        ))

    # Duplicates in training data (same household, same target month)
    if config.require_household_id and "target_month" in df.columns:
        dup_mask = df.duplicated(subset=["household_id", "target_month"], keep=False)
        if dup_mask.any():
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                code="DUPLICATE_HOUSEHOLD_MONTH",
                message=f"Found {dup_mask.sum()} duplicate (household_id, target_month) pairs",
                column="household_id",
                row_indices=df[dup_mask].index.tolist(),
            ))


def _validate_consecutive_months(df: pd.DataFrame, report: ValidationReport) -> None:
    """
    Validate that t-2, t-1, target form consecutive months.
    This requires parsing the month from column names or having explicit month columns.
    """
    # This is a placeholder - full implementation needs the actual month identifiers
    # For now, we just check target_month is parsable
    pass


# ──────────────────────────────────────────────────────────────────────
# Data Cleaning / Preprocessing
# ──────────────────────────────────────────────────────────────────────

def clean_dataframe(
    df: pd.DataFrame,
    config: ValidationConfig = DEFAULT_CONFIG,
    drop_errors: bool = True,
    impute_missing: bool = False,
) -> tuple[pd.DataFrame, ValidationReport]:
    """
    Clean a DataFrame by applying validation and optional fixes.

    Args:
        df: Input DataFrame
        config: Validation configuration
        drop_errors: If True, drop rows with ERROR-level issues
        impute_missing: If True, impute missing consumption with column median

    Returns:
        Tuple of (cleaned DataFrame, ValidationReport)
    """
    report = validate_dataframe(df, config)

    if report.has_errors() and drop_errors:
        # Collect row indices from all errors
        error_rows = set()
        for issue in report.get_errors():
            if issue.row_indices:
                error_rows.update(issue.row_indices)

        if error_rows:
            df = df.drop(index=list(error_rows)).reset_index(drop=True)
            report.add_issue(ValidationIssue(
                severity=ValidationSeverity.INFO,
                code="ROWS_DROPPED",
                message=f"Dropped {len(error_rows)} rows with validation errors",
                details={"dropped_count": len(error_rows)},
            ))

    if impute_missing:
        consumption_cols = ["electricity_t_minus_2", "electricity_t_minus_1"]
        if "electricity_target" in df.columns:
            consumption_cols.append("electricity_target")

        for col in consumption_cols:
            if col in df.columns and df[col].isna().any():
                median_val = df[col].median()
                df[col] = df[col].fillna(median_val)
                report.add_issue(ValidationIssue(
                    severity=ValidationSeverity.INFO,
                    code="MISSING_IMPUTED",
                    message=f"Imputed missing values in '{col}' with median ({median_val:.2f})",
                    column=col,
                    details={"imputed_value": float(median_val)},
                ))

    return df, report


# ──────────────────────────────────────────────────────────────────────
# Schema Export / Documentation
# ──────────────────────────────────────────────────────────────────────

def export_schema_json(path: Path | str, version: str = "1.0.0") -> None:
    """Export the canonical schema as JSON Schema for external consumers."""
    schema = ElectricityRecord.model_json_schema()
    schema["$schema"] = "https://json-schema.org/draft/2020-12/schema#"
    schema["title"] = "CarbonIQ ElectricityRecord"
    schema["version"] = version
    schema["description"] = "Canonical input schema for household electricity forecasting"

    Path(path).write_text(json.dumps(schema, indent=2))


def export_schema_markdown(path: Path | str, version: str = "1.0.0") -> None:
    """Export human-readable schema documentation."""
    lines = [
        f"# CarbonIQ Data Schema v{version}",
        "",
        "## ElectricityRecord",
        "",
        "Canonical input schema for household electricity consumption forecasting.",
        "Used by both training pipeline and inference API.",
        "",
        "| Field | Type | Required | Constraints | Description |",
        "|-------|------|----------|-------------|-------------|",
    ]

    for field_name, field_info in ElectricityRecord.model_fields.items():
        required = "Yes" if field_info.is_required() else "No"
        constraints = []
        if field_info.metadata:
            for meta in field_info.metadata:
                if hasattr(meta, "__dict__"):
                    for k, v in meta.__dict__.items():
                        if v is not None:
                            constraints.append(f"{k}={v}")
        lines.append(f"| {field_name} | {field_info.annotation} | {required} | {', '.join(constraints) or '-'} | {field_info.description or '-'} |")

    lines.extend([
        "",
        "## InferenceRequest",
        "",
        "Minimal schema for the `/forecast` API endpoint.",
        "",
        "| Field | Type | Required | Constraints | Description |",
        "|-------|------|----------|-------------|-------------|",
    ])

    for field_name, field_info in InferenceRequest.model_fields.items():
        required = "Yes" if field_info.is_required() else "No"
        constraints = []
        if field_info.metadata:
            for meta in field_info.metadata:
                if hasattr(meta, "__dict__"):
                    for k, v in meta.__dict__.items():
                        if v is not None:
                            constraints.append(f"{k}={v}")
        lines.append(f"| {field_name} | {field_info.annotation} | {required} | {', '.join(constraints) or '-'} | {field_info.description or '-'} |")

    Path(path).write_text("\n".join(lines))


# ──────────────────────────────────────────────────────────────────────
# Convenience: Validate single record (for API use)
# ──────────────────────────────────────────────────────────────────────

def validate_inference_request(request: InferenceRequest) -> ValidationReport:
    """Validate a single inference request."""
    # Convert to DataFrame for unified validation
    df = pd.DataFrame([{
        "household_id": "api_request",
        "target_month": f"{datetime.now(timezone.utc).year}-{request.target_month_num:02d}-01",
        "electricity_t_minus_2": request.electricity_t_minus_2,
        "electricity_t_minus_1": request.electricity_t_minus_1,
    }])
    return validate_dataframe(df, is_training=False)


if __name__ == "__main__":
    # Demo: export schema documentation
    export_schema_markdown("data_schema.md")
    export_schema_json("data_schema.json")
    print("Schema documentation exported to data_schema.md and data_schema.json")