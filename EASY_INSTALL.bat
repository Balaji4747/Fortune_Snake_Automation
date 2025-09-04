@echo off
echo ========================================
echo  FORTUNE SNAKE GAME TESTER SETUP
echo ========================================
echo.

echo Checking if Python is installed...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo Python found! Installing game testing tools...
echo.

pip install selenium webdriver-manager

echo.
echo ========================================
echo  SETUP COMPLETE!
echo ========================================
echo.
echo Now you can run the game test by double-clicking "run_test.bat"
echo.
pause