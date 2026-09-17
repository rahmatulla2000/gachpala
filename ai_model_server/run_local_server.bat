@echo off
chcp 65001 >nul
title 🌳 Fruit Tree AI Server - MobileNetV3
echo ========================================================
echo   🌳 Fruit Tree AI Server (MobileNetV3Large)
echo ========================================================
echo.

cd /d "%~dp0"

if not exist "MobileNetV3Large_FruitTree_92.67.keras" (
    echo [WARNING] 'MobileNetV3Large_FruitTree_92.67.keras' file was not found!
    echo.
    echo Please make sure your .keras file is placed inside:
    echo %cd%
    echo.
)

where conda >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Activating Conda 'tree_ai' environment...
    call conda activate tree_ai 2>nul
)

echo [INFO] Starting FastAPI Inference Server on http://127.0.0.1:5000 ...
echo [INFO] Press Ctrl+C anytime to stop.
echo.

python app.py

pause
