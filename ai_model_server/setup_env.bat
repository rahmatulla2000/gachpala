@echo off
chcp 65001 >nul
echo ========================================================
echo   🌳 Fruit Tree AI - Environment Setup (One-Time)
echo ========================================================
echo.

where conda >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Conda detected!
    echo Creating dedicated Python 3.10 environment 'tree_ai' for TensorFlow compatibility...
    call conda create -n tree_ai python=3.10 -y
    echo Activating 'tree_ai'...
    call conda activate tree_ai
    echo Installing dependencies (TensorFlow, FastAPI, Uvicorn, Pillow, NumPy)...
    pip install fastapi uvicorn python-multipart tensorflow numpy pillow requests
    echo.
    echo ========================================================
    echo   [SUCCESS] Setup Completed!
    echo   Now run 'run_local_server.bat' to start the AI server.
    echo ========================================================
) else (
    echo [INFO] Conda not found, trying pip with current Python...
    pip install fastapi uvicorn python-multipart tensorflow numpy pillow requests
    echo.
    echo [SUCCESS] Dependencies installed.
)

pause
