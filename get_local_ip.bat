@echo off
echo Finding your local IP address...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP: =!
    echo Your local IP address is: !IP!
    echo.
    echo Use this IP to access from other devices on the same network
    echo Backend: http://!IP!:8000
    echo Frontend: http://!IP!:3000
    echo.
    pause
    exit /b
)
echo Could not find IP address
pause

