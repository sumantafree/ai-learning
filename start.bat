@echo off
echo ============================================
echo   AI Learning System - Local Dev Startup
echo ============================================
echo.

:: Start backend in its own persistent window
echo [1/2] Starting FastAPI backend on port 8002...
start "AI Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && python -m uvicorn main:app --host 0.0.0.0 --port 8002"

:: Wait for backend to be ready
timeout /t 5 /nobreak > nul

:: Start frontend in its own persistent window
echo [2/2] Starting Next.js frontend on port 3000...
start "AI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
echo Backend:  http://localhost:8002
echo API Docs: http://localhost:8002/docs
echo Frontend: http://localhost:3000
echo.
echo Keep both windows open while using the app.
echo.
pause
