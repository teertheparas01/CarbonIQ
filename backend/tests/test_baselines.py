"""
Tests for the CarbonIQ baseline forecasting models.
"""

import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
import pandas as pd
import numpy as np
from baselines import (
    NaivePersistence,
    SeasonalNaive,
    LinearTrend,
    MeanBaseline,
    ModelMetrics,
    BaselineResult,
    evaluate_baseline,
    run_benchmark,
    benchmark_summary,
    prepare_data_for_baselines,
    MODEL_REGISTRY,
)


class TestNaivePersistence:
    """Tests for NaivePersistence baseline."""

    def test_fit_predict(self):
        X_train = pd.DataFrame({"electricity_t_minus_1": [100, 110, 120]})
        y_train = pd.Series([105, 115, 125])
        X_test = pd.DataFrame({"electricity_t_minus_1": [130, 140]})

        model = NaivePersistence().fit(X_train, y_train)
        preds = model.predict(X_test)

        assert np.array_equal(preds, [130, 140])

    def test_requires_t_minus_1(self):
        model = NaivePersistence().fit(
            pd.DataFrame({"electricity_t_minus_1": [100]}),
            pd.Series([100])
        )
        with pytest.raises(ValueError, match="electricity_t_minus_1"):
            model.predict(pd.DataFrame({"other_col": [100]}))


class TestSeasonalNaive:
    """Tests for SeasonalNaive baseline."""

    def test_fit_predict(self):
        X_train = pd.DataFrame({
            "target_month_num": [1, 1, 2, 2, 3, 3],
            "electricity_t_minus_1": [100, 110, 200, 210, 150, 160],
        })
        y_train = pd.Series([105, 115, 205, 215, 155, 165])
        X_test = pd.DataFrame({"target_month_num": [1, 2, 3, 4]})

        model = SeasonalNaive().fit(X_train, y_train)
        preds = model.predict(X_test)

        # Month 1 avg: (105+115)/2 = 110
        # Month 2 avg: (205+215)/2 = 210
        # Month 3 avg: (155+165)/2 = 160
        # Month 4: global mean
        assert preds[0] == 110
        assert preds[1] == 210
        assert preds[2] == 160
        assert preds[3] == pytest.approx(160, abs=1)  # global mean

    def test_requires_target_month_num(self):
        model = SeasonalNaive().fit(
            pd.DataFrame({"target_month_num": [1], "electricity_t_minus_1": [100]}),
            pd.Series([100])
        )
        with pytest.raises(ValueError, match="target_month_num"):
            model.predict(pd.DataFrame({"electricity_t_minus_1": [100]}))


class TestLinearTrend:
    """Tests for LinearTrend baseline."""

    def test_fit_predict(self):
        X_train = pd.DataFrame({
            "electricity_t_minus_2": [100, 110],
            "electricity_t_minus_1": [110, 120],
        })
        y_train = pd.Series([120, 130])
        X_test = pd.DataFrame({
            "electricity_t_minus_2": [120],
            "electricity_t_minus_1": [130],
        })

        model = LinearTrend().fit(X_train, y_train)
        preds = model.predict(X_test)

        # 2*130 - 120 = 140
        assert preds[0] == 140


class TestMeanBaseline:
    """Tests for MeanBaseline."""

    def test_fit_predict(self):
        X_train = pd.DataFrame({"electricity_t_minus_1": [100, 200, 300]})
        y_train = pd.Series([100, 200, 300])
        X_test = pd.DataFrame({"electricity_t_minus_1": [400, 500]})

        model = MeanBaseline().fit(X_train, y_train)
        preds = model.predict(X_test)

        # Mean = 200
        assert np.all(preds == 200)


class TestModelMetrics:
    """Tests for ModelMetrics computation."""

    def test_perfect_prediction(self):
        y_true = np.array([100, 200, 300])
        y_pred = np.array([100, 200, 300])
        metrics = ModelMetrics.from_predictions(y_true, y_pred)
        assert metrics.mae == 0
        assert metrics.rmse == 0
        assert metrics.r2 == 1.0
        assert metrics.bias == 0

    def test_constant_bias(self):
        y_true = np.array([100, 200, 300])
        y_pred = np.array([110, 210, 310])  # +10 bias
        metrics = ModelMetrics.from_predictions(y_true, y_pred)
        assert metrics.mae == 10
        assert metrics.bias == 10

    def test_mape_calculation(self):
        y_true = np.array([100, 200])
        y_pred = np.array([110, 190])  # 10% and 5% error
        metrics = ModelMetrics.from_predictions(y_true, y_pred)
        assert metrics.mape == pytest.approx(7.5, abs=0.1)

    def test_handles_nan(self):
        y_true = np.array([100, np.nan, 300])
        y_pred = np.array([110, 200, 310])
        metrics = ModelMetrics.from_predictions(y_true, y_pred)
        assert np.isfinite(metrics.mae)
        assert metrics.mae == pytest.approx(10, abs=0.1)


class TestEvaluateBaseline:
    """Tests for evaluate_baseline function."""

    def make_data(self):
        np.random.seed(42)
        n = 100
        months = np.random.randint(1, 13, n)
        base = 100 + 20 * np.sin(2 * np.pi * months / 12)
        noise = np.random.normal(0, 10, n)

        df = pd.DataFrame({
            "electricity_t_minus_2": np.maximum(base + noise, 0),
            "electricity_t_minus_1": np.maximum(base + noise + np.random.normal(0, 5, n), 0),
            "target_month_num": months,
            "electricity_target": np.maximum(base + noise + np.random.normal(0, 8, n), 0),
        })
        return df

    def test_evaluate_naive_persistence(self):
        df = self.make_data()
        split = int(0.8 * len(df))
        train_df = df.iloc[:split]
        test_df = df.iloc[split:]

        X_train, y_train = prepare_data_for_baselines(train_df)
        X_test, y_test = prepare_data_for_baselines(test_df)

        result = evaluate_baseline("naive_persistence", X_train, y_train, X_test, y_test)

        assert isinstance(result, BaselineResult)
        assert result.model_name == "naive_persistence"
        assert np.isfinite(result.metrics.mae)
        assert len(result.predictions) == len(y_test)

    def test_evaluate_seasonal_naive(self):
        df = self.make_data()
        split = int(0.8 * len(df))
        train_df = df.iloc[:split]
        test_df = df.iloc[split:]

        X_train, y_train = prepare_data_for_baselines(train_df)
        X_test, y_test = prepare_data_for_baselines(test_df)

        result = evaluate_baseline("seasonal_naive", X_train, y_train, X_test, y_test)
        assert np.isfinite(result.metrics.mae)

    def test_unknown_model_raises(self):
        df = self.make_data()
        split = int(0.8 * len(df))
        train_df = df.iloc[:split]
        test_df = df.iloc[split:]

        X_train, y_train = prepare_data_for_baselines(train_df)
        X_test, y_test = prepare_data_for_baselines(test_df)

        with pytest.raises(ValueError, match="Unknown model"):
            evaluate_baseline("nonexistent", X_train, y_train, X_test, y_test)


class TestRunBenchmark:
    """Tests for run_benchmark function."""

    def test_runs_all_models(self):
        np.random.seed(42)
        n = 200
        months = np.random.randint(1, 13, n)
        base = 100 + 20 * np.sin(2 * np.pi * months / 12)
        noise = np.random.normal(0, 10, n)

        df = pd.DataFrame({
            "electricity_t_minus_2": np.maximum(base + noise, 0),
            "electricity_t_minus_1": np.maximum(base + noise + np.random.normal(0, 5, n), 0),
            "target_month_num": months,
            "electricity_target": np.maximum(base + noise + np.random.normal(0, 8, n), 0),
        })
        split = int(0.8 * n)
        train_df = df.iloc[:split]
        test_df = df.iloc[split:]

        X_train, y_train = prepare_data_for_baselines(train_df)
        X_test, y_test = prepare_data_for_baselines(test_df)

        results = run_benchmark(X_train, y_train, X_test, y_test)

        assert len(results) == 4
        assert all(name in results for name in ["mean", "naive_persistence", "seasonal_naive", "linear_trend"])
        assert all(isinstance(r, BaselineResult) for r in results.values())


class TestBenchmarkSummary:
    """Tests for benchmark_summary function."""

    def test_creates_sorted_dataframe(self):
        # Create mock results
        results = {
            "model_a": BaselineResult(
                model_name="model_a",
                metrics=ModelMetrics(mae=10, rmse=15, r2=0.5),
                predictions=np.array([1, 2, 3]),
            ),
            "model_b": BaselineResult(
                model_name="model_b",
                metrics=ModelMetrics(mae=5, rmse=8, r2=0.8),
                predictions=np.array([1, 2, 3]),
            ),
        }

        df = benchmark_summary(results)
        assert len(df) == 2
        # Should be sorted by MAE ascending
        assert df.iloc[0]["Model"] == "model_b"
        assert df.iloc[1]["Model"] == "model_a"


class TestPrepareDataForBaselines:
    """Tests for prepare_data_for_baselines function."""

    def test_default_features(self):
        df = pd.DataFrame({
            "a": [1, 2],
            "b": [3, 4],
            "target": [5, 6],
        })
        X, y = prepare_data_for_baselines(df, target_col="target")
        assert list(X.columns) == ["a", "b"]
        assert list(y) == [5, 6]

    def test_custom_features(self):
        df = pd.DataFrame({
            "a": [1, 2],
            "b": [3, 4],
            "c": [5, 6],
            "target": [7, 8],
        })
        X, y = prepare_data_for_baselines(df, target_col="target", feature_cols=["a", "c"])
        assert list(X.columns) == ["a", "c"]
        assert list(y) == [7, 8]

    def test_missing_target_raises(self):
        df = pd.DataFrame({"a": [1, 2]})
        with pytest.raises(ValueError, match="not found"):
            prepare_data_for_baselines(df, target_col="missing")


class TestModelRegistry:
    """Tests for MODEL_REGISTRY."""

    def test_all_models_registered(self):
        expected = ["mean", "naive_persistence", "seasonal_naive", "linear_trend"]
        assert set(MODEL_REGISTRY.keys()) == set(expected)

    def test_models_instantiable(self):
        for name, cls in MODEL_REGISTRY.items():
            model = cls()
            assert hasattr(model, "fit")
            assert hasattr(model, "predict")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])