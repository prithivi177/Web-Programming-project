@echo off
setlocal EnableDelayedExpansion

:: --------------------------------------------------------------------
:: Check for Administrator elevation; if not elevated, request it
:: --------------------------------------------------------------------
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ========================================================
    echo   Requesting Administrator Privileges...
    echo   Please click "YES" on the Windows permission prompt.
    echo ========================================================
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
    exit /b
)

cd /d "%~dp0"
title Sweet Crumbs - Reset MySQL Root Password

echo ========================================================
echo   Sweet Crumbs — MySQL Password Reset Utility
echo ========================================================
echo.
echo [1/5] Stopping MySQL80 service...
net stop MySQL80
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo.
echo [2/5] Creating password reset command file...
if not exist "C:\ProgramData\MySQL" mkdir "C:\ProgramData\MySQL"
set "INIT_FILE_WIN=C:\ProgramData\MySQL\mysql_reset_init.txt"
set "INIT_FILE_MYSQL=C:/ProgramData/MySQL/mysql_reset_init.txt"
(
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
echo FLUSH PRIVILEGES;
) > "%INIT_FILE_WIN%"

echo.
echo [3/5] Applying new password 'root123' to MySQL Server...
start "" /b "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --init-file="%INIT_FILE_MYSQL%" --console
timeout /t 8 /nobreak >nul

echo.
echo [4/5] Stopping temporary MySQL instance...
taskkill /F /IM mysqld.exe >nul 2>&1
timeout /t 3 /nobreak >nul
if exist "%INIT_FILE_WIN%" del "%INIT_FILE_WIN%"

echo.
echo [5/5] Restarting MySQL80 service with new password...
net start MySQL80
timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo   Initializing Sweet Crumbs Database and Products...
echo ========================================================
node backend/scripts/setup-db.js

echo.
echo ========================================================
echo   SUCCESS!
echo   - MySQL Password is now: root123
echo   - sweet_crumbs_db has been created and populated!
echo ========================================================
echo.
pause
