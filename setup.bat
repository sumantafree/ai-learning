@echo off
echo ============================================
echo   AI Learning System - First Time Setup
echo ============================================
echo.

:: Backend setup
echo [BACKEND] Setting up Python environment...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt

echo.
echo [BACKEND] Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env created. PLEASE EDIT IT with your API keys before running!
)
cd ..

:: Frontend setup
echo.
echo [FRONTEND] Installing Node.js dependencies...
cd frontend
npm install

echo.
if not exist .env.local (
    copy .env.local.example .env.local
    echo .env.local created.
)
cd ..

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo NEXT STEPS:
echo 1. Edit backend\.env with your:
echo    - DATABASE_URL (PostgreSQL connection string)
echo    - SECRET_KEY   (any random secret)
echo    - OPENAI_API_KEY
echo.
echo 2. Run start.bat to launch both servers
echo.
pause
