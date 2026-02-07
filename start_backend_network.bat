@echo off
echo ========================================
echo Starting Backend Server (Network Mode)
echo ========================================
echo.
echo Server will be accessible on your local network
echo Make sure to update frontend .env with your IP!
echo.
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
pause

