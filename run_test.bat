@echo off
echo ========================================
echo  RUNNING FORTUNE SNAKE GAME TEST
echo ========================================
echo.

echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Run EASY_INSTALL.bat first
    pause
    exit /b 1
)

echo Installing dependencies...
pip install selenium webdriver-manager >nul 2>&1

echo.
echo Starting game test...
echo Chrome browser will open automatically
echo.
python game_test.py

echo.
echo Test completed!
pause