@echo off
setlocal enabledelayedexpansion

python --version >nul 2>nul
echo errorlevel=%errorlevel%

if %errorlevel% neq 0 (
    echo "Inside IF block"
    echo errorlevel=%errorlevel%
) else (
    echo "Inside ELSE block"
    echo errorlevel=%errorlevel%
)

echo Done
pause