@echo off
title Flipkart Clone Starter
echo ===================================================
echo             FLIPKART CLONE RUNNER
echo ===================================================
echo.
echo [INFO] Checking and installing dependencies...
.\venv\Scripts\pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [WARNING] Failed to update/check dependencies. Trying to start server anyway...
)
echo [INFO] Starting Flask server...
start http://127.0.0.1:5000/
.\venv\Scripts\python backend\app.py
pause
