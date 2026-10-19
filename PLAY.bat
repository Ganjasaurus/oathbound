@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.12 or newer to run Oathbound.
  pause
  exit /b 1
)
if not exist node_modules (
  call npm.cmd install --no-audit --no-fund
  if errorlevel 1 exit /b 1
)
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://127.0.0.1:5173"
call npm.cmd run dev
