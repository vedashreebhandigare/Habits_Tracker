@echo off
echo Opening Habit Tracker...
start http://localhost:5174
cd /d "%~dp0"
call npm run dev
