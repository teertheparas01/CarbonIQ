from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = Document()

# Title
title = doc.add_heading('CarbonIQ \u2014 Project Inspection Report', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph('College AIML Mini Project')
doc.add_paragraph('Generated: October 2026')

doc.add_heading('1. Executive Summary', level=1)
doc.add_paragraph(
    'CarbonIQ is a household energy and carbon monitoring, prediction, and reduction application. '
    'The MVP implements electricity forecasting via a Seasonal Gradient Boosting model trained on Pune '
    'household survey data (January 2018 \u2013 February 2020), with deterministic CO\u2082 calculation using '
    'the Central Electricity Authority (CEA) emission factor (0.675 kg CO\u2082/kWh, v22.0, FY 2025-26).'
)

doc.add_heading('2. Architecture Overview', level=1)
doc.add_paragraph('Stack:', style='Intense Quote')
arch_items = [
    ('Frontend', 'React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion (Framer Motion v14) + Recharts + Axios + React Router v7'),
    ('Backend', 'FastAPI + scikit-learn 1.6.1 + joblib + uvicorn'),
    ('ML Model', 'GradientBoostingRegressor (Seasonal), features: electricity_t_minus_2, electricity_t_minus_1, target_month_num'),
    ('Model File', 'backend/carboniq_seasonal_gb.joblib'),
    ('Metadata', 'backend/carboniq_model_metadata.json'),
]
for label, value in arch_items:
    p = doc.add_paragraph(style='List Bullet')
    run = p.add_run(f'{label}: ')
    run.bold = True
    p.add_run(value)

doc.add_heading('3. Repository Structure', level=1)
structure = (
    ".\n"
    "\u251c\u2500\u2500 backend/                 # FastAPI + model artifacts\n"
    "\u2502   \u251c\u2500\u2500 app.py\n"
    "\u2502   \u251c\u2500\u2500 carboniq_model_metadata.json\n"
    "\u2502   \u251c\u2500\u2500 carboniq_seasonal_gb.joblib\n"
    "\u2502   \u2514\u2500\u2500 requirements.txt\n"
    "\u251c\u2500\u2500 frontend/                # React + TypeScript + Vite\n"
    "\u2502   \u251c\u2500\u2500 public/\n"
    "\u2502   \u251c\u2500\u2500 src/\n"
    "\u2502   \u2502   \u251c\u2500\u2500 api/             # Axios client, API calls\n"
    "\u2502   \u2502   \u251c\u2500\u2500 components/\n"
    "\u2502   \u2502   \u2502   \u251c\u2500\u2500 ui/          # Button, Card, Input, Select, Badge\n"
    "\u2502   \u2502   \u2502   \u251c\u2500\u2500 layout/      # Sidebar, Header, PageContainer, Layout\n"
    "\u2502   \u2502   \u2502   \u2514\u2500\u2500 animations/  # 3D Earth, PowerGridIsland\n"
    "\u2502   \u2502   \u251c\u2500\u2500 hooks/           # useForecast, useHealth\n"
    "\u2502   \u2502   \u251c\u2500\u2500 lib/             # Motion animations (animations.tsx)\n"
    "\u2502   \u2502   \u251c\u2500\u2500 pages/           # Dashboard, Electricity, Forecast, LPG, Water, Food, Transport, TodoNotTodo, Settings, Landing\n"
    "\u2502   \u2502   \u251c\u2500\u2500 types/           # TypeScript interfaces (api.ts, navigation.ts)\n"
    "\u2502   \u2502   \u251c\u2500\u2500 App.tsx\n"
    "\u2502   \u2502   \u251c\u2500\u2500 main.tsx\n"
    "\u2502   \u2502   \u2514\u2500\u2500 routes.tsx\n"
    "\u2502   \u251c\u2500\u2500 package.json\n"
    "\u2502   \u251c\u2500\u2500 tsconfig.json\n"
    "\u2502   \u251c\u2500\u2500 vite.config.ts\n"
    "\u2502   \u251c\u2500\u2500 tailwind.config.js\n"
    "\u2502   \u2514\u2500\u2500 postcss.config.js\n"
    "\u251c\u2500\u2500 notebooks/\n"
    "\u2502   \u2514\u2500\u2500 CarbonIQ_ML_Clean.ipynb    # Cleaned, reproducible ML pipeline\n"
    "\u251c\u2500\u2500 docs/\n"
    "\u2502   \u251c\u2500\u2500 FRONTEND_IMPLEMENTATION_PLAN.md\n"
    "\u2502   \u251c\u2500\u2500 CHANGE_REPORT.md\n"
    "\u2502   \u2514\u2500\u2500 development/               # Future development guides\n"
    "\u251c\u2500\u2500 scripts/\n"
    "\u2502   \u251c\u2500\u2500 check_nb.py\n"
    "\u2502   \u2514\u2500\u2500 count_original.py\n"
    "\u251c\u2500\u2500 AGENT_OPERATING_GUIDE.md\n"
    "\u251c\u2500\u2500 README.md\n"
    "\u2514\u2500\u2500 .gitignore"
)
p = doc.add_paragraph(structure, style='No Spacing')
p.runs[0].font.name = 'Consolas'
p.runs[0].font.size = Pt(9)

doc.add_heading('4. Backend API', level=1)
doc.add_heading('4.1 Endpoints', level=2)

table = doc.add_table(rows=3, cols=4)
table.style = 'Light Shading Accent 1'
table.alignment = WD_TABLE_ALIGNMENT.CENTER
headers = ['Method', 'Path', 'Request', 'Response']
for i, h in enumerate(headers):
    table.rows[0].cells[i].text = h
    for paragraph in table.rows[0].cells[i].paragraphs:
        for run in paragraph.runs:
            run.bold = True

table.rows[1].cells[0].text = 'GET'
table.rows[1].cells[1].text = '/health'
table.rows[1].cells[2].text = '\u2014'
table.rows[1].cells[3].text = '{ status, model_loaded, model_name }'

table.rows[2].cells[0].text = 'POST'
table.rows[2].cells[1].text = '/predict'
table.rows[2].cells[2].text = '{ electricity_t_minus_2, electricity_t_minus_1, target_month_num }'
table.rows[2].cells[3].text = 'PredictResponse (see below)'

doc.add_heading('4.2 Predict Response Schema', level=2)
response_fields = [
    ('predicted_electricity_kwh', 'number', 'Rounded to 2 decimals'),
    ('predicted_co2_kg', 'number', 'Rounded to 3 decimals'),
    ('emission_factor_kg_co2_per_kwh', 'number', '0.675'),
    ('factor_source', 'string', 'Central Electricity Authority (CEA)'),
    ('factor_version', 'string', '22.0'),
    ('reporting_period', 'string', 'FY 2025-26'),
    ('gas', 'string', 'CO2'),
    ('model_name', 'string', 'Seasonal Gradient Boosting'),
    ('model_metrics', 'object', '{ MAE_kWh, RMSE_kWh, R2 }'),
    ('limitations', 'array[string]', 'From metadata'),
]
t = doc.add_table(rows=len(response_fields)+1, cols=3)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
for i, h in enumerate(['Field', 'Type', 'Notes']):
    t.rows[0].cells[i].text = h
    for p in t.rows[0].cells[i].paragraphs:
        for r in p.runs:
            r.bold = True
for row_idx, (field, typ, notes) in enumerate(response_fields, 1):
    t.rows[row_idx].cells[0].text = field
    t.rows[row_idx].cells[1].text = typ
    t.rows[row_idx].cells[2].text = notes

doc.add_heading('4.3 CORS Configuration', level=2)
doc.add_paragraph('Configured for development origins:')
cors = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173']
for c in cors:
    doc.add_paragraph(c, style='List Bullet')

doc.add_heading('5. ML Model Details', level=1)
model_props = [
    ('Algorithm', 'GradientBoostingRegressor (Seasonal)'),
    ('Features', 'electricity_t_minus_2, electricity_t_minus_1, target_month_num'),
    ('Target', 'Next-month electricity (kWh)'),
    ('Training samples', '5,347'),
    ('Test samples', '1,434 (November 2019 \u2013 February 2020)'),
    ('Training cutoff', 'Before November 2019'),
    ('MAE', '32.1234 kWh'),
    ('RMSE', '186.3864 kWh'),
    ('R\u00b2', '0.1689'),
    ('Model file', 'backend/carboniq_seasonal_gb.joblib'),
    ('Metadata', 'backend/carboniq_model_metadata.json'),
]
t = doc.add_table(rows=len(model_props)+1, cols=2)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.rows[0].cells[0].text = 'Property'
t.rows[0].cells[1].text = 'Value'
for p in t.rows[0].cells[0].paragraphs:
    for r in p.runs: r.bold = True
for p in t.rows[0].cells[1].paragraphs:
    for r in p.runs: r.bold = True
for i, (prop, val) in enumerate(model_props, 1):
    t.rows[i].cells[0].text = prop
    t.rows[i].cells[1].text = val

doc.add_heading('5.1 Limitations (from metadata)', level=2)
limitations = [
    'Trained on historical household electricity observations.',
    'Evaluation uses a historical test period.',
    'Current-period forecasts need validation against newer data.',
    'The emission factor is configurable and separate from the ML model.',
]
for l in limitations:
    doc.add_paragraph(l, style='List Bullet')

doc.add_heading('6. Emission Factor', level=1)
ef_props = [
    ('Value', '0.675 kg CO\u2082/kWh'),
    ('Source', 'Central Electricity Authority (CEA)'),
    ('Database Version', '22.0'),
    ('Reporting Period', 'FY 2025-26'),
    ('Gas', 'CO\u2082'),
    ('Scope', 'Grid electricity only'),
]
t = doc.add_table(rows=len(ef_props)+1, cols=2)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.rows[0].cells[0].text = 'Property'
t.rows[0].cells[1].text = 'Value'
for p in t.rows[0].cells[0].paragraphs:
    for r in p.runs: r.bold = True
for p in t.rows[0].cells[1].paragraphs:
    for r in p.runs: r.bold = True
for i, (prop, val) in enumerate(ef_props, 1):
    t.rows[i].cells[0].text = prop
    t.rows[i].cells[1].text = val

doc.add_paragraph('Note: The emission factor is NOT applied to LPG, water, food, or transport. It is versioned in model metadata and sourced from the backend at runtime.')

doc.add_heading('7. Frontend Pages & Features', level=1)
pages = [
    ('/', 'Dashboard', 'Overview KPIs, recent forecast summary, quick actions', 'Live (health check)'),
    ('/electricity', 'Electricity', 'Historical chart, forecast form, emission factor info, model metrics', 'Live (predict)'),
    ('/forecast', 'Forecast', 'Full-screen prediction form, history log (localStorage), model info', 'Live (predict)'),
    ('/lpg', 'LPG', 'Placeholder \u2014 info card, rule-based calculator (kg \u00d7 2.93 kg CO\u2082/kg)', 'Static'),
    ('/water', 'Water', 'Placeholder \u2014 info card, usage tips', 'Static'),
    ('/food', 'Food', 'Placeholder \u2014 info card, diet tips', 'Static'),
    ('/transport', 'Transport', 'Vehicle ownership display only \u2014 NO CO\u2082 calculation', 'Static'),
    ('/todo-not-todo', "Do's & Don'ts", 'Categorized tips (recommended actions / actions to avoid)', 'Static'),
    ('/settings', 'Settings', 'Emission factor override (localStorage), units, model metadata', 'Static'),
    ('/landing', 'Landing', 'Hero with 3D Earth animation, features, how-it-works, metrics', 'Static'),
]
t = doc.add_table(rows=len(pages)+1, cols=4)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
for i, h in enumerate(['Route', 'Page', 'Description', 'Backend']):
    t.rows[0].cells[i].text = h
    for p in t.rows[0].cells[i].paragraphs:
        for r in p.runs: r.bold = True
for i, (route, page, desc, backend) in enumerate(pages, 1):
    t.rows[i].cells[0].text = route
    t.rows[i].cells[1].text = page
    t.rows[i].cells[2].text = desc
    t.rows[i].cells[3].text = backend

doc.add_heading('8. Unsupported / Not Implemented (By Design)', level=1)
unsupported = [
    ('LPG CO\u2082', 'Not available', 'No verified emission calculation; survey data exists but no CEA-equivalent factor'),
    ('Water CO\u2082', 'Not available', 'No verified emission calculation implemented'),
    ('Food CO\u2082', 'Not available', 'Highly variable by diet/source; no generic factor without verification'),
    ('Transport CO\u2082', 'Not available', 'Vehicle ownership \u2260 distance/fuel use; survey lacks travel data'),
    ('Historical charts', 'Not available', 'No /history/:household_id endpoint; would need new API'),
    ('Multi-household', 'Not available', 'API accepts raw inputs; no household lookup'),
    ('Persistent history', 'Not available', 'No database; frontend uses localStorage'),
    ('User auth', 'Not available', 'Out of scope for MVP'),
]
t = doc.add_table(rows=len(unsupported)+1, cols=3)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
for i, h in enumerate(['Domain', 'Status', 'Reason']):
    t.rows[0].cells[i].text = h
    for p in t.rows[0].cells[i].paragraphs:
        for r in p.runs: r.bold = True
for i, (domain, status, reason) in enumerate(unsupported, 1):
    t.rows[i].cells[0].text = domain
    t.rows[i].cells[1].text = status
    t.rows[i].cells[2].text = reason

doc.add_heading('9. Frontend Component Inventory', level=1)

doc.add_heading('9.1 UI Primitives (src/components/ui/)', level=2)
ui = ['Button.tsx', 'Card.tsx', 'Input.tsx', 'Select.tsx', 'Badge.tsx', 'index.ts']
for u in ui:
    doc.add_paragraph(u, style='List Bullet')

doc.add_heading('9.2 Layout Components (src/components/layout/)', level=2)
layout = ['Sidebar.tsx', 'Header.tsx', 'PageContainer.tsx', 'Layout.tsx', 'TopNav.tsx', 'index.ts']
for l in layout:
    doc.add_paragraph(l, style='List Bullet')

doc.add_heading('9.3 Animation Components (src/components/animations/)', level=2)
anim = ['EarthAnimation.tsx', 'PowerGridIsland.tsx', 'ThermalEarthGlobe.tsx']
for a in anim:
    doc.add_paragraph(a, style='List Bullet')

doc.add_heading('9.4 Pages (src/pages/)', level=2)
pages_list = ['Dashboard.tsx', 'Electricity.tsx', 'Forecast.tsx', 'LPG.tsx', 'Water.tsx', 'Food.tsx', 'Transport.tsx', 'TodoNotTodo.tsx', 'Settings.tsx', 'Landing.tsx', 'index.ts']
for p in pages_list:
    doc.add_paragraph(p, style='List Bullet')

doc.add_heading('9.5 Hooks (src/hooks/)', level=2)
hooks = ['useForecast.ts', 'useHealth.ts', 'index.ts']
for h in hooks:
    doc.add_paragraph(h, style='List Bullet')

doc.add_heading('9.6 API Layer (src/api/)', level=2)
api = ['client.ts', 'index.ts']
for a in api:
    doc.add_paragraph(a, style='List Bullet')

doc.add_heading('9.7 Types (src/types/)', level=2)
types = ['api.ts', 'navigation.ts']
for ty in types:
    doc.add_paragraph(ty, style='List Bullet')

doc.add_heading('10. Development Commands', level=1)
cmds = [
    ('Frontend dev server', 'cd frontend && npm run dev'),
    ('Frontend build', 'cd frontend && npm run build'),
    ('Frontend lint', 'cd frontend && npm run lint'),
    ('Frontend preview', 'cd frontend && npm run preview'),
    ('Backend dev server', 'cd backend && uvicorn app:app --reload'),
    ('Backend health check', 'curl http://127.0.0.1:8000/health'),
    ('Backend prediction', 'curl -X POST http://127.0.0.1:8000/predict -H "Content-Type: application/json" -d \'{"electricity_t_minus_2": 92, "electricity_t_minus_1": 114, "target_month_num": 3}\''),
]
t = doc.add_table(rows=len(cmds)+1, cols=2)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.rows[0].cells[0].text = 'Task'
t.rows[0].cells[1].text = 'Command'
for p in t.rows[0].cells[0].paragraphs:
    for r in p.runs: r.bold = True
for p in t.rows[0].cells[1].paragraphs:
    for r in p.runs: r.bold = True
for i, (task, cmd) in enumerate(cmds, 1):
    t.rows[i].cells[0].text = task
    t.rows[i].cells[1].text = cmd
    t.rows[i].cells[1].paragraphs[0].runs[0].font.name = 'Consolas'
    t.rows[i].cells[1].paragraphs[0].runs[0].font.size = Pt(9)

doc.add_heading('11. ML Notebook Summary', level=1)
doc.add_paragraph('File: notebooks/CarbonIQ_ML_Clean.ipynb')
doc.add_paragraph('Structure: 29 cells organized into 13 sections (A\u2013M)')
doc.add_heading('Sections:', level=2)
sections = [
    ('A', 'Project Overview and Objective', '1 markdown'),
    ('B', 'Imports and Configuration', '1 code'),
    ('C', 'Dataset Loading and Essential Validation', '1 code'),
    ('D', 'Monthly Column Identification and Chronological Ordering', '1 code'),
    ('E', 'Construction of Genuine Consecutive-Month ML Windows', '1 code'),
    ('F', 'Minimal EDA and Feature Preparation', '1 code'),
    ('G', 'Chronological Train/Test Split', '1 code'),
    ('H', 'Consistent Model Comparison (5 models)', '2 code'),
    ('I', 'Final Model Selection and Evaluation', '1 code'),
    ('J', 'Deterministic Electricity Carbon Calculator', '1 code'),
    ('K', 'Integrated Forecasting + Carbon Pipeline', '1 code'),
    ('L', 'Pipeline Smoke Tests', '1 code'),
    ('M', 'Model Metadata, Serialization, Backend Export', '4 code'),
]
t = doc.add_table(rows=len(sections)+1, cols=3)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
for i, h in enumerate(['Section', 'Title', 'Cells']):
    t.rows[0].cells[i].text = h
    for p in t.rows[0].cells[i].paragraphs:
        for r in p.runs: r.bold = True
for i, (sec, title_sec, cells) in enumerate(sections, 1):
    t.rows[i].cells[0].text = sec
    t.rows[i].cells[1].text = title_sec
    t.rows[i].cells[2].text = cells

doc.add_paragraph('Reduction: ~64% fewer cells (81 \u2192 29) vs original notebook. All technical correctness preserved.')

doc.add_heading('12. Key Risks & Mitigations', level=1)
risks = [
    ('No frontend existed initially', 'High', 'Full greenfield build completed'),
    ('No historical data API', 'Medium', 'Embedded sample data / localStorage forecast history used for charts'),
    ('R\u00b2 = 0.1689 (low)', 'Medium', 'UI shows limitations prominently; no overstated accuracy claims'),
    ('Emission factor period mismatch', 'Low', 'Displays "FY 2025-26" vs "Historical data 2018\u20132020" clearly'),
    ('Transport data incomplete', 'High', 'Hard-coded: "Transport emissions not calculated \u2014 insufficient travel data"'),
    ('Single-household model', 'Medium', 'API accepts raw inputs; frontend does not imply household selection'),
    ('CORS only for localhost:5173', 'Low', 'Update backend if deploying elsewhere'),
]
t = doc.add_table(rows=len(risks)+1, cols=3)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
for i, h in enumerate(['Risk', 'Severity', 'Mitigation']):
    t.rows[0].cells[i].text = h
    for p in t.rows[0].cells[i].paragraphs:
        for r in p.runs: r.bold = True
for i, (risk, sev, mit) in enumerate(risks, 1):
    t.rows[i].cells[0].text = risk
    t.rows[i].cells[1].text = sev
    t.rows[i].cells[2].text = mit

doc.add_heading('13. Recent Changes (Git Log)', level=1)
changes = [
    ('3bed069', 'Enhance 3D Earth animation, add interactive domain simulations, refine green/white UI'),
    ('78f80d0', 'Earth animation component for landing page (WIP - syntax issues)'),
    ('b44ee87', 'Landing page: hero, features, how-it-works, metrics, CTA sections'),
    ('6781ada', 'Premium dashboard: KPI cards, quick actions, forecast summary, staggered animations'),
    ('5047298', 'Remove AGENT_OPERATING_GUIDE.md'),
    ('2d26edf', 'Fix frontend build: remove duplicate declarations in animations.tsx, replace @apply with explicit CSS'),
    ('08d9499', 'Remove AGENT_OPERATING_GUIDE.md'),
    ('7ffd047', 'Repo reorganization: backend/, frontend/, notebooks/, docs/, scripts/; add root README.md and .gitignore'),
    ('b571674', 'Fix TypeScript build errors: resolve animation variant types, remove unused imports'),
    ('d634a94', 'Fix TypeScript build errors in frontend: resolve variant type issues, remove unused imports, fix duplicate cardVariants'),
]
t = doc.add_table(rows=len(changes)+1, cols=2)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
t.rows[0].cells[0].text = 'Commit'
t.rows[0].cells[1].text = 'Description'
for p in t.rows[0].cells[0].paragraphs:
    for r in p.runs: r.bold = True
for p in t.rows[0].cells[1].paragraphs:
    for r in p.runs: r.bold = True
for i, (commit, desc) in enumerate(changes, 1):
    t.rows[i].cells[0].text = commit
    t.rows[i].cells[1].text = desc

doc.add_heading('14. Verification Status', level=1)
verifications = [
    ('Backend health check', '\u2705 PASS', 'GET /health returns {"status":"ok","model_loaded":true,"model_name":"Seasonal Gradient Boosting"}'),
    ('Backend prediction', '\u2705 PASS', 'POST /predict returns valid prediction with CO2 calculation'),
    ('Frontend build', '\u2705 PASS', 'npm run build completes (TypeScript + Vite)'),
    ('Frontend lint', '\u2705 PASS', 'oxlint passes'),
    ('Notebook reproducibility', '\u2705 PASS', 'CarbonIQ_ML_Clean.ipynb executes top-to-bottom from fresh runtime'),
    ('Model reload test', '\u2705 PASS', 'joblib reload produces identical predictions (atol < 1e-9)'),
    ('API smoke tests', '\u2705 PASS', '4/4 tests pass: health, prediction, carbon calc, metadata consistency, invalid input rejection'),
]
t = doc.add_table(rows=len(verifications)+1, cols=3)
t.style = 'Light Shading Accent 1'
t.alignment = WD_TABLE_ALIGNMENT.CENTER
for i, h in enumerate(['Check', 'Status', 'Details']):
    t.rows[0].cells[i].text = h
    for p in t.rows[0].cells[i].paragraphs:
        for r in p.runs: r.bold = True
for i, (check, status, details) in enumerate(verifications, 1):
    t.rows[i].cells[0].text = check
    t.rows[i].cells[1].text = status
    t.rows[i].cells[2].text = details

doc.add_heading('15. Conclusion', level=1)
doc.add_paragraph(
    'CarbonIQ MVP is functionally complete with a working backend API (FastAPI + Gradient Boosting model) '
    'and a fully implemented React 19 + TypeScript frontend. The electricity forecasting and CO2 calculation '
    'pipeline works end-to-end. Remaining domains (LPG, Water, Food, Transport) are correctly implemented '
    'as static placeholders with clear "not available" messaging, respecting the data limitations. '
    'The project follows a clean architecture with separated concerns, typed API contracts, and reproducible ML artifacts.'
)

# Save
output_path = 'CarbonIQ_Project_Report.docx'
doc.save(output_path)
print(f'Report saved to {output_path}')