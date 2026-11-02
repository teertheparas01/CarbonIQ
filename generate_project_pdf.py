#!/usr/bin/env python3
"""
Generate CarbonIQ Project Detailed Information PDF
"""
from fpdf import FPDF
import os

class CarbonIQPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=25)
        
    def header(self):
        if self.page_no() > 1:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 5, 'CarbonIQ - Household Energy & Carbon Monitoring Project', align='L')
            self.cell(0, 5, f'Page {self.page_no()}', align='R', new_x="LMARGIN", new_y="NEXT")
            self.line(10, 12, 200, 12)
            self.ln(5)
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', align='C')
    
    def section_title(self, title, level=1):
        if level == 1:
            self.set_font('Helvetica', 'B', 16)
            self.set_text_color(5, 31, 32)  # #051F20
            self.ln(4)
            self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
            self.set_draw_color(142, 182, 155)  # #8EB69B
            self.set_line_width(0.5)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(4)
        elif level == 2:
            self.set_font('Helvetica', 'B', 13)
            self.set_text_color(19, 56, 71)  # #133847
            self.ln(3)
            self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
            self.ln(2)
        elif level == 3:
            self.set_font('Helvetica', 'B', 11)
            self.set_text_color(35, 83, 71)  # #235347
            self.ln(2)
            self.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
            self.ln(1)
    
    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5, text)
        self.ln(2)
    
    def bullet_point(self, text, indent=15):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(30, 30, 30)
        x = self.get_x()
        self.set_x(x + indent)
        self.cell(4, 5, '-')
        self.multi_cell(0, 5, text)
        self.ln(1)
    
    def bold_bullet(self, bold_part, normal_part, indent=15):
        self.set_text_color(30, 30, 30)
        x = self.get_x()
        self.set_x(x + indent)
        self.set_font('Helvetica', '', 10)
        self.cell(4, 5, '-')
        self.set_font('Helvetica', 'B', 10)
        self.write(5, bold_part)
        self.set_font('Helvetica', '', 10)
        self.write(5, normal_part)
        self.ln(6)
    
    def add_table(self, headers, data, col_widths=None):
        if col_widths is None:
            col_widths = [190 / len(headers)] * len(headers)
        
        # Header
        self.set_font('Helvetica', 'B', 9)
        self.set_fill_color(5, 31, 32)  # #051F20
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 7, header, border=1, fill=True, align='C')
        self.ln()
        
        # Data rows
        self.set_font('Helvetica', '', 9)
        self.set_text_color(30, 30, 30)
        fill = False
        for row in data:
            if fill:
                self.set_fill_color(218, 241, 222)  # #DAF1DE
            else:
                self.set_fill_color(255, 255, 255)
            
            max_h = 7
            for i, cell in enumerate(row):
                self.cell(col_widths[i], max_h, str(cell), border=1, fill=True, align='L' if i > 0 else 'C')
            self.ln()
            fill = not fill
        self.ln(3)


# Create PDF
pdf = CarbonIQPDF()
pdf.alias_nb_pages()
pdf.add_page()

# ===== COVER PAGE =====
pdf.ln(30)
pdf.set_font('Helvetica', 'B', 36)
pdf.set_text_color(5, 31, 32)  # #051F20
pdf.cell(0, 15, 'CarbonIQ', align='C', new_x="LMARGIN", new_y="NEXT")

pdf.set_font('Helvetica', '', 18)
pdf.set_text_color(35, 83, 71)  # #235347
pdf.cell(0, 10, 'Household Energy & Carbon Monitoring', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 10, 'Prediction & Reduction Application', align='C', new_x="LMARGIN", new_y="NEXT")

pdf.ln(10)
pdf.set_draw_color(142, 182, 155)
pdf.set_line_width(1)
pdf.line(60, pdf.get_y(), 150, pdf.get_y())
pdf.ln(10)

pdf.set_font('Helvetica', '', 12)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 8, 'College AIML Mini-Project', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 8, 'Comprehensive Technical Documentation', align='C', new_x="LMARGIN", new_y="NEXT")

pdf.ln(20)
pdf.set_font('Helvetica', 'I', 10)
pdf.set_text_color(128, 128, 128)
pdf.cell(0, 6, 'Generated: October 2026', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 6, 'Version: 1.0 (MVP)', align='C', new_x="LMARGIN", new_y="NEXT")

# ===== TABLE OF CONTENTS =====
pdf.add_page()
pdf.section_title('Table of Contents')
toc_items = [
    ('1.', 'Project Overview', 3),
    ('2.', 'System Architecture', 4),
    ('3.', 'Backend (FastAPI)', 5),
    ('4.', 'Frontend (React + TypeScript)', 7),
    ('5.', 'Machine Learning Model', 9),
    ('6.', 'Emission Factor & Carbon Calculation', 11),
    ('7.', 'API Reference', 12),
    ('8.', 'Implemented Features (MVP)', 13),
    ('9.', 'Not Implemented & Limitations', 14),
    ('10.', 'Project Structure', 15),
    ('11.', 'Quick Start Guide', 16),
    ('12.', 'Development Commands', 17),
    ('13.', 'Future Enhancements', 18),
]
for num, title, page in toc_items:
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(10, 7, num)
    pdf.cell(150, 7, title)
    pdf.cell(0, 7, str(page), align='R', new_x="LMARGIN", new_y="NEXT")

# ===== 1. PROJECT OVERVIEW =====
pdf.add_page()
pdf.section_title('1. Project Overview')

pdf.section_title('1.1 What Is CarbonIQ?', level=2)
pdf.body_text(
    'CarbonIQ is a household energy and carbon monitoring, prediction, and reduction application '
    'developed as a college AI/ML mini-project. It predicts next-month electricity consumption for '
    'a household using a Seasonal Gradient Boosting model trained on Pune household survey data '
    '(January 2018 - February 2020). CO2 emissions are calculated deterministically from predicted '
    'kWh using the Central Electricity Authority (CEA) emission factor (0.675 kg CO2/kWh, database '
    'version 22.0, reporting period FY 2025-26).'
)

pdf.section_title('1.2 Problem Statement', level=2)
pdf.body_text(
    'Households lack accessible tools to forecast their electricity consumption and understand '
    'the associated carbon footprint. Existing solutions either require smart meters, complex '
    'installations, or provide only historical data without predictive capability. CarbonIQ '
    'addresses this by providing a lightweight, survey-data-driven forecasting tool that runs '
    'entirely in the browser with a local backend.'
)

pdf.section_title('1.3 Key Objectives', level=2)
objectives = [
    'Forecast next-month household electricity consumption (kWh) using only two prior months of data',
    'Calculate deterministic CO2 emissions from predicted electricity using versioned CEA emission factor',
    'Provide a clean, interactive web dashboard for visualization and forecasting',
    'Maintain transparent documentation of model limitations and accuracy (R-squared approx 0.17)',
    'Deliver a reproducible ML pipeline from raw data to deployed API',
]
for obj in objectives:
    pdf.bullet_point(obj)

pdf.section_title('1.4 Scope & Boundaries', level=2)
pdf.body_text('The MVP focuses exclusively on grid electricity. Other domains (LPG, Water, Food, Transport) '
    'are included in the frontend as placeholder pages with "Not Implemented" status due to '
    'insufficient verified emission factors or input data. This is by design and documented.')

# ===== 2. SYSTEM ARCHITECTURE =====
pdf.add_page()
pdf.section_title('2. System Architecture')

pdf.section_title('2.1 High-Level Architecture', level=2)
pdf.body_text(
    'CarbonIQ follows a client-server architecture with a React frontend communicating '
    'via HTTP/JSON to a FastAPI backend that serves the ML model.'
)

# Architecture diagram as text
arch_text = """
+-------------+     HTTP/JSON      +-------------+
|  Frontend   | <----------------> |  Backend    |
|  (React 19, |   POST /predict    |  (FastAPI,  |
|   Vite,     |   GET /health      |   scikit-   |
|   Tailwind) |                    |   learn)    |
+-------------+                    +-------------+
                                           |
                                           v
                                  +-----------------+
                                  |  ML Model       |
                                  |  (Gradient      |
                                  |   Boosting,     |
                                  |   joblib)       |
                                  +-----------------+
"""
pdf.set_font('Courier', '', 8)
pdf.set_text_color(30, 30, 30)
for line in arch_text.strip().split('\n'):
    pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
pdf.ln(4)

pdf.section_title('2.2 Technology Stack', level=2)
pdf.section_title('Frontend', level=3)
frontend_stack = [
    'React 19 + TypeScript + Vite',
    'Tailwind CSS v4 (custom brand palette)',
    'Motion (Framer Motion v14) for animations',
    'Recharts for data visualization',
    'Axios for HTTP requests',
    'React Router v7 for client-side routing',
    'Three.js + React Three Fiber + @react-three/drei for 3D grid visualization',
    'Lucide React + Phosphor Icons for iconography',
]
for item in frontend_stack:
    pdf.bullet_point(item)

pdf.section_title('Backend', level=3)
backend_stack = [
    'FastAPI (async Python web framework)',
    'scikit-learn 1.6.1 for ML inference',
    'joblib for model serialization',
    'uvicorn ASGI server',
    'pandas for data preprocessing in API',
    'Pydantic for request/response validation',
]
for item in backend_stack:
    pdf.bullet_point(item)

pdf.section_title('ML Model', level=3)
ml_stack = [
    'Algorithm: GradientBoostingRegressor (Seasonal variant)',
    'Features: electricity_t_minus_2, electricity_t_minus_1, target_month_num',
    'Target: Next-month electricity consumption (kWh)',
    'Training samples: 5,347 | Test samples: 1,434',
    'Model file: carboniq_seasonal_gb.joblib (~200 KB)',
    'Metadata: carboniq_model_metadata.json',
]
for item in ml_stack:
    pdf.bullet_point(item)

# ===== 3. BACKEND =====
pdf.add_page()
pdf.section_title('3. Backend (FastAPI)')

pdf.section_title('3.1 API Endpoints', level=2)

pdf.section_title('GET /health', level=3)
pdf.body_text('Health check endpoint to verify model loading and service status.')
pdf.set_font('Courier', '', 9)
pdf.multi_cell(0, 4, '''Response:
{
  "status": "ok",
  "model_loaded": true,
  "model_name": "Seasonal Gradient Boosting"
}''')
pdf.ln(3)

pdf.section_title('POST /predict', level=3)
pdf.body_text('Main prediction endpoint. Accepts two prior months of electricity consumption and a target month number.')
pdf.set_font('Courier', '', 9)
pdf.multi_cell(0, 4, '''Request:
{
  "electricity_t_minus_2": 92,    // kWh, >= 0
  "electricity_t_minus_1": 114,   // kWh, >= 0
  "target_month_num": 3           // 1-12
}

Response:
{
  "predicted_electricity_kwh": 117.11,
  "predicted_co2_kg": 79.049,
  "emission_factor_kg_co2_per_kwh": 0.675,
  "factor_source": "Central Electricity Authority (CEA)",
  "factor_version": "22.0",
  "reporting_period": "FY 2025-26",
  "gas": "CO2",
  "model_name": "Seasonal Gradient Boosting",
  "model_metrics": {
    "MAE_kWh": 32.1234,
    "RMSE_kWh": 186.3864,
    "R2": 0.1689
  },
  "limitations": [...]
}''')
pdf.ln(3)

pdf.section_title('3.2 Request Validation', level=2)
validations = [
    'electricity_t_minus_2: float, >= 0, no inf/NaN',
    'electricity_t_minus_1: float, >= 0, no inf/NaN',
    'target_month_num: integer, 1-12 inclusive',
    'All fields required',
]
for v in validations:
    pdf.bullet_point(v)

pdf.section_title('3.3 CORS Configuration', level=2)
pdf.body_text('Configured for local development origins:')
origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173 (Vite preview)',
    'http://127.0.0.1:4173',
]
for o in origins:
    pdf.bullet_point(o)

pdf.section_title('3.4 Model Loading', level=2)
pdf.body_text(
    'On startup, the backend loads two artifacts from the backend/ directory:\n'
    '1. carboniq_seasonal_gb.joblib - the trained GradientBoostingRegressor model\n'
    '2. carboniq_model_metadata.json - metadata including features, metrics, emission factor, and limitations\n\n'
    'The emission factor (0.675 kg CO2/kWh) is read from metadata at runtime, not hardcoded, '
    'allowing updates without code changes.'
)

# ===== 4. FRONTEND =====
pdf.add_page()
pdf.section_title('4. Frontend (React + TypeScript)')

pdf.section_title('4.1 Pages & Routes', level=2)
pages = [
    ('/', 'Dashboard', 'KPI cards, domain overview, latest forecast summary, quick actions'),
    ('/electricity', 'Electricity', 'Forecast form, 3D power grid visualization, seasonal charts, emission factor info'),
    ('/forecast', 'Forecast', 'Dedicated prediction form, localStorage history (20 entries), model details'),
    ('/lpg', 'LPG', 'Placeholder - planned CO2 calculator'),
    ('/water', 'Water', 'Placeholder - planned CO2 calculator'),
    ('/food', 'Food', 'Placeholder - planned CO2 calculator'),
    ('/transport', 'Transport', 'Placeholder - vehicle ownership display only'),
    ('/todo-not-todo', 'Todo/Not-Todo', 'Static rule-based energy saving tips'),
    ('/settings', 'Settings', 'Emission factor override (localStorage), units toggle, model metadata'),
]
pdf.add_table(['Route', 'Page', 'Description'], 
              [[r, p, d] for r, p, d in pages],
              [25, 35, 130])

pdf.section_title('4.2 Key Components', level=2)
components = [
    ('UI Primitives', 'Button, Card, Input, Select, Badge - consistent styling with Tailwind'),
    ('Layout', 'Sidebar, Header, PageContainer - responsive layout with navigation'),
    ('Animations', 'StaggerContainer/StaggerItem, ElevatedCard, MotionButton - Framer Motion powered'),
    ('Charts', 'Recharts AreaChart (seasonal trends), BarChart (appliance breakdown)'),
    ('3D Visualization', 'PowerGridIsland - Three.js animated grid with workload-responsive turbines/steam'),
    ('Hooks', 'useForecast (prediction state), useHealth (backend polling every 30s)'),
    ('API Client', 'Axios instance with base URL, timeout, error interceptor'),
]
for name, desc in components:
    pdf.bold_bullet(f'{name}: ', desc)

pdf.section_title('4.3 State Management', level=2)
pdf.body_text(
    'No global state library (Redux/Zustand) used. State is managed via:\n'
    '- React useState/useReducer for component-local state\n'
    '- Custom hooks (useForecast, useHealth) for shared async logic\n'
    '- localStorage for forecast history persistence (Forecast page)\n'
    '- localStorage for user preferences (Settings page)\n'
    '- URL/route state via React Router'
)

pdf.section_title('4.4 Styling & Theming', level=2)
pdf.body_text('Tailwind CSS v4 with custom brand palette:')
colors = [
    ('brand-950', '#051F20', 'Primary dark (headers, text)'),
    ('brand-900', '#0B2B26', 'Dark variant'),
    ('brand-800', '#163832', 'Card backgrounds'),
    ('brand-700', '#235347', 'Primary brand (buttons, accents)'),
    ('brand-300', '#8EB69B', 'Mint green (secondary, charts)'),
    ('brand-100', '#DAF1DE', 'Light mint (backgrounds, highlights)'),
]
pdf.add_table(['Token', 'Hex', 'Usage'], [[t, h, u] for t, h, u in colors], [35, 30, 125])

# ===== 5. ML MODEL =====
pdf.add_page()
pdf.section_title('5. Machine Learning Model')

pdf.section_title('5.1 Model Specification', level=2)
model_spec = [
    ('Algorithm', 'GradientBoostingRegressor (Seasonal)'),
    ('Library', 'scikit-learn 1.6.1'),
    ('Features', 'electricity_t_minus_2, electricity_t_minus_1, target_month_num'),
    ('Target', 'electricity_target (kWh/month)'),
    ('Training Samples', '5,347'),
    ('Test Samples', '1,434 (Nov 2019 - Feb 2020)'),
    ('Training Cutoff', 'Before November 2019 (chronological split)'),
    ('Model File', 'carboniq_seasonal_gb.joblib'),
    ('Serialization', 'joblib.dump / joblib.load'),
]
pdf.add_table(['Property', 'Value'], model_spec, [50, 140])

pdf.section_title('5.2 Hyperparameters', level=2)
hyperparams = [
    ('n_estimators', '200'),
    ('learning_rate', '0.05'),
    ('max_depth', '3'),
    ('subsample', '1.0'),
    ('min_samples_split', '2'),
    ('min_samples_leaf', '1'),
    ('loss', 'squared_error'),
    ('criterion', 'friedman_mse'),
    ('alpha', '0.9'),
    ('random_state', '42'),
    ('validation_fraction', '0.1'),
    ('n_iter_no_change', 'None (early stopping disabled)'),
]
pdf.add_table(['Parameter', 'Value'], hyperparams, [60, 130])

pdf.section_title('5.3 Evaluation Metrics', level=2)
metrics = [
    ('MAE (Mean Absolute Error)', '32.1234 kWh'),
    ('RMSE (Root Mean Squared Error)', '186.3864 kWh'),
    ('R-squared (R2)', '0.1689'),
]
pdf.add_table(['Metric', 'Value'], metrics, [80, 110])

pdf.section_title('5.4 Model Interpretation', level=2)
pdf.body_text(
    'The R-squared of 0.1689 indicates the model explains approximately 17% of the variance '
    'in next-month electricity consumption. This is modest predictive power. The MAE of 32.12 kWh '
    'means on average predictions are off by ~32 kWh (roughly 29% of typical ~110 kWh consumption). '
    'The high RMSE (186 kWh) relative to MAE suggests occasional large errors, likely on outlier '
    'households. The model is intended as a baseline seasonal forecaster, not a precision tool.'
)

pdf.section_title('5.5 Training Pipeline Summary', level=2)
pipeline_steps = [
    '1. Load Pune Household Survey CSV (1,872 households, 26 monthly columns)',
    '2. Identify and chronologically sort monthly electricity columns (Jan 2018 - Feb 2020)',
    '3. Construct genuine consecutive 3-month windows (t-2, t-1, target) - only rows with all 3 values present',
    '4. Extract target_month_num (1-12) from target column name',
    '5. Chronological split: train on data before Nov 2019, test on Nov 2019 - Feb 2020',
    '6. Train Seasonal GradientBoostingRegressor with fixed hyperparameters',
    '7. Evaluate on test set (MAE, RMSE, R2)',
    '8. Serialize model (joblib) and metadata (JSON) for backend consumption',
]
for step in pipeline_steps:
    pdf.bullet_point(step)

# ===== 6. EMISSION FACTOR =====
pdf.add_page()
pdf.section_title('6. Emission Factor & Carbon Calculation')

pdf.section_title('6.1 Emission Factor Details', level=2)
ef_details = [
    ('Value', '0.675 kg CO2/kWh'),
    ('Source', 'Central Electricity Authority (CEA), Government of India'),
    ('Database Version', '22.0'),
    ('Reporting Period', 'FY 2025-26'),
    ('Gas', 'CO2 (carbon dioxide only, not CO2e)'),
    ('Scope', 'Grid electricity only (Scope 2 indirect emissions)'),
]
pdf.add_table(['Property', 'Value'], ef_details, [50, 140])

pdf.section_title('6.2 Carbon Calculation Formula', level=2)
pdf.set_font('Courier', '', 10)
pdf.set_text_color(35, 83, 71)
pdf.cell(0, 6, 'predicted_co2_kg = round(max(0, predicted_electricity_kwh) * 0.675, 3)', new_x="LMARGIN", new_y="NEXT")
pdf.ln(3)
pdf.body_text(
    'The calculation is deterministic - no ML involved. The emission factor is applied directly '
    'to the model\'s electricity prediction. The factor is sourced from the backend at runtime '
    'via the /predict response, ensuring the frontend always uses the versioned factor from metadata.'
)

pdf.section_title('6.3 Why Deterministic?', level=2)
reasons = [
    'Emission factors are policy/regulatory values, not learned from data',
    'CEA factor is updated annually; versioning ensures reproducibility',
    'Separates ML uncertainty (electricity prediction) from policy certainty (emission factor)',
    'Allows factor updates without retraining the model',
    'Transparent: users can verify calculation manually',
]
for r in reasons:
    pdf.bullet_point(r)

pdf.section_title('6.4 Important Caveats', level=2)
caveats = [
    'Factor period (FY 2025-26) differs from ML training data period (2018-2020)',
    'Grid emission intensity changes over time (renewables penetration, fuel mix)',
    'Factor applies only to grid electricity, not LPG, transport, etc.',
    'No transmission/distribution losses included in this factor',
    'Regional variations within India not captured (single national average)',
]
for c in caveats:
    pdf.bullet_point(c)

# ===== 7. API REFERENCE =====
pdf.add_page()
pdf.section_title('7. API Reference')

pdf.section_title('7.1 Base URL', level=2)
pdf.body_text('Development: http://127.0.0.1:8000')

pdf.section_title('7.2 Common Headers', level=2)
pdf.add_table(['Header', 'Value'], 
              [['Content-Type', 'application/json'],
               ['Accept', 'application/json']],
              [50, 140])

pdf.section_title('7.3 Error Responses', level=2)
pdf.body_text('FastAPI returns standard HTTP status codes with JSON error details:')
errors = [
    ('400', 'Validation Error', 'Input validation failed (e.g., negative kWh, month > 12)'),
    ('422', 'Unprocessable Entity', 'Pydantic validation error with field details'),
    ('500', 'Internal Server Error', 'Model loading or prediction failure'),
]
pdf.add_table(['Code', 'Name', 'Description'], errors, [20, 40, 130])

pdf.section_title('7.4 Example curl Commands', level=2)
pdf.set_font('Courier', '', 8)
pdf.set_text_color(30, 30, 30)
curl_examples = [
    '# Health check',
    'curl http://127.0.0.1:8000/health',
    '',
    '# Prediction',
    'curl -X POST http://127.0.0.1:8000/predict \\',
    '  -H "Content-Type: application/json" \\',
    '  -d \'{"electricity_t_minus_2": 92, "electricity_t_minus_1": 114, "target_month_num": 3}\'',
]
for line in curl_examples:
    pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
pdf.ln(3)

# ===== 8. IMPLEMENTED FEATURES =====
pdf.add_page()
pdf.section_title('8. Implemented Features (MVP)')

features = [
    ('Electricity Forecasting', 'POST /predict endpoint with t-2, t-1, target_month inputs', 'Backend + Frontend'),
    ('Deterministic CO2 Calculation', '0.675 kg CO2/kWh factor applied to predicted kWh', 'Backend + Frontend'),
    ('Model Health Check', 'GET /health returns model load status and name', 'Backend + Frontend'),
    ('Dashboard Page', 'KPI cards, domain status grid, quick actions, latest forecast summary', 'Frontend'),
    ('Electricity Page', 'Forecast form, 3D PowerGridIsland, seasonal charts, emission factor card', 'Frontend'),
    ('Forecast Page', 'Full prediction form, 20-entry localStorage history, model metrics display', 'Frontend'),
    ('LPG/Water/Food/Transport Pages', 'Placeholder pages with status badges and descriptions', 'Frontend'),
    ('Todo/Not-Todo Page', 'Static categorized energy-saving tips (client-side)', 'Frontend'),
    ('Settings Page', 'Emission factor override, units toggle, model metadata display', 'Frontend'),
    ('Responsive Design', 'Mobile-first Tailwind CSS, collapsible sidebar', 'Frontend'),
    ('Animations', 'Staggered entrance, hover elevations, loading spinners, 3D canvas', 'Frontend'),
    ('TypeScript Types', 'Full type coverage for API requests/responses, components', 'Frontend'),
]
pdf.add_table(['Feature', 'Description', 'Layer'], features, [45, 100, 45])

# ===== 9. NOT IMPLEMENTED =====
pdf.add_page()
pdf.section_title('9. Not Implemented & Limitations')

pdf.section_title('9.1 By Design (Documented Gaps)', level=2)
not_impl = [
    ('LPG CO2', 'Not available', 'No verified emission calculation; survey data exists but no CEA-equivalent factor'),
    ('Water CO2', 'Not available', 'No verified emission calculation implemented'),
    ('Food CO2', 'Not available', 'Highly variable by diet/source; no generic factor without verification'),
    ('Transport CO2', 'Not available', 'Vehicle ownership != distance/fuel use; survey lacks travel data'),
    ('Historical Charts', 'Not available', 'No /history/:household_id endpoint; would need new API'),
    ('Multi-household', 'Not available', 'API accepts raw inputs; no household lookup or management'),
    ('Persistent History', 'Not available', 'No database; frontend uses localStorage only'),
    ('User Authentication', 'Not available', 'Out of scope for MVP'),
]
pdf.add_table(['Domain', 'Status', 'Reason'], not_impl, [35, 25, 130])

pdf.section_title('9.2 Model Limitations (From Metadata)', level=2)
limitations = [
    'Trained on historical household electricity observations (2018-2020)',
    'Evaluation uses a historical test period (Nov 2019 - Feb 2020)',
    'Current-period forecasts need validation against newer data',
    'The emission factor is configurable and separate from the ML model',
    'R-squared approx 0.17 indicates modest explanatory power; predictions are estimates',
]
for lim in limitations:
    pdf.bullet_point(lim)

pdf.section_title('9.3 Known Technical Debt', level=2)
debt = [
    'No automated tests (backend or frontend)',
    'No CI/CD pipeline',
    'No Docker configuration',
    'No production deployment configs',
    'Single-household model (no household_id in API)',
    'No request rate limiting on /predict',
    'No structured logging or monitoring',
    'Frontend: no error boundaries, limited accessibility audit',
]
for d in debt:
    pdf.bullet_point(d)

# ===== 10. PROJECT STRUCTURE =====
pdf.add_page()
pdf.section_title('10. Project Structure')

structure = """
.
+---- backend/                    # FastAPI + model artifacts
|     +---- app.py                 # FastAPI application
|     +---- carboniq_model_metadata.json
|     +---- carboniq_seasonal_gb.joblib
|     +---- requirements.txt
+---- frontend/                  # React + TypeScript + Vite
|     +---- public/
|     +---- src/
|     |     +---- api/              # Axios client, API calls
|     |     +---- components/
|     |     |     +---- ui/           # Button, Card, Input, Select, Badge
|     |     |     +---- layout/       # Sidebar, Header, PageContainer
|     |     |     +---- animations/   # PowerGridIsland (3D viz)
|     |     +---- hooks/            # useForecast, useHealth
|     |     +---- lib/animations.tsx # Motion animation utilities
|     |     +---- pages/            # Dashboard, Electricity, Forecast, etc.
|     |     +---- types/            # TypeScript interfaces
|     |     +---- App.tsx
|     |     +---- main.tsx
|     |     +---- routes.tsx
|     +---- package.json
|     +---- vite.config.ts
|     +---- tailwind.config.js
+---- notebooks/
|     +---- CarbonIQ_ML_Clean.ipynb    # Cleaned ML pipeline
+---- docs/
|     +---- FRONTEND_IMPLEMENTATION_PLAN.md
|     +---- CHANGE_REPORT.md
+---- scripts/
|     +---- check_nb.py
|     +---- count_original.py
+---- start.sh / start.bat / start.ps1  # Startup scripts
+---- README.md
+---- .gitignore
"""
pdf.set_font('Courier', '', 7.5)
pdf.set_text_color(30, 30, 30)
for line in structure.strip().split('\n'):
    pdf.cell(0, 3.5, line, new_x="LMARGIN", new_y="NEXT")
pdf.ln(4)

# ===== 11. QUICK START =====
pdf.add_page()
pdf.section_title('11. Quick Start Guide')

pdf.section_title('11.1 Prerequisites', level=2)
prereqs = [
    'Python 3.10+',
    'Node.js 18+ (includes npm)',
    'Git (optional)',
]
for p in prereqs:
    pdf.bullet_point(p)

pdf.section_title('11.2 Backend Setup', level=2)
pdf.set_font('Courier', '', 9)
backend_steps = [
    'cd backend',
    'python -m venv .venv',
    '# Windows:',
    '.venv\\Scripts\\activate',
    '# Linux/macOS:',
    'source .venv/bin/activate',
    'pip install -r requirements.txt',
    'uvicorn app:app --reload',
    '# Runs on http://127.0.0.1:8000',
]
for step in backend_steps:
    pdf.cell(0, 4.5, step, new_x="LMARGIN", new_y="NEXT")
pdf.ln(3)

pdf.section_title('11.3 Frontend Setup', level=2)
pdf.set_font('Courier', '', 9)
frontend_steps = [
    'cd frontend',
    'npm install',
    'npm run dev',
    '# Runs on http://localhost:5173',
    '# CORS configured for this origin',
]
for step in frontend_steps:
    pdf.cell(0, 4.5, step, new_x="LMARGIN", new_y="NEXT")
pdf.ln(3)

pdf.section_title('11.4 One-Command Start (Windows)', level=2)
pdf.body_text('Double-click start.bat or run in PowerShell:')
pdf.set_font('Courier', '', 9)
pdf.cell(0, 4.5, '.\\start.ps1', new_x="LMARGIN", new_y="NEXT")
pdf.ln(2)
pdf.body_text('Or use start.bat in Command Prompt. Both launch backend and frontend in separate windows.')

pdf.section_title('11.5 API Verification', level=2)
pdf.set_font('Courier', '', 9)
api_test = [
    '# Health check',
    'curl http://127.0.0.1:8000/health',
    '',
    '# Prediction example',
    'curl -X POST http://127.0.0.1:8000/predict \\',
    '  -H "Content-Type: application/json" \\',
    '  -d \'{"electricity_t_minus_2": 92, "electricity_t_minus_1": 114, "target_month_num": 3}\'',
]
for line in api_test:
    pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")

# ===== 12. DEVELOPMENT COMMANDS =====
pdf.add_page()
pdf.section_title('12. Development Commands')

commands = [
    ('Frontend dev server', 'cd frontend && npm run dev'),
    ('Frontend production build', 'cd frontend && npm run build'),
    ('Frontend lint', 'cd frontend && npm run lint'),
    ('Backend dev server', 'cd backend && uvicorn app:app --reload'),
    ('Backend install deps', 'cd backend && pip install -r requirements.txt'),
    ('Run ML notebook', 'jupyter notebook notebooks/CarbonIQ_ML_Clean.ipynb'),
    ('Start all (PowerShell)', '.\\start.ps1'),
    ('Start all (CMD)', 'start.bat'),
    ('Start all (Git Bash/WSL)', './start.sh'),
]
pdf.add_table(['Task', 'Command'], commands, [60, 130])

# ===== 13. FUTURE ENHANCEMENTS =====
pdf.add_page()
pdf.section_title('13. Future Enhancements')

pdf.section_title('13.1 High Priority', level=2)
high_priority = [
    'Add walk-forward time-series cross-validation to notebook',
    'Implement /history/:household_id endpoint for historical charts',
    'Add SQLite/PostgreSQL for persistent forecast history & multi-household',
    'Dockerize both services with docker-compose',
    'Set up GitHub Actions CI (lint, test, build)',
    'Add pytest (backend) and Vitest (frontend) test suites',
]
for item in high_priority:
    pdf.bullet_point(item)

pdf.section_title('13.2 Medium Priority', level=2)
medium_priority = [
    'Feature engineering: cyclic month encoding (sin/cos), rolling statistics',
    'Try LightGBM/XGBoost for potentially better performance',
    'Add household metadata features (size, appliances, income) if available',
    'Implement LPG/Water calculators with IPCC/DEFRA default factors',
    'Add Prometheus metrics endpoint (/metrics) for monitoring',
    'Structured logging with correlation IDs',
    'Rate limiting on /predict endpoint',
]
for item in medium_priority:
    pdf.bullet_point(item)

pdf.section_title('13.3 Low Priority / Nice to Have', level=2)
low_priority = [
    'Dark mode support in frontend',
    'Export forecasts to CSV/PDF',
    'WebSocket live updates for real-time predictions',
    'Storybook for component documentation',
    'Model versioning & A/B testing framework',
    'SHAP feature importance in /predict response',
    'Automated drift detection on logged predictions',
]
for item in low_priority:
    pdf.bullet_point(item)

# Save
output_path = os.path.join(os.path.dirname(__file__), 'CarbonIQ_Project_Documentation.pdf')
pdf.output(output_path)
print(f"PDF generated: {output_path}")
print(f"Pages: {pdf.page_no()}")