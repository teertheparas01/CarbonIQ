@echo off
setlocal enabledelayedexpansion

echo Testing prerequisites...

python --version >nul 2>nul
echo After python --version, errorlevel=%errorlevel%
if %errorlevel% neq 0 (
    echo "Inside if: errorlevel=%errorlevel%"
    echo Python not found (trying python3)
    python3 --version >nul 2>nul
    echo After python3 --version, errorlevel=%errorlevel%
    if %errorlevel% neq 0 (
        echo Error: Python not found
        goto :interactive_pause
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    echo "Inside else: errorlevel=%errorlevel%"
    set PYTHON_CMD=python
)

echo PYTHON_CMD=!PYTHON_CMD!

:interactive_pause
pause