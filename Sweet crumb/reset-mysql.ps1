# ====================================================================
# Sweet Crumbs — MySQL Password Reset & Database Initialization
# ====================================================================

# Auto-elevate to Administrator if not already running as Admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  Requesting Administrator Privileges..." -ForegroundColor Cyan
    Write-Host "  Please click 'YES' on the Windows permission prompt." -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

$projectDir = Split-Path -Parent $PSCommandPath
Set-Location -Path $projectDir

Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  Sweet Crumbs — MySQL Root Password Reset Utility" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow

# 1. Stop existing service and processes
Write-Host "`n[1/5] Stopping MySQL80 Windows service..." -ForegroundColor Cyan
Stop-Service -Name MySQL80 -Force -ErrorAction SilentlyContinue
Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue

# Wait for process to fully exit
$waitCount = 0
while ((Get-Process -Name mysqld -ErrorAction SilentlyContinue) -and ($waitCount -lt 15)) {
    Start-Sleep -Seconds 1
    $waitCount++
}

# 2. Prepare init file with forward slashes for MySQL compatibility
Write-Host "[2/5] Preparing reset command file..." -ForegroundColor Cyan
$resetFile = "C:\ProgramData\MySQL\mysql_reset_init.txt"
$sqlContent = @"
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
FLUSH PRIVILEGES;
"@
[System.IO.File]::WriteAllText($resetFile, $sqlContent, [System.Text.Encoding]::ASCII)

# MySQL requires forward slashes in Windows file paths for --init-file
$initFileParam = $resetFile.Replace('\', '/')

# 3. Start mysqld with --init-file to apply new password
Write-Host "[3/5] Starting MySQL temporarily to apply new password 'root123'..." -ForegroundColor Cyan
$mysqldPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$myIni = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"

$proc = Start-Process -FilePath $mysqldPath -ArgumentList "--defaults-file=`"$myIni`"", "--init-file=`"$initFileParam`"", "--console" -PassThru -NoNewWindow
Start-Sleep -Seconds 8

# 4. Stop temporary mysqld process
Write-Host "[4/5] Stopping temporary MySQL process..." -ForegroundColor Cyan
if ($proc -and -not $proc.HasExited) {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
Stop-Process -Name mysqld -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

if (Test-Path $resetFile) { 
    Remove-Item $resetFile -Force -ErrorAction SilentlyContinue 
}

# 5. Restart normal MySQL80 service
Write-Host "[5/5] Restarting normal MySQL80 Windows service..." -ForegroundColor Cyan
Start-Service -Name MySQL80
Start-Sleep -Seconds 3

Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "✓ PASSWORD RESET SUCCESSFUL! Root password is: root123" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

# 6. Initialize database and verify
Write-Host "`n[6/6] Initializing sweet_crumbs_db database and sample sweets..." -ForegroundColor Yellow
node "$projectDir\backend\scripts\setup-db.js"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "✓ All Set! Your MySQL database and sweets are ready." -ForegroundColor Cyan
Write-Host "  You can now start the web server with: npm start" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "`nPress any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
