<# 
.SYNOPSIS
    CarbonIQ - Start both backend and frontend servers (Windows PowerShell)
.DESCRIPTION
    Starts the FastAPI backend and Vite frontend development servers.
.USAGE
    .\start.ps1 (run from project root in PowerShell)
#>

param(
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Definition
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"

# Colors
$Green = [ConsoleColor]::Green
$Blue = [ConsoleColor]::Blue
$Yellow = [ConsoleColor]::Yellow
$Red = [ConsoleColor]::Red
$Gray = [ConsoleColor]::DarkGray

function Write-Color($Message, $Color) {
    Write-Host $Message -ForegroundColor $Color
}

function Check-Command($Command, $Name, $InstallHint) {
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        Write-Color "Error: $Name not found. $InstallHint" $Red
        exit 1
    }
    Write-Color "OK: $Name found" $Green
}

# Header
Write-Color "================================================================" $Blue
Write-Color "                    Starting CarbonIQ                          " $Blue
Write-Color "================================================================" $Blue
Write-Host ""

# --- Check prerequisites ---
Write-Color "Checking prerequisites..." $Yellow

Check-Command "python" "Python" "Please install Python 3.10+ from python.org"
Check-Command "node" "Node.js" "Please install Node.js 18+ from nodejs.org"
Check-Command "npm" "npm" "Included with Node.js installation"

Write-Host ""

# --- BACKEND SETUP ---
Write-Color "[Backend] Setting up..." $Blue
Set-Location $BACKEND_DIR

if (-not (Test-Path ".venv")) {
    Write-Color "[Backend] Creating virtual environment..." $Yellow
    python -m venv .venv
}

Write-Color "[Backend] Activating virtual environment..." $Yellow
& "$BACKEND_DIR\.venv\Scripts\Activate.ps1"

Write-Color "[Backend] Installing dependencies..." $Yellow
pip install -q -r requirements.txt

Write-Color "[Backend] Starting on http://127.0.0.1:8000" $Green
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BACKEND_DIR'; & '.venv\Scripts\Activate.ps1'; uvicorn app:app --reload --host 127.0.0.1 --port 8000" -PassThru

# Give backend a moment to start
Start-Sleep -Seconds 3

# --- FRONTEND SETUP ---
Write-Color "[Frontend] Setting up..." $Blue
Set-Location $FRONTEND_DIR

if (-not (Test-Path "node_modules")) {
    Write-Color "[Frontend] Installing dependencies (first run)..." $Yellow
    npm install
}

Write-Color "[Frontend] Starting on http://localhost:5173" $Green
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FRONTEND_DIR'; npm run dev" -PassThru

# --- STATUS ---
Write-Host ""
Write-Color "================================================================" $Blue
Write-Color "  CarbonIQ is running!                                        " $Blue
Write-Color "                                                              " $Blue
Write-Color "  Backend:  http://127.0.0.1:8000                             " $Blue
Write-Color "  Frontend: http://localhost:5173                             " $Blue
Write-Color "  API Health: http://127.0.0.1:8000/health                    " $Blue
Write-Color "  API Predict: POST http://127.0.0.1:8000/predict             " $Blue
Write-Color "                                                              " $Blue
Write-Color "  Press Ctrl+C to stop both servers                           " $Blue
Write-Color "================================================================" $Blue
Write-Host ""

# Open browser (optional)
if (-not $NoBrowser) {
    Start-Sleep -Seconds 2
    try {
        Start-Process "http://localhost:5173"
    } catch {
        Write-Color "Note: Could not auto-open browser. Open http://localhost:5173 manually." $Gray
    }
}

# --- WAIT AND CLEANUP ---
Write-Color "Servers running in separate PowerShell windows." $Gray
Write-Color "Close those windows or press Ctrl+C here to stop." $Gray

try {
    # Keep script alive until user presses Ctrl+C
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host ""
    Write-Color "Shutting down servers..." $Yellow
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Color "Done." $Green
}