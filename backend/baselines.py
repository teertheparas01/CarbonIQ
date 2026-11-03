"""
CarbonIQ Baseline Forecasting Models

Simple, interpretable baseline models for electricity consumption forecasting.
Used to establish a performance floor before evaluating complex ML models.

Version: 1.0.0
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


@dataclass(frozen=True)
class ModelMetrics:
    """Standard regression metrics."""
    mae: float
    rmse: float
    r2: float
    mape: Optional[float] = None
    bias: Optional[float] = None  # Mean prediction error (positive = overprediction)

    def to_dict(self) -> dict[str, Any]:
        return {
            "MAE_kWh": round(self.mae, 4),
            "RMSE_kWh": round(self.rmse, 4),
            "R2": round(self.r2, 4),
            "MAPE_pct": round(self.mape, 2) if self.mape is not None else None,
            "Bias_kWh": round(self.bias, 4) if self.bias is not None else None,
        }

    @classmethod
    def from_predictions(cls, y_true: np.ndarray, y_pred: np.ndarray) -> ModelMetrics:
        """Compute all metrics from true and predicted values."""
        y_true = np.asarray(y_true, dtype=float)
        y_pred = np.asarray(y_pred, dtype=float)

        # Filter valid predictions
        mask = np.isfinite(y_true) & np.isfinite(y_pred)
        y_true = y_true[mask]
        y_pred = y_pred[mask]

        if len(y_true) == 0:
            return cls(mae=float('nan'), rmse=float('nan'), r2=float('nan'))

        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        r2 = r2_score(y_true, y_pred) if len(y_true) > 1 else float('nan')

        # MAPE (avoid division by zero)
        mape = None
        if np.all(y_true != 0):
            mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

        # Bias (mean error)
        bias = float(np.mean(y_pred - y_true))

        return cls(mae=mae, rmse=rmse, r2=r2, mape=mape, bias=bias)


@dataclass
class BaselineResult:
    """Result of a baseline model evaluation."""
    model_name: str
    metrics: ModelMetrics
    predictions: np.ndarray
    training_time_sec: float = 0.0
    parameters: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "model_name": self.model_name,
            "metrics": self.metrics.to_dict(),
            "training_time_sec": round(self.training_time_sec, 4),
            "parameters": self.parameters,
            "n_predictions": len(self.predictions),
        }


# ──────────────────────────────────────────────────────────────────────
# Baseline Models
# ──────────────────────────────────────────────────────────────────────

class NaivePersistence:
    """
    Naive persistence baseline: predict the most recent observation (t-1).

    This is the simplest possible forecast - "tomorrow will be like today".
    For monthly data: predict this month = last month.
    """

    def __init__(self):
        self.is_fitted = False

    def fit(self, X: pd.DataFrame, y: pd.Series) -> NaivePersistence:
        """No training needed - just mark as fitted."""
        self.is_fitted = True
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """Predict using t-1 (electricity_t_minus_1 column)."""
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before prediction")
        if "electricity_t_minus_1" not in X.columns:
            raise ValueError("X must contain 'electricity_t_minus_1' column")
        return X["electricity_t_minus_1"].to_numpy(dtype=float)


class SeasonalNaive:
    """
    Seasonal naive baseline: predict using historical average for the same month.

    For monthly data with seasonality: predict January = average of all past Januarys.
    Requires target_month_num column in training data.
    """

    def __init__(self):
        self.seasonal_averages: dict[int, float] = {}
        self.global_mean: float = 0.0
        self.is_fitted = False

    def fit(self, X: pd.DataFrame, y: pd.Series) -> SeasonalNaive:
        """Compute average consumption per month number."""
        if "target_month_num" not in X.columns:
            raise ValueError("X must contain 'target_month_num' column for seasonal naive")

        df = X.copy()
        df["target"] = y

        # Compute mean per month
        self.seasonal_averages = df.groupby("target_month_num")["target"].mean().to_dict()
        self.global_mean = float(y.mean())
        self.is_fitted = True
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """Predict using seasonal average for each target month."""
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before prediction")
        if "target_month_num" not in X.columns:
            raise ValueError("X must contain 'target_month_num' column")

        preds = []
        for _, row in X.iterrows():
            month = int(row["target_month_num"])
            preds.append(self.seasonal_averages.get(month, self.global_mean))
        return np.array(preds, dtype=float)


class LinearTrend:
    """
    Simple linear trend baseline: extrapolate from t-2 and t-1.

    Prediction = t-1 + (t-1 - t-2) = 2*t-1 - t-2
    Assumes constant month-over-month change.
    """

    def __init__(self):
        self.is_fitted = False

    def fit(self, X: pd.DataFrame, y: pd.Series) -> LinearTrend:
        self.is_fitted = True
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """Predict using linear extrapolation from two prior months."""
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before prediction")
        required = ["electricity_t_minus_2", "electricity_t_minus_1"]
        for col in required:
            if col not in X.columns:
                raise ValueError(f"X must contain '{col}' column")

        t_minus_2 = X["electricity_t_minus_2"].to_numpy(dtype=float)
        t_minus_1 = X["electricity_t_minus_1"].to_numpy(dtype=float)
        return 2 * t_minus_1 - t_minus_2


class MeanBaseline:
    """
    Global mean baseline: predict the overall average consumption.

    Simplest possible model - ignores all features.
    """

    def __init__(self):
        self.global_mean: float = 0.0
        self.is_fitted = False

    def fit(self, X: pd.DataFrame, y: pd.Series) -> MeanBaseline:
        self.global_mean = float(y.mean())
        self.is_fitted = True
        return self

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before prediction")
        return np.full(len(X), self.global_mean, dtype=float)


# ──────────────────────────────────────────────────────────────────────
# Evaluation Framework
# ──────────────────────────────────────────────────────────────────────

@dataclass
class BenchmarkConfig:
    """Configuration for benchmark evaluation."""
    models_to_test: list[str] = field(default_factory=lambda: [
        "mean",
        "naive_persistence",
        "seasonal_naive",
        "linear_trend",
    ])
    random_state: int = 42


DEFAULT_BENCHMARK_CONFIG = BenchmarkConfig()


MODEL_REGISTRY = {
    "mean": MeanBaseline,
    "naive_persistence": NaivePersistence,
    "seasonal_naive": SeasonalNaive,
    "linear_trend": LinearTrend,
}


def evaluate_baseline(
    model_name: str,
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> BaselineResult:
    """
    Train and evaluate a single baseline model.

    Args:
        model_name: Key from MODEL_REGISTRY
        X_train, y_train: Training data
        X_test, y_test: Test data

    Returns:
        BaselineResult with metrics and predictions
    """
    if model_name not in MODEL_REGISTRY:
        raise ValueError(f"Unknown model: {model_name}. Available: {list(MODEL_REGISTRY.keys())}")

    model_class = MODEL_REGISTRY[model_name]
    model = model_class()

    import time
    start = time.perf_counter()
    model.fit(X_train, y_train)
    training_time = time.perf_counter() - start

    start = time.perf_counter()
    predictions = model.predict(X_test)
    inference_time = time.perf_counter() - start

    metrics = ModelMetrics.from_predictions(y_test.to_numpy(), predictions)

    return BaselineResult(
        model_name=model_name,
        metrics=metrics,
        predictions=predictions,
        training_time_sec=training_time,
        parameters={"inference_time_sec": round(inference_time, 6)},
    )


def run_benchmark(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series,
    config: BenchmarkConfig = DEFAULT_BENCHMARK_CONFIG,
) -> dict[str, BaselineResult]:
    """
    Run all baseline models and return results.

    Returns:
        Dict mapping model_name -> BaselineResult
    """
    results = {}
    for model_name in config.models_to_test:
        print(f"Evaluating {model_name}...")
        results[model_name] = evaluate_baseline(
            model_name, X_train, y_train, X_test, y_test
        )
    return results


def benchmark_summary(results: dict[str, BaselineResult]) -> pd.DataFrame:
    """Create a comparison DataFrame from benchmark results."""
    rows = []
    for name, result in results.items():
        row = {"Model": name}
        row.update(result.metrics.to_dict())
        row["TrainingTime_sec"] = result.training_time_sec
        rows.append(row)
    df = pd.DataFrame(rows)
    return df.sort_values("MAE_kWh").reset_index(drop=True)


def print_benchmark(results: dict[str, BaselineResult]) -> None:
    """Print formatted benchmark results."""
    df = benchmark_summary(results)
    print("\n" + "=" * 80)
    print("BASELINE MODEL BENCHMARK RESULTS")
    print("=" * 80)
    print(df.to_string(index=False, float_format=lambda x: f"{x:.4f}" if isinstance(x, float) else x))
    print("=" * 80)


# ──────────────────────────────────────────────────────────────────────
# Integration with CarbonIQ Data Format
# ──────────────────────────────────────────────────────────────────────

def prepare_data_for_baselines(
    df: pd.DataFrame,
    target_col: str = "electricity_target",
    feature_cols: Optional[list[str]] = None,
) -> tuple[pd.DataFrame, pd.Series]:
    """
    Prepare DataFrame for baseline evaluation.

    Args:
        df: DataFrame with electricity data (from data_validation)
        target_col: Target column name
        feature_cols: Feature columns to keep (None = all except target)

    Returns:
        (X, y) tuple ready for baseline models
    """
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found")

    if feature_cols is None:
        feature_cols = [c for c in df.columns if c != target_col]

    X = df[feature_cols].copy()
    y = df[target_col].copy()

    return X, y


def save_benchmark_results(
    results: dict[str, BaselineResult],
    path: Path | str,
    metadata: Optional[dict] = None,
) -> None:
    """Save benchmark results to JSON."""
    path = Path(path)
    output = {
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "results": {name: res.to_dict() for name, res in results.items()},
        "metadata": metadata or {},
    }
    path.write_text(json.dumps(output, indent=2))
    print(f"Benchmark results saved to {path}")


# ──────────────────────────────────────────────────────────────────────
# CLI / Demo
# ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Quick demo with synthetic data
    np.random.seed(42)
    n = 1000

    # Generate synthetic seasonal data
    months = np.random.randint(1, 13, n)
    base_consumption = 100 + 20 * np.sin(2 * np.pi * months / 12)  # Seasonal pattern
    noise = np.random.normal(0, 15, n)

    # Create lag features
    t_minus_2 = base_consumption + noise
    t_minus_1 = base_consumption + noise + np.random.normal(0, 5, n)
    target = base_consumption + noise + np.random.normal(0, 10, n)

    df = pd.DataFrame({
        "electricity_t_minus_2": np.maximum(t_minus_2, 0),
        "electricity_t_minus_1": np.maximum(t_minus_1, 0),
        "target_month_num": months,
        "electricity_target": np.maximum(target, 0),
    })

    # Split
    split = int(0.8 * n)
    train_df = df.iloc[:split]
    test_df = df.iloc[split:]

    X_train, y_train = prepare_data_for_baselines(train_df)
    X_test, y_test = prepare_data_for_baselines(test_df)

    # Run benchmark
    results = run_benchmark(X_train, y_train, X_test, y_test)
    print_benchmark(results)

    # Save
    save_benchmark_results(results, "baseline_benchmark.json")