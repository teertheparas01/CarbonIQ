@echo off
REM CarbonIQ - Start both backend and frontend servers (Windows CMD)
REM Usage: start.bat (run from project root in Command Prompt)

setlocal enabledelayedexpansion

set PROJECT_ROOT=%~dp0
set BACKEND_DIR=%PROJECT_ROOT%backend
set FRONTEND_DIR=%PROJECT_ROOT%frontend

echo.
echo Checking prerequisites...

python --version >nul 2>nul
if %errorlevel% neq 0 goto :python_not_found
set PYTHON_CMD=python
goto :python_checked

:python_not_found
python3 --version >nul 2>nul
if %errorlevel% neq 0 goto :interactive_pause
set PYTHON_CMD=python3

:python_checked

node --version >nul 2>nul
if %errorlevel% neq 0 goto :interactive_pause

call where npm >nul 2>nul
if %errorlevel% neq 0 goto :interactive_pause

echo Prerequisites OK
echo.

REM --- BACKEND SETUP ---
echo [Backend] Setting up...
cd /d "%BACKEND_DIR%"

if not exist ".venv" (
    echo [Backend] Creating virtual environment...
    %PYTHON_CMD% -m venv .venv
)

echo [Backend] Activating virtual environment...
call .venv\Scripts\activate.bat

echo [Backend] Installing dependencies...
pip install -q -r requirements.txt

echo [Backend] Starting on http://127.0.0.1:8000
start "CarbonIQ Backend" cmd /k "cd /d ^"%BACKEND_DIR%^" && call .venv\Scripts\activate.bat && uvicorn app:app --reload --host 127.0.0.1 --port 8000"

REM Give backend a moment to start
timeout /t 3 /nobreak >nul

REM --- FRONTEND SETUP ---
echo [Frontend] Setting up...
cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo [Frontend] Installing dependencies on first run...
    npm install
)

echo [Frontend] Starting on http://localhost:5173
start "CarbonIQ Frontend" cmd /k "cd /d ^"%FRONTEND_DIR%^" && npm run dev"

echo.
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
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

cd /d "%PROJECT_ROOT%"

:interactive_pause
echo.
echo Setup complete. Servers are running in separate windows.
echo Press any key to close this window, or close it manually.
pause >nul
exit /b 0
