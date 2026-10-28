@echo off
REM CarbonIQ Launcher - Windows Batch Version
REM Double-click this file to start both backend and frontend

title CarbonIQ Launcher
color 0A

echo ============================================================
echo   CarbonIQ Launcher
echo ============================================================
echo.

REM Check if we're in the right directory
if not exist "backend\app.py" (
    echo ERROR: backend\app.py not found
    echo Please run this from the CarbonIQ project root directory
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ERROR: frontend\package.json not found
    echo Please run this from the CarbonIQ project root directory
    pause
    exit /b 1
)

echo Starting CarbonIQ...
echo.

REM --- Backend Setup ---
echo [1/4] Setting up backend...
if not exist "backend\.venv" (
    echo Creating Python virtual environment...
    python -m venv backend\.venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo Installing backend dependencies...
call backend\.venv\Scripts\pip install -r backend\requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

REM --- Frontend Setup ---
echo [2/4] Setting up frontend...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend && npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
)

REM --- Start Servers ---
echo [3/4] Starting backend server (FastAPI)...
start "CarbonIQ Backend" cmd /k "cd /d backend && call .venv\Scripts\activate && python -m uvicorn app:app --reload"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo [4/4] Starting frontend server (Vite)...
start "CarbonIQ Frontend" cmd /k "cd /d frontend && npm run dev"

echo Waiting for frontend to start...
timeout /t 3 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:5173

echo.
echo ============================================================
echo   CarbonIQ is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://127.0.0.1:8000
echo   API Docs: http://127.0.0.1:8000/docs
echo ============================================================
echo.
echo Close this window to stop both servers.
echo ============================================================

pause