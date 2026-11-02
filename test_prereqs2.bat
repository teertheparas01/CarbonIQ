@echo off
setlocal enabledelayedexpansion

echo Testing prerequisites...

echo Running: python --version >nul 2>nul
python --version >nul 2>nul
echo errorlevel=%errorlevel%
if %errorlevel% neq 0 (
    echo Python not found (trying python3)
    python3 --version >nul 2>nul
    echo errorlevel=%errorlevel%
    if %errorlevel% neq 0 (
        echo Error: Python not found
        goto :interactive_pause
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    set PYTHON_CMD=python
)

echo PYTHON_CMD=!PYTHON_CMD!

echo Running: node --version >nul 2>nul
node --version >nul 2>nul
echo errorlevel=%errorlevel%
if %errorlevel% neq 0 (
    echo Error: Node.js not found
    goto :interactive_pause
)

echo Running: npm --version >nul 2>nul
npm --version >nul 2>nul
echo errorlevel=%errorlevel%
if %errorlevel% neq 0 (
    echo Error: npm not found
    goto :interactive_pause
)

echo Prerequisites OK
echo.

:interactive_pause
pause