@echo off
echo.
echo ========================================
echo   Smart Navigation System - Quick Start
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Clear vite cache if it exists
if exist "node_modules\.vite" (
    echo Clearing Vite cache...
    rmdir /s /q "node_modules\.vite"
    echo.
)

echo Starting development server...
echo.
echo App will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
