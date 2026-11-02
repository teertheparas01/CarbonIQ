@echo off
setlocal enabledelayedexpansion

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    Starting CarbonIQ                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM --- Check prerequisites ---
echo Checking prerequisites...

REM Use a more reliable check for Python
python --version >nul 2>nul
echo DEBUG: python errorlevel=%errorlevel%
if %errorlevel% neq 0 (
    echo DEBUG: trying python3
    python3 --version >nul 2>nul
    echo DEBUG: python3 errorlevel=%errorlevel%
    if %errorlevel% neq 0 (
        echo Error: Python not found. Please install Python 3.10+
        goto :interactive_pause
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    set PYTHON_CMD=python
)

echo DEBUG: PYTHON_CMD=%PYTHON_CMD%

node --version >nul 2>nul
echo DEBUG: node errorlevel=%errorlevel%
if %errorlevel% neq 0 (
    echo Error: Node.js not found. Please install Node.js 18+
    goto :interactive_pause
)

echo DEBUG: About to check npm
npm --version >nul 2>nul
echo DEBUG: npm errorlevel=%errorlevel%
if %errorlevel% neq 0 (
    echo Error: npm not found. Please install Node.js (includes npm)
    goto :interactive_pause
)

echo DEBUG: All prerequisites passed
echo Prerequisites OK
echo.

REM --- BACKEND SETUP ---
echo [Backend] Setting up...
cd /d "%BACKEND_DIR%"
echo DEBUG: BACKEND_DIR=%BACKEND_DIR%

if not exist ".venv" (
    echo [Backend] Creating virtual environment...
    %PYTHON_CMD% -m venv .venv
)

echo [Backend] Activating virtual environment...
call .venv\Scripts\activate.bat

echo [Backend] Installing dependencies...
pip install -q -r requirements.txt

echo [Backend] Starting on http://127.0.0.1:8000
start "CarbonIQ Backend" cmd /k "cd /d "%BACKEND_DIR%" && call .venv\Scripts\activate.bat && uvicorn app:app --reload --host 127.0.0.1 --port 8000"

REM Give backend a moment to start
timeout /t 3 /nobreak >nul

REM --- FRONTEND SETUP ---
echo [Frontend] Setting up...
cd /d "%FRONTEND_DIR%"
echo DEBUG: FRONTEND_DIR=%FRONTEND_DIR%

if not exist "node_modules" (
    echo [Frontend] Installing dependencies (first run)...
    npm install
)

echo [Frontend] Starting on http://localhost:5173
start "CarbonIQ Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║  CarbonIQ is running!                                        ║
echo ║                                                              ║
echo ║  Backend:  http://127.0.0.1:8000                             ║
echo ║  Frontend: http://localhost:5173                             ║
echo ║  API Health: http://127.0.0.1:8000/health                    ║
echo ║  API Predict: POST http://127.0.0.1:8000/predict             ║
echo ║                                                              ║
echo ║  Close the two console windows to stop servers               ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

cd /d "%PROJECT_ROOT%"

:interactive_pause
echo.
echo Setup complete. Servers are running in separate windows.
echo Press any key to close this window, or close it manually.
pause >nul
exit /b 0