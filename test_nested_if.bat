@echo off
setlocal enabledelayedexpansion

python --version >nul 2>nul
echo After python, errorlevel=%errorlevel%

if %errorlevel% neq 0 (
    echo "Inside first IF"
    python3 --version >nul 2>nul
    echo After python3, errorlevel=%errorlevel%
    if %errorlevel% neq 0 (
        echo "Inside nested IF"
    ) else (
        echo "Inside nested ELSE"
        set PYTHON_CMD=python3
    )
) else (
    echo "Inside first ELSE"
    set PYTHON_CMD=python
)

echo PYTHON_CMD=!PYTHON_CMD!
pause