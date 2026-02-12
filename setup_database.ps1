# After PostgreSQL Installation - Quick Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Database Setup for Indira BrainStorm" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you configure the database after installing PostgreSQL." -ForegroundColor Yellow
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking if PostgreSQL is installed..." -ForegroundColor Cyan

$pgPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
$pgPath15 = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
$pgPath17 = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

$psqlExe = $null

if (Test-Path $pgPath) {
    $psqlExe = $pgPath
    Write-Host "✓ Found PostgreSQL 16" -ForegroundColor Green
} elseif (Test-Path $pgPath17) {
    $psqlExe = $pgPath17
    Write-Host "✓ Found PostgreSQL 17" -ForegroundColor Green
} elseif (Test-Path $pgPath15) {
    $psqlExe = $pgPath15
    Write-Host "✓ Found PostgreSQL 15" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL not found in default location" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Remember the password you set for 'postgres' user" -ForegroundColor White
    Write-Host "4. Run this script again after installation" -ForegroundColor White
    Write-Host ""
    Write-Host "See INSTALL_POSTGRESQL.md for detailed instructions." -ForegroundColor Cyan
    pause
    exit
}

Write-Host ""
Write-Host "Step 1: Enter PostgreSQL Password" -ForegroundColor Yellow
Write-Host "Enter the password you set during PostgreSQL installation:" -ForegroundColor White
$pgPassword = Read-Host -AsSecureString "Password"
$pgPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

Write-Host ""
Write-Host "Step 2: Creating Database" -ForegroundColor Yellow
Write-Host "Creating 'indira_brainstorm' database..." -ForegroundColor Cyan

# Create database using psql
$env:PGPASSWORD = $pgPasswordPlain
& $psqlExe -U postgres -c "CREATE DATABASE indira_brainstorm;" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "Database may already exist or there was an error." -ForegroundColor Yellow
    Write-Host "Checking if database exists..." -ForegroundColor Cyan
    
    $checkDb = & $psqlExe -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='indira_brainstorm';" 2>$null
    if ($checkDb -match "1") {
        Write-Host "✓ Database 'indira_brainstorm' already exists!" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create database. Please check your password and try again." -ForegroundColor Red
        pause
        exit
    }
}

Write-Host ""
Write-Host "Step 3: Updating Backend Configuration" -ForegroundColor Yellow

$envPath = "backend\.env"
$connectionString = "DATABASE_URL=postgresql://postgres:$pgPasswordPlain@localhost:5432/indira_brainstorm"

# Update .env file
$envContent = Get-Content $envPath
$envContent[0] = $connectionString
$envContent | Set-Content $envPath

Write-Host "✓ Updated backend\.env with database credentials" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Seeding Database with Questions" -ForegroundColor Yellow
Write-Host "Running seed script..." -ForegroundColor Cyan

cd backend
python seed_questions.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your database is ready! Now you can start the application:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Terminal 1 - Backend:" -ForegroundColor Cyan
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  uvicorn app.main:app --reload" -ForegroundColor White
    Write-Host ""
    Write-Host "Terminal 2 - Frontend:" -ForegroundColor Cyan
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Then open: http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Error seeding database" -ForegroundColor Red
    Write-Host "Please check the error above and try again." -ForegroundColor Yellow
}

cd ..
Write-Host ""
pause
