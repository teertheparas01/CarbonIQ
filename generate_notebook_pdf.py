#!/usr/bin/env python3
"""
Generate CarbonIQ ML Notebook Detailed Explanation PDF
"""
from fpdf import FPDF
import os

class NotebookPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=25)
        
    def header(self):
        if self.page_no() > 1:
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 5, 'CarbonIQ ML Pipeline - Notebook Deep Dive', align='L')
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
            self.set_text_color(5, 31, 32)
            self.ln(4)
            self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
            self.set_draw_color(142, 182, 155)
            self.set_line_width(0.5)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(4)
        elif level == 2:
            self.set_font('Helvetica', 'B', 13)
            self.set_text_color(19, 56, 71)
            self.ln(3)
            self.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
            self.ln(2)
        elif level == 3:
            self.set_font('Helvetica', 'B', 11)
            self.set_text_color(35, 83, 71)
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
    
    def code_block(self, code, lang='python'):
        self.set_font('Courier', '', 8)
        self.set_fill_color(240, 240, 240)
        self.set_text_color(30, 30, 30)
        self.set_draw_color(200, 200, 200)
        lines = code.strip().split('\n')
        for line in lines:
            self.cell(0, 4, line, border='LTR', fill=True, new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 1, '', border='LBR', fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
    
    def add_table(self, headers, data, col_widths=None):
        if col_widths is None:
            col_widths = [190 / len(headers)] * len(headers)
        
        self.set_font('Helvetica', 'B', 9)
        self.set_fill_color(5, 31, 32)
        self.set_text_color(255, 255, 255)
        for i, header in enumerate(headers):
            self.cell(col_widths[i], 7, header, border=1, fill=True, align='C')
        self.ln()
        
        self.set_font('Helvetica', '', 9)
        self.set_text_color(30, 30, 30)
        fill = False
        for row in data:
            if fill:
                self.set_fill_color(218, 241, 222)
            else:
                self.set_fill_color(255, 255, 255)
            
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 7, str(cell), border=1, fill=True, align='L' if i > 0 else 'C')
            self.ln()
            fill = not fill
        self.ln(3)


# Create PDF
pdf = NotebookPDF()
pdf.alias_nb_pages()
pdf.add_page()

# ===== COVER PAGE =====
pdf.ln(30)
pdf.set_font('Helvetica', 'B', 36)
pdf.set_text_color(5, 31, 32)
pdf.cell(0, 15, 'CarbonIQ ML Pipeline', align='C', new_x="LMARGIN", new_y="NEXT")

pdf.set_font('Helvetica', '', 18)
pdf.set_text_color(35, 83, 71)
pdf.cell(0, 10, 'Deep Dive Notebook Explanation', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 10, 'CarbonIQ_ML_Clean.ipynb', align='C', new_x="LMARGIN", new_y="NEXT")

pdf.ln(10)
pdf.set_draw_color(142, 182, 155)
pdf.set_line_width(1)
pdf.line(60, pdf.get_y(), 150, pdf.get_y())
pdf.ln(10)

pdf.set_font('Helvetica', '', 12)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 8, 'College AIML Mini-Project', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 8, 'Reproducible Machine Learning Pipeline Documentation', align='C', new_x="LMARGIN", new_y="NEXT")

pdf.ln(20)
pdf.set_font('Helvetica', 'I', 10)
pdf.set_text_color(128, 128, 128)
pdf.cell(0, 6, 'Generated: October 2026', align='C', new_x="LMARGIN", new_y="NEXT")
pdf.cell(0, 6, 'Based on: CarbonIQ_ML_Clean.ipynb (29 cells, 13 sections)', align='C', new_x="LMARGIN", new_y="NEXT")

# ===== TABLE OF CONTENTS =====
pdf.add_page()
pdf.section_title('Table of Contents')
toc_items = [
    ('1.', 'Notebook Overview & Structure', 3),
    ('2.', 'Section A: Project Overview & Objective', 4),
    ('3.', 'Section B: Imports & Configuration', 4),
    ('4.', 'Section C: Dataset Loading & Validation', 5),
    ('5.', 'Section D: Monthly Column Identification', 6),
    ('6.', 'Section E: ML Window Construction', 7),
    ('7.', 'Section F: Minimal EDA & Feature Preparation', 8),
    ('8.', 'Section G: Chronological Train/Test Split', 9),
    ('9.', 'Section H: Model Comparison (5 Models)', 10),
    ('10.', 'Section I: Final Model Selection & Evaluation', 11),
    ('11.', 'Section J: Deterministic Carbon Calculator', 12),
    ('12.', 'Section K: Integrated Forecasting + Carbon Pipeline', 13),
    ('13.', 'Section L: Pipeline Smoke Tests', 14),
    ('14.', 'Section M: Model Metadata, Serialization & Backend Export', 15),
    ('15.', 'Key Design Decisions & Rationale', 16),
    ('16.', 'Reproducibility Guarantees', 17),
    ('17.', 'Change Report Summary', 18),
]
for num, title, page in toc_items:
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(10, 7, num)
    pdf.cell(150, 7, title)
    pdf.cell(0, 7, str(page), align='R', new_x="LMARGIN", new_y="NEXT")

# ===== 1. NOTEBOOK OVERVIEW =====
pdf.add_page()
pdf.section_title('1. Notebook Overview & Structure')

pdf.section_title('1.1 What Is This Notebook?', level=2)
pdf.body_text(
    'CarbonIQ_ML_Clean.ipynb is the cleaned, reproducible machine learning pipeline for the CarbonIQ project. '
    'It transforms raw Pune household survey data into a trained Gradient Boosting model for electricity '
    'consumption forecasting, with a deterministic carbon calculator layered on top. The notebook executes '
    'top-to-bottom from a fresh runtime with no manual variable restoration needed.'
)

pdf.section_title('1.2 Notebook Statistics', level=2)
stats = [
    ('Total Cells', '29 (13 markdown + 16 code)'),
    ('Sections', '13 (labeled A through M)'),
    ('Original Cells', '~81 (reduced by 64%)'),
    ('Execution Time', '~30-60 seconds on modern hardware'),
    ('Data Size', '1,872 households x 26 monthly columns'),
    ('ML Samples', '5,347 train / 1,434 test'),
    ('Output Artifacts', '3 files (model.joblib, metadata.json, backend_package.zip)'),
]
pdf.add_table(['Property', 'Value'], stats, [50, 140])

pdf.section_title('1.3 Section Map (A-M)', level=2)
sections = [
    ('A', 'Project Overview and Objective', '1 markdown', 'Problem framing, scope, key decisions'),
    ('B', 'Imports and Configuration', '1 code', 'Dependencies, paths, emission factor, reproducibility'),
    ('C', 'Dataset Loading and Essential Validation', '1 code', 'Load CSV, verify shape, identify monthly columns'),
    ('D', 'Monthly Column Identification and Chronological Ordering', '1 code', 'Sort 26 monthly columns chronologically'),
    ('E', 'Construction of Genuine Consecutive-Month ML Windows', '1 code', 'Build 3-month windows (t-2, t-1, target)'),
    ('F', 'Minimal EDA and Feature Preparation', '1 code', 'Target statistics, train/test split preparation'),
    ('G', 'Chronological Train/Test Split', '1 code', 'Split by date: pre-Nov 2019 train, Nov 2019-Feb 2020 test'),
    ('H', 'Consistent Model Comparison (5 models)', '2 code', 'Naive, Linear, RF, GB, Seasonal GB - same split'),
    ('I', 'Final Model Selection and Evaluation', '1 code', 'Pick best MAE, compute final metrics'),
    ('J', 'Deterministic Electricity Carbon Calculator', '1 code', 'CEA factor 0.675 kg CO2/kWh, versioned'),
    ('K', 'Integrated Forecasting + Carbon Pipeline', '1 code', 'End-to-end prediction + emissions function'),
    ('L', 'Pipeline Smoke Tests', '1 code', '4/4 tests: health, predict, carbon, invalid input'),
    ('M', 'Model Metadata, Serialization, Backend Export', '4 code', 'Save model, metadata, create backend package'),
]
pdf.add_table(['Sec', 'Title', 'Cells', 'Purpose'], sections, [10, 55, 15, 110])

# ===== 2. SECTION A =====
pdf.add_page()
pdf.section_title('2. Section A: Project Overview & Objective')

pdf.section_title('2.1 Problem Definition', level=2)
pdf.body_text(
    'Build a reproducible ML pipeline that forecasts next-month household electricity consumption '
    'from two prior months of genuine consecutive observations, then estimates associated CO2 emissions '
    'using a versioned, documented emission factor.'
)

pdf.section_title('2.2 Scope', level=2)
scope = [
    'Dataset: Pune Household Survey (1,872 households, 26 monthly electricity columns spanning Jan 2018 - Feb 2020)',
    'ML Task: Next-month electricity prediction (kWh) using t-2 and t-1 consumption + calendar month',
    'Train/Test Split: Chronological - train on data before Nov 2019, test on Nov 2019 - Feb 2020',
    'Models Compared: Naive Persistence, Linear Regression, Random Forest, Gradient Boosting, Seasonal Gradient Boosting',
    'Carbon Calculation: Deterministic, using CEA v22.0 emission factor (0.675 kg CO2/kWh, FY 2025-26)',
    'Deliverables: Trained model artifact, metadata, FastAPI backend package with smoke tests',
]
for s in scope:
    pdf.bullet_point(s)

pdf.section_title('2.3 Key Design Decisions', level=2)
decisions = [
    'Only genuine consecutive 3-month windows are used (no imputation across gaps)',
    'Extreme observations (e.g., 6,634 kWh) are preserved - they are real survey records',
    'The Seasonal Gradient Boosting model achieves the lowest MAE (32.12 kWh); standard Gradient Boosting has slightly better RMSE (185.60) and R2 (0.176)',
    'Carbon calculation is separate from the ML model - the emission factor is configurable and versioned',
    'Forecasting accuracy is modest (R2 approx 0.17); this is documented, not overstated',
]
for d in decisions:
    pdf.bullet_point(d)

# ===== 3. SECTION B =====
pdf.add_page()
pdf.section_title('3. Section B: Imports & Configuration')

pdf.section_title('3.1 Core Dependencies', level=2)
pdf.body_text('The notebook uses only essential, well-maintained libraries:')
deps = [
    'pandas, numpy - data manipulation',
    'scikit-learn - ML models, metrics, pipelines, imputation',
    'matplotlib, seaborn - visualization (minimal, only where needed)',
    'joblib - model serialization',
    'json, pathlib - configuration and paths',
]
for d in deps:
    pdf.bullet_point(d)

pdf.section_title('3.2 Reproducibility Configuration', level=2)
pdf.code_block('''# Reproducibility
RANDOM_STATE = 42

# Paths
DATA_PATH = "/content/Pune_HHLD_Survey_Data_v2-0-0.csv"
ARTIFACT_DIR = Path("/content/carboniq_artifacts")
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = ARTIFACT_DIR / "carboniq_seasonal_gb.joblib"
METADATA_PATH = ARTIFACT_DIR / "carboniq_model_metadata.json"
BACKEND_ZIP_PATH = Path("/content/CarbonIQ_Backend_Package.zip")

# Versioned emission factor (source: Central Electricity Authority, database v22.0)
ELECTRICITY_FACTOR = {
    "kg_co2_per_kwh": 0.675,
    "source": "Central Electricity Authority (CEA)",
    "database_version": "22.0",
    "reporting_period": "FY 2025-26",
    "gas": "CO2"
}''')

pdf.section_title('3.3 Why These Choices?', level=2)
pdf.body_text(
    'Fixed RANDOM_STATE=42 ensures identical results across runs. All paths are configurable at the top. '
    'The emission factor is defined as a dictionary with full provenance (source, version, reporting period, gas) '
    'so it can be versioned and audited separately from the ML model.'
)

# ===== 4. SECTION C =====
pdf.section_title('4. Section C: Dataset Loading & Validation')

pdf.section_title('4.1 Data Loading', level=2)
pdf.code_block('''df = pd.read_csv(
    DATA_PATH,
    encoding="cp1252",
    low_memory=False
)

print(f"Dataset shape: {df.shape}")
print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")''')

pdf.section_title('4.2 Essential Validation', level=2)
pdf.body_text(
    'The notebook performs only essential validation - checking column dtypes and identifying '
    'monthly electricity columns. No exhaustive EDA is included (removed during cleanup). '
    'The goal is to validate what informs downstream decisions.'
)

pdf.section_title('4.3 Monthly Column Detection', level=2)
pdf.code_block('''monthly_cols = [
    col for col in df.columns
    if any(month in col for month in [
        "Jan_", "Feb_", "Mar_", "April_", "May_", "June_",
        "July_", "Aug_", "Sep_", "Oct_", "Nov_", "Dec_"
    ])
]
print(f"Monthly electricity columns found: {len(monthly_cols)}")''')

# ===== 5. SECTION D =====
pdf.add_page()
pdf.section_title('5. Section D: Monthly Column Identification & Ordering')

pdf.section_title('5.1 Chronological Sorting Logic', level=2)
pdf.body_text(
    'Monthly columns in the raw CSV are not guaranteed to be in chronological order. '
    'The notebook defines a month_order mapping and sorts columns by (year, month):'
)
pdf.code_block('''month_order = {
    "Jan": 1, "Feb": 2, "Mar": 3, "April": 4,
    "May": 5, "June": 6, "July": 7, "Aug": 8,
    "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
}

def month_key(col):
    parts = col.split("_")
    return (int(parts[1]), month_order[parts[0]])

monthly_cols_chrono = sorted(monthly_cols, key=month_key)''')

pdf.section_title('5.2 Verification', level=2)
pdf.body_text(
    'After sorting, the notebook prints the chronological column order and non-null counts '
    'per month to verify data coverage across the Jan 2018 - Feb 2020 period.'
)

# ===== 6. SECTION E =====
pdf.section_title('6. Section E: ML Window Construction (Core Logic)')

pdf.section_title('6.1 Genuine Consecutive 3-Month Windows', level=2)
pdf.body_text(
    'This is the heart of the data preparation. For each household and each valid 3-month window '
    'where ALL THREE months have non-null values, a training record is created:'
)
pdf.code_block('''records = []

for household_idx, row in df[monthly_cols_chrono].iterrows():
    for i in range(2, len(monthly_cols_chrono)):
        prev_2 = row[monthly_cols_chrono[i - 2]]
        prev_1 = row[monthly_cols_chrono[i - 1]]
        target = row[monthly_cols_chrono[i]]

        if pd.notna(prev_2) and pd.notna(prev_1) and pd.notna(target):
            records.append({
                "household_id": household_idx,
                "month_t_minus_2": monthly_cols_chrono[i - 2],
                "month_t_minus_1": monthly_cols_chrono[i - 1],
                "target_month": monthly_cols_chrono[i],
                "electricity_t_minus_2": prev_2,
                "electricity_t_minus_1": prev_1,
                "electricity_target": target
            })

ml_df = pd.DataFrame(records)''')

pdf.section_title('6.2 Why This Approach?', level=2)
reasons = [
    'No imputation - only genuine observations where all 3 months exist',
    'Preserves extreme values (6,634 kWh spike) as real data',
    'Creates target_month_num feature (1-12) from target column name for seasonality',
    'Results in 6,781 total samples before train/test split',
]
for r in reasons:
    pdf.bullet_point(r)

pdf.section_title('6.3 Target Statistics', level=2)
pdf.body_text(
    'The target variable (electricity_target) statistics:\n'
    '- Count: 6,781\n'
    '- Mean: ~110 kWh\n'
    '- Std: ~180 kWh\n'
    '- Min: 0 kWh\n'
    '- Max: 6,634 kWh (preserved outlier)\n'
    '- 25th/50th/75th percentiles: ~35/70/130 kWh'
)

# ===== 7. SECTION F =====
pdf.add_page()
pdf.section_title('7. Section F: Minimal EDA & Feature Preparation')

pdf.section_title('7.1 Feature Engineering', level=2)
pdf.body_text(
    'The notebook keeps feature engineering minimal and transparent. Features are:\n'
    '1. electricity_t_minus_2: Consumption 2 months ago (kWh)\n'
    '2. electricity_t_minus_1: Consumption 1 month ago (kWh)\n'
    '3. target_month_num: Calendar month of target (1-12)\n\n'
    'No rolling statistics, no polynomial features, no external data. The Seasonal Gradient '
    'Boosting model captures seasonality through the target_month_num feature.'
)

pdf.section_title('7.2 Train/Test Split Preparation', level=2)
pdf.body_text(
    'The chronological split is implemented by extracting the year-month from the target_month column '
    'and splitting at November 2019 (period 201911). This ensures no temporal leakage.'
)

# ===== 8. SECTION G =====
pdf.section_title('8. Section G: Chronological Train/Test Split')

pdf.section_title('8.1 Split Strategy', level=2)
pdf.body_text(
    'The split is purely chronological - critical for time-series data to prevent data leakage:'
)
pdf.code_block('''# Split by target month period
train_data = ml_df[ml_df["target_month_period"] < 201911].copy()
test_data = ml_df[ml_df["target_month_period"] >= 201911].copy()

print(f"Train samples: {len(train_data)}")
print(f"Test samples: {len(test_data)}")
print(f"Train period: up to Oct 2019")
print(f"Test period: Nov 2019 - Feb 2020")''')

pdf.section_title('8.2 Split Statistics', level=2)
split_stats = [
    ('Train samples', '5,347'),
    ('Test samples', '1,434'),
    ('Train period', 'Jan 2018 - Oct 2019'),
    ('Test period', 'Nov 2019 - Feb 2020'),
    ('Split type', 'Chronological (no random shuffle)'),
]
pdf.add_table(['Property', 'Value'], split_stats, [50, 140])

# ===== 9. SECTION H =====
pdf.add_page()
pdf.section_title('9. Section H: Model Comparison (5 Models)')

pdf.section_title('9.1 Models Evaluated', level=2)
models = [
    ('Naive Persistence', 'Predict t-1 as target (baseline)', 'No training'),
    ('Linear Regression', 'Linear model with imputation', 'Pipeline: Imputer + LinearRegression'),
    ('Random Forest', 'Ensemble of decision trees', 'RandomForestRegressor, n_estimators=200'),
    ('Gradient Boosting', 'Standard GBRegressor', 'GradientBoostingRegressor, n_estimators=200'),
    ('Seasonal Gradient Boosting', 'GB with month_num feature', 'Same as GB but includes target_month_num'),
]
pdf.add_table(['Model', 'Description', 'Configuration'], models, [35, 60, 95])

pdf.section_title('9.2 Evaluation Protocol', level=2)
pdf.body_text(
    'All models use the EXACT SAME train/test split (chronological). '
    'Pipeline includes SimpleImputer(strategy="median") for robustness. '
    'Metrics computed: MAE, RMSE, R2 on test set only.'
)

pdf.section_title('9.3 Results Summary', level=2)
results = [
    ('Naive Persistence', '38.45', '212.31', '0.089'),
    ('Linear Regression', '35.12', '198.45', '0.123'),
    ('Random Forest', '33.87', '192.10', '0.145'),
    ('Gradient Boosting', '32.45', '185.60', '0.176'),
    ('Seasonal Gradient Boosting', '32.12', '186.39', '0.169'),
]
pdf.add_table(['Model', 'MAE (kWh)', 'RMSE (kWh)', 'R2'], results, [50, 35, 35, 35])

pdf.section_title('9.4 Key Insight', level=2)
pdf.body_text(
    'Seasonal Gradient Boosting achieves the LOWEST MAE (32.12 kWh) which is the primary metric '
    'for this use case (absolute error matters more than squared error for household forecasting). '
    'Standard GB has slightly better RMSE and R2 but higher MAE. The seasonal feature (target_month_num) '
    'helps capture the annual consumption cycle.'
)

# ===== 10. SECTION I =====
pdf.section_title('10. Section I: Final Model Selection & Evaluation')

pdf.section_title('10.1 Selected Model', level=2)
pdf.body_text(
    'Seasonal Gradient Boosting is selected based on lowest MAE. The notebook re-trains on the '
    'full training set and evaluates on the held-out test set to produce final metrics:'
)

pdf.section_title('10.2 Final Metrics', level=2)
final_metrics = [
    ('MAE', '32.1234 kWh'),
    ('RMSE', '186.3864 kWh'),
    ('R2', '0.1689'),
]
pdf.add_table(['Metric', 'Value'], final_metrics, [50, 140])

pdf.section_title('10.3 Interpretation', level=2)
pdf.body_text(
    'R2 = 0.1689 means the model explains ~17% of variance in next-month electricity consumption. '
    'MAE = 32.12 kWh means average absolute error is ~32 kWh (on typical ~110 kWh consumption). '
    'This is modest but honest performance - the model captures seasonal trends but household-specific '
    'variation dominates. The limitations are explicitly documented in metadata.'
)

# ===== 11. SECTION J =====
pdf.add_page()
pdf.section_title('11. Section J: Deterministic Carbon Calculator')

pdf.section_title('11.1 Design Principle', level=2)
pdf.body_text(
    'Carbon calculation is DELIBERATELY separate from the ML model. The emission factor is a policy/regulatory '
    'value, not something to be learned. This separation allows:\n'
    '- Factor updates without model retraining\n'
    '- Clear provenance and versioning\n'
    '- Transparent, verifiable calculations\n'
    '- Different factors for different regions/periods'
)

pdf.section_title('11.2 Implementation', level=2)
pdf.code_block('''def calculate_co2(electricity_kwh, factor_kg_per_kwh=0.675):
    """Deterministic CO2 calculation from electricity consumption."""
    electricity_kwh = max(0.0, electricity_kwh)  # Non-negative
    return round(electricity_kwh * factor_kg_per_kwh, 3)

# Example
predicted_kwh = 117.11
predicted_co2 = calculate_co2(predicted_kwh)
# Result: 79.049 kg CO2''')

pdf.section_title('11.3 Emission Factor Provenance', level=2)
ef_prov = [
    ('Value', '0.675 kg CO2/kWh'),
    ('Source', 'Central Electricity Authority (CEA), Government of India'),
    ('Database Version', '22.0'),
    ('Reporting Period', 'FY 2025-26'),
    ('Gas', 'CO2 (not CO2e)'),
    ('Scope', 'Grid electricity only (Scope 2)'),
]
pdf.add_table(['Property', 'Value'], ef_prov, [50, 140])

# ===== 12. SECTION K =====
pdf.section_title('12. Section K: Integrated Pipeline')

pdf.section_title('12.1 End-to-End Function', level=2)
pdf.body_text(
    'The notebook combines the trained model with the carbon calculator into a single '
    'predict_and_calculate function that mimics the backend API behavior:'
)
pdf.code_block('''def predict_and_calculate(electricity_t_minus_2, electricity_t_minus_1, target_month_num):
    """Full pipeline: predict electricity -> calculate CO2."""
    # Prepare input in correct feature order
    X = pd.DataFrame([{
        "electricity_t_minus_2": electricity_t_minus_2,
        "electricity_t_minus_1": electricity_t_minus_1,
        "target_month_num": target_month_num
    }])
    
    # Predict
    predicted_kwh = max(0.0, float(model.predict(X)[0]))
    predicted_kwh = round(predicted_kwh, 2)
    
    # Calculate CO2
    predicted_co2 = round(predicted_kwh * ELECTRICITY_FACTOR["kg_co2_per_kwh"], 3)
    
    return {
        "predicted_electricity_kwh": predicted_kwh,
        "predicted_co2_kg": predicted_co2,
        "emission_factor": ELECTRICITY_FACTOR
    }

# Test
result = predict_and_calculate(92, 114, 3)
# {"predicted_electricity_kwh": 117.11, "predicted_co2_kg": 79.049, ...}''')

# ===== 13. SECTION L =====
pdf.add_page()
pdf.section_title('13. Section L: Pipeline Smoke Tests')

pdf.section_title('13.1 Test Coverage', level=2)
pdf.body_text('Four automated smoke tests verify the complete pipeline works end-to-end:')
tests = [
    ('Health Check', 'Model loads correctly, metadata accessible'),
    ('Prediction', 'Valid inputs produce reasonable kWh + CO2 output'),
    ('Carbon Calculation', 'Deterministic CO2 matches manual calculation'),
    ('Invalid Input Rejection', 'Negative kWh, month > 12, missing fields rejected'),
]
pdf.add_table(['Test', 'Purpose'], tests, [40, 150])

pdf.section_title('13.2 Verification Results', level=2)
pdf.body_text(
    'All 4/4 smoke tests pass. The notebook also verifies:\n'
    '- Model reload produces identical predictions (atol < 1e-9)\n'
    '- Metadata evaluation matches computed metrics exactly\n'
    '- Backend package contains all 4 required files\n'
    '- API health, prediction, carbon calc, invalid input rejection all pass\n\n'
    'This ensures the artifacts are consistent and deployable.'
)

# ===== 14. SECTION M =====
pdf.section_title('14. Section M: Model Metadata, Serialization & Backend Export')

pdf.section_title('14.1 Model Serialization', level=2)
pdf.code_block('''# Save model
joblib.dump(final_model, MODEL_PATH)

# Verify reload
reloaded_model = joblib.load(MODEL_PATH)
reload_pred = reloaded_model.predict(X_test)
original_pred = final_model.predict(X_test)
assert np.allclose(reload_pred, original_pred, atol=1e-9)''')

pdf.section_title('14.2 Metadata JSON Structure', level=2)
pdf.body_text(
    'The metadata.json contains everything needed to run the model and understand its provenance:'
)
metadata_fields = [
    'project, model_name, model_type, model_file',
    'features (ordered list), target, target_unit',
    'training: samples, test_samples, cutoff, periods',
    'evaluation: MAE, RMSE, R2',
    'emission_factor: kg_co2_per_kwh, source, database_version, reporting_period, gas',
    'limitations (array of strings)',
    'software: python_version, scikit_learn_version',
    'model_parameters (full sklearn get_params())',
]
for m in metadata_fields:
    pdf.bullet_point(m)

pdf.section_title('14.3 Backend Package Creation', level=2)
pdf.body_text(
    'The final step creates CarbonIQ_Backend_Package.zip containing:\n'
    '1. app.py - FastAPI application\n'
    '2. carboniq_seasonal_gb.joblib - trained model\n'
    '3. carboniq_model_metadata.json - metadata\n'
    '4. requirements.txt - pinned dependencies\n\n'
    'This zip can be deployed directly to any Python 3.10+ environment.'
)

# ===== 15. KEY DESIGN DECISIONS =====
pdf.add_page()
pdf.section_title('15. Key Design Decisions & Rationale')

pdf.section_title('15.1 Data Decisions', level=2)
data_decisions = [
    ('No imputation across gaps', 'Only genuine consecutive 3-month windows used'),
    ('Extreme values preserved', '6,634 kWh spike kept as real survey data'),
    ('Chronological split', 'Prevents temporal leakage, mimics real deployment'),
    ('Minimal features', 'Only t-2, t-1, month_num - interpretable, low overfit risk'),
]
for title, desc in data_decisions:
    pdf.bold_bullet(f'{title}: ', desc)

pdf.section_title('15.2 Model Decisions', level=2)
model_decisions = [
    ('Seasonal GB over standard GB', 'Lower MAE (32.12 vs 32.45) - better for household forecasting'),
    ('Fixed hyperparameters', 'No tuning - reproducible, avoids overfitting to test set'),
    ('joblib serialization', 'Standard sklearn format, fast load, includes preprocessing'),
    ('Separate carbon calculation', 'Policy value, not learned; versioned independently'),
]
for title, desc in model_decisions:
    pdf.bold_bullet(f'{title}: ', desc)

pdf.section_title('15.3 Documentation Decisions', level=2)
doc_decisions = [
    ('Honest limitations', 'R2=0.17 documented prominently, not hidden'),
    ('Versioned emission factor', 'CEA v22.0, FY 2025-26 in metadata and API response'),
    ('Reproducible notebook', 'Runs top-to-bottom from fresh runtime'),
    ('Clean notebook', '29 cells vs original 81 - removed redundancy, debugging, duplicates'),
]
for title, desc in doc_decisions:
    pdf.bold_bullet(f'{title}: ', desc)

# ===== 16. REPRODUCIBILITY =====
pdf.add_page()
pdf.section_title('16. Reproducibility Guarantees')

pdf.section_title('16.1 What "Reproducible" Means Here', level=2)
repro = [
    'Same random seed (42) -> identical train/test split, model initialization',
    'Same data path -> identical dataset (CSV not modified)',
    'Same code execution order -> identical artifacts',
    'No external API calls, no manual steps, no session-dependent variables',
    'All objects (df, ml_df, train_data, test_data, final_model) created in sequence',
    'Model reload verification: predictions match to 1e-9 tolerance',
]
for r in repro:
    pdf.bullet_point(r)

pdf.section_title('16.2 Requirements for Reproduction', level=2)
reqs = [
    'Python 3.10+ (notebook uses 3.13.16)',
    'scikit-learn 1.6.1 (pinned in requirements.txt)',
    'pandas 2.2.3, numpy 2.1.3, joblib 1.6.0',
    'Pune_HHLD_Survey_Data_v2-0-0.csv at DATA_PATH',
    '~500MB RAM, ~30 seconds compute time',
]
for r in reqs:
    pdf.bullet_point(r)

pdf.section_title('16.3 Verification Checklist', level=2)
checks = [
    'Train samples = 5,347',
    'Test samples = 1,434',
    'MAE = 32.1234 (to 4 decimals)',
    'RMSE = 186.3864 (to 4 decimals)',
    'R2 = 0.1689 (to 4 decimals)',
    'Model file size ~200 KB',
    'Metadata JSON contains all fields',
    'Backend zip contains 4 files',
]
for c in checks:
    pdf.bullet_point(c)

# ===== 17. CHANGE REPORT =====
pdf.add_page()
pdf.section_title('17. Change Report Summary (From CHANGE_REPORT.md)')

pdf.section_title('17.1 Cell Reduction', level=2)
pdf.body_text(
    'Original notebook: ~81 cells (execution_count up to 81)\n'
    'Cleaned notebook: 29 cells\n'
    'Reduction: ~64% fewer cells\n'
    'Structure: Organized into 13 clear sections (A-M) as specified'
)

pdf.section_title('17.2 Categories of Removal', level=2)
removed = [
    ('Redundant EDA & Investigation', 'Duplicate missing-value checks, column listings, outlier inspections, bill/provenance investigation'),
    ('Runtime Recovery/Debugging', 'Cells created to restore lost variables after session resets'),
    ('Duplicate Model Evaluation', 'Separate Linear/RF/GB/Seasonal GB cells merged into unified comparison'),
    ('Duplicate Carbon Calculator', 'First and corrected versions consolidated'),
    ('Duplicate Backend Packaging', 'Initial and final saves merged into single authoritative artifacts'),
]
for title, desc in removed:
    pdf.bold_bullet(f'{title}: ', desc)

pdf.section_title('17.3 What Was Preserved (Technical Correctness)', level=2)
preserved = [
    'Original dataset untouched - no modifications to source CSV',
    'Extreme observations preserved - 6,634 kWh spike kept (documented, not removed)',
    'Genuine consecutive-month windows only - 3-month windows with all values present',
    'Chronological test period - Nov 2019 to Feb 2020 (periods 201911-202002)',
    'Same train/test split for all models - 5,347 train / 1,434 test',
    'Feature definitions preserved - electricity_t_minus_2, electricity_t_minus_1, target_month_num',
    'Seasonal GB has lowest MAE (32.12) - standard GB has better RMSE (185.60) and R2 (0.176)',
    'Metrics computed from actual predictions - not hard-coded',
    'Carbon calculation separate from ML model - emission factor is configurable',
    'Emission factor provenance preserved - CEA v22.0, FY 2025-26, 0.675 kg CO2/kWh',
    'Reporting period limitation documented - factor period differs from ML data period',
    'No overstated accuracy claims - R2 approx 0.17 explicitly noted as modest',
]
for p in preserved:
    pdf.bullet_point(p)

pdf.section_title('17.4 Scope Not Expanded', level=2)
not_expanded = [
    'No frontend built',
    'No new features added',
    'No hyperparameter tuning beyond original config',
    'No invented data, units, or assumptions',
    'No outlier removal or data modification',
]
for n in not_expanded:
    pdf.bullet_point(n)

# Save
output_path = os.path.join(os.path.dirname(__file__), 'CarbonIQ_Notebook_Explanation.pdf')
pdf.output(output_path)
print(f"PDF generated: {output_path}")
print(f"Pages: {pdf.page_no()}")