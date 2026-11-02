@echo off
setlocal enabledelayedexpansion

echo Testing npm...

npm --version >nul 2>nul
echo After npm, errorlevel=%errorlevel%

if %errorlevel% neq 0 (
    echo "npm not found"
) else (
    echo "npm found"
)

echo Done
pause