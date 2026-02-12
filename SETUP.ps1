# Indira BrainStorm - Quick Setup Guide

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Indira BrainStorm Quiz Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 1: Database Setup" -ForegroundColor Yellow
Write-Host "You need PostgreSQL to run this application." -ForegroundColor White
Write-Host ""
Write-Host "Option A - Local PostgreSQL:" -ForegroundColor Green
Write-Host "  1. Install PostgreSQL from https://www.postgresql.org/download/" -ForegroundColor White
Write-Host "  2. Create database: psql -U postgres -c 'CREATE DATABASE indira_brainstorm;'" -ForegroundColor White
Write-Host "  3. Update backend\.env with your PostgreSQL password" -ForegroundColor White
Write-Host ""
Write-Host "Option B - Cloud PostgreSQL (Recommended):" -ForegroundColor Green
Write-Host "  1. Sign up at https://supabase.com/ or https://neon.tech/" -ForegroundColor White
Write-Host "  2. Create a new project and database" -ForegroundColor White
Write-Host "  3. Copy the connection string" -ForegroundColor White
Write-Host "  4. Update backend\.env with the connection string" -ForegroundColor White
Write-Host ""

$dbChoice = Read-Host "Have you set up PostgreSQL? (yes/no)"

if ($dbChoice -ne "yes") {
    Write-Host ""
    Write-Host "Please set up PostgreSQL first, then run this script again." -ForegroundColor Red
    Write-Host "See README.md for detailed instructions." -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "STEP 2: Installing Backend Dependencies" -ForegroundColor Yellow
Write-Host "Installing Python packages..." -ForegroundColor White

cd backend

# Try to install dependencies
Write-Host "Installing FastAPI and core dependencies..." -ForegroundColor Cyan
pip install fastapi uvicorn[standard] sqlalchemy pydantic python-dotenv python-multipart

Write-Host ""
Write-Host "Installing PostgreSQL driver..." -ForegroundColor Cyan
Write-Host "Trying psycopg2-binary first..." -ForegroundColor White

$psycopgInstalled = $false

try {
    pip install psycopg2-binary 2>$null
    if ($LASTEXITCODE -eq 0) {
        $psycopgInstalled = $true
        Write-Host "✓ psycopg2-binary installed successfully!" -ForegroundColor Green
    }
} catch {
    Write-Host "psycopg2-binary failed to install." -ForegroundColor Yellow
}

if (-not $psycopgInstalled) {
    Write-Host ""
    Write-Host "Trying alternative: psycopg2..." -ForegroundColor White
    try {
        pip install psycopg2 2>$null
        if ($LASTEXITCODE -eq 0) {
            $psycopgInstalled = $true
            Write-Host "✓ psycopg2 installed successfully!" -ForegroundColor Green
        }
    } catch {
        Write-Host "psycopg2 also failed." -ForegroundColor Yellow
    }
}

if (-not $psycopgInstalled) {
    Write-Host ""
    Write-Host "⚠ PostgreSQL driver installation failed." -ForegroundColor Red
    Write-Host "This is common on Windows. Solutions:" -ForegroundColor Yellow
    Write-Host "  1. Use cloud PostgreSQL (Supabase/Neon) - no local install needed" -ForegroundColor White
    Write-Host "  2. Install PostgreSQL locally first, then try again" -ForegroundColor White
    Write-Host "  3. Use asyncpg: pip install asyncpg" -ForegroundColor White
    Write-Host ""
    Write-Host "See README.md for detailed troubleshooting." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "STEP 3: Seeding Database" -ForegroundColor Yellow
$seedChoice = Read-Host "Do you want to seed the database with questions now? (yes/no)"

if ($seedChoice -eq "yes") {
    Write-Host "Running seed script..." -ForegroundColor Cyan
    python seed_questions.py
}

cd ..

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the application:" -ForegroundColor Yellow
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
Write-Host ""
Write-Host "For detailed instructions, see README.md" -ForegroundColor Yellow
Write-Host ""

pause
