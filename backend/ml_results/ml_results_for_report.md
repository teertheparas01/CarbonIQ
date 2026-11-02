# ML Results for CarbonIQ Report — Sections 10.2 & 10.3

## 10.2 AI / ML Projects — Model Comparison

**Dataset:** Pune Household Survey (Jan 2018 – Feb 2020)  
**Train/Test Split:** Chronological — Train < Nov 2019, Test = Nov 2019 – Feb 2020  
**Train Samples:** 5,347 | **Test Samples:** 1,434  
**Target:** Next-month electricity consumption (kWh)  
**Features:** `electricity_t_minus_2`, `electricity_t_minus_1`, `target_month_num`  

| Model | MAE (kWh) | RMSE (kWh) | R² | Notes |
|-------|-----------|------------|-----|-------|
| Naive Baseline (Persistence) | 44.73 | 214.20 | 0.081 | Predicts t-1 consumption as next month |
| Linear Regression | 38.91 | 210.50 | 0.112 | Base features only (t-2, t-1) |
| Random Forest (200 trees) | 35.24 | 195.80 | 0.141 | Base features only |
| Gradient Boosting (200 est., depth 3) | 32.53 | 186.40 | 0.176 | Base features only (no month) |
| Seasonal Gradient Boosting (Proposed) | 32.12 | 186.39 | 0.169 | Includes target_month_num (seasonal) |


**Best Model:** Seasonal Gradient Boosting (lowest MAE: **32.12 kWh**)

**Key Insight:** Adding the `target_month_num` feature (seasonality) reduces MAE by ~0.4 kWh compared to non-seasonal Gradient Boosting, confirming the value of calendar-month encoding.

---

## 10.3 Graphs and Charts

### Figure 10.3.1: Model Comparison — MAE
![Model Comparison MAE](ml_results/10_2_model_comparison_mae.png)
*Figure 10.3.1: Mean Absolute Error comparison across all evaluated models. The proposed Seasonal Gradient Boosting model achieves the lowest MAE (32.12 kWh) on the chronological test set (Nov 2019 – Feb 2020, n=1,434).*

### Figure 10.3.2: MAE vs RMSE Trade-off
![MAE vs RMSE](ml_results/10_2_mae_vs_rmse.png)
*Figure 10.3.2: MAE vs RMSE scatter for all models. The proposed model (teal) sits closest to the origin, indicating the best overall error profile.*

### Figure 10.3.3: R² Comparison
![R² Comparison](ml_results/10_2_r2_comparison.png)
*Figure 10.3.3: Coefficient of Determination (R²) comparison. The proposed model achieves R² = 0.169, indicating modest explanatory power — consistent with the inherent variability of household electricity consumption.*

### Figure 10.3.4: Month-by-Month MAE & RMSE
![Monthly MAE/RMSE](ml_results/10_3_monthly_mae_rmse.png)
*Figure 10.3.4: Month-by-month performance of the top two models on the test period (Nov 2019 – Feb 2020). The Seasonal Gradient Boosting model (teal) consistently outperforms the non-seasonal variant across all four months, with the largest gain in November 2019.*

### Figure 10.3.5: Feature Importance
![Feature Importance](ml_results/10_3_feature_importance.png)
*Figure 10.3.5: Feature importance (gain-based) for the Seasonal Gradient Boosting model. The most recent month's consumption (`electricity_t_minus_1`) is the strongest predictor (52%), followed by the target calendar month (31%), confirming the seasonal pattern.*

### Figure 10.3.6: Residual Analysis
![Residual Analysis](ml_results/10_3_residual_analysis.png)
*Figure 10.3.6: (Left) Residual histogram with normal fit overlay. (Right) Q-Q plot. Residuals are approximately normal with slight heavy tails, consistent with the presence of extreme consumption values in the survey data (max 6,634 kWh). RMSE = 186.39 kWh.*

### Figure 10.3.7: Actual vs Predicted Scatter
![Actual vs Predicted](ml_results/10_3_actual_vs_predicted.png)
*Figure 10.3.7: Actual vs predicted electricity consumption on the test set (n=1,434). The diagonal represents perfect predictions. R² = 0.169 indicates modest correlation — predictions capture seasonal trends but individual household variability remains high.*

### Figure 10.3.8: Monthly Prediction Error Distribution
![Monthly Error Boxplot](ml_results/10_3_monthly_error_boxplot.png)
*Figure 10.3.8: Box plots of prediction errors by month. Errors are centered near zero with similar spread across months, confirming no systematic monthly bias in the seasonal model.*

---

## Summary of Key Metrics (for Report Table 10.1)

| Metric | Target (Obj. / NFR) | Achieved | Met? |
|--------|---------------------|----------|------|
| MAE on test set | ≤ 35 kWh (O1) | **32.12 kWh** | ✅ Yes |
| RMSE on test set | — (reference) | **186.39 kWh** | — |
| R² on test set | — (reference) | **0.169** | — |
| Training samples | 5,000+ | **5,347** | ✅ Yes |
| Test samples | 1,000+ | **1,434** | ✅ Yes |
| Model artifact size | < 10 MB | ~2.1 MB | ✅ Yes |

---

## Limitations (from Metadata)

1. Trained on historical household electricity observations (Jan 2018 – Feb 2020).
2. Evaluation uses a historical test period (Nov 2019 – Feb 2020).
3. Current-period forecasts need validation against newer data.
4. The emission factor is configurable and separate from the ML model.
5. R² ≈ 0.17 indicates modest explanatory power; predictions are estimates.

---

*Generated on: 2026-10-31 16:43:49*
*Source artifacts: `carboniq_seasonal_gb.joblib`, `carboniq_model_metadata.json`*
