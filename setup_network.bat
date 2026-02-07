@echo off
echo ========================================
echo Network Setup for InvoiceHub
echo ========================================
echo.
echo This script will configure your project to run on the local network.
echo.
echo First, let's find your IP address...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    echo Found IP: !IP!
    echo.
    set /p CONFIRM="Use this IP? (Y/N): "
    if /i "!CONFIRM!"=="Y" goto :update
    if /i "!CONFIRM!"=="y" goto :update
)

:input_ip
echo.
set /p IP="Enter your local IP address: "

:update
echo.
echo Updating configuration files...
echo.

REM Update backend .env
cd backend
if exist .env (
    python -c "import re; content = open('.env', 'r', encoding='utf-8').read(); content = re.sub(r'CORS_ORIGINS=.*', 'CORS_ORIGINS=http://localhost:3000,http://%IP%:3000', content); open('.env', 'w', encoding='utf-8').write(content)"
    echo [OK] Backend .env updated
) else (
    echo MONGO_URL=mongodb://localhost:27017 > .env
    echo DB_NAME=invoicehub >> .env
    echo CORS_ORIGINS=http://localhost:3000,http://%IP%:3000 >> .env
    echo SECRET_KEY=your-secret-key-change-in-production-12345678 >> .env
    echo [OK] Backend .env created
)

REM Update frontend .env
cd ..\frontend
echo REACT_APP_BACKEND_URL=http://%IP%:8000 > .env
echo [OK] Frontend .env updated

echo.
echo ========================================
echo Configuration Complete!
echo ========================================
echo.
echo Your IP: %IP%
echo.
echo Access URLs:
echo   Frontend: http://%IP%:3000
echo   Backend:  http://%IP%:8000
echo   API Docs: http://%IP%:8000/docs
echo.
echo Next steps:
echo   1. Start backend: start_backend_network.bat
echo   2. Start frontend: start_frontend_network.bat
echo   3. Access from other devices using the URLs above
echo.
pause

