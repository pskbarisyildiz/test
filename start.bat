@echo off
cd /d "%~dp0"

REM --- Server Start ---
echo Starting Python Web Server on port 8000...
REM The /b flag runs the server in the background without creating a new console window
start /b "Python Server" cmd /c "python -m http.server 8000"
timeout /t 3 /nobreak > nul

REM --- Launch Chrome Explicitly ---
echo Launching Google Chrome at http://localhost:8000/index.html
REM Replace "Program Files\Google\Chrome\Application\chrome.exe" with your actual Chrome path if different
set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
set URL="http://localhost:8000/index.html"

REM --- MODIFIED LINE ---
REM Replaced --kiosk with --start-fullscreen to allow developer tools
REM After it launches, press F12 to open the console.
start "" %CHROME_PATH% --start-fullscreen %URL%

exit