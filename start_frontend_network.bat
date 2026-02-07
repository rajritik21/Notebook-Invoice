@echo off
echo ========================================
echo Starting Frontend Server (Network Mode)
echo ========================================
echo.
echo Make sure backend .env has CORS_ORIGINS set to your IP!
echo.
cd frontend
npm run start:network
pause

