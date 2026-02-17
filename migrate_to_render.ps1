$ErrorActionPreference = "Stop"

# Configuration
$PG_PATH = "C:\Program Files\PostgreSQL\18\bin"
$LOCAL_DB = "indira_brainstorm"
$LOCAL_USER = "postgres"
# Note: PGPASSWORD environment variable or .pgpass file is usually needed for password, 
# but for now we'll rely on prompt if needed or default setup. 
# Attempting to read local password from .env if possible, but for simplicity let's assume they know it or it's trusted.
# Actually, the user's local connection string is in .env: postgres://postgres:Mypass%4024@localhost:5432/indira_brainstorm

Write-Host "🚀 Indira BrainSpark Database Migrator" -ForegroundColor Cyan
Write-Host "-------------------------------------"

# 1. Get Render External Database URL
Write-Host "To migrate your data, we need the EXTERNAL Database URL from Render."
Write-Host "1. Go to your Render Dashboard -> MySQL/PostgreSQL"
Write-Host "2. Click on 'iu-quiz-db'"
Write-Host "3. Scroll down to 'Connections'"
Write-Host "4. Copy the 'External Database URL' (starts with postgres://... and ends with .render.com)"
Write-Host ""
$RenderDBUrl = Read-Host "Paste the External Database URL here"

if ([string]::IsNullOrWhiteSpace($RenderDBUrl)) {
    Write-Error "Database URL cannot be empty."
    exit 1
}

# 2. Confirm
Write-Host ""
Write-Host "⚠️  WARNING: This will overwrite data in the Render database with your local data."
$confirmation = Read-Host "Are you sure you want to proceed? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Migration cancelled."
    exit 0
}

# 3. Validation
if (-not (Test-Path "$PG_PATH\pg_dump.exe")) {
    Write-Error "pg_dump.exe not found at $PG_PATH. Please check your PostgreSQL installation."
    exit 1
}

# 4. Set PGPASSWORD for local DB (from .env knowledge), though pg_dump might ask if not set.
# We saw Mypass@24 in .env. Let's try to set it to avoid prompt.
$env:PGPASSWORD = "Mypass@24" 

# 5. Run Migration
Write-Host "1. Exporting local data..." -NoNewline
# We use --no-owner --no-acl to avoid permission issues on Render
# We pipe directly to psql for the remote DB
# Note: We need psql for the remote part. ps_dump outputs text/sql.
# We also need to parse the Render URL to pass to psql, OR psql can take the URL directly as an argument.

$ExportCmd = "& `"$PG_PATH\pg_dump.exe`" -h localhost -U $LOCAL_USER -d $LOCAL_DB --no-owner --no-acl --clean --if-exists --quote-all-identifiers"
$ImportCmd = "& `"$PG_PATH\psql.exe`" `"$RenderDBUrl`""

# Execute via Invoke-Expression to handle the pipe
Write-Host "transmitting to Render..."
# PowerShell piping of binary/encoding can be tricky. 
# Best way is to let pg_dump write to a file, then psql read from file.

$TempFile = "$env:TEMP\iu_quiz_dump.sql"

# Export
& "$PG_PATH\pg_dump.exe" -h localhost -U $LOCAL_USER -d $LOCAL_DB --no-owner --no-acl --clean --if-exists --quote-all-identifiers -f $TempFile
if ($LASTEXITCODE -eq 0) {
    Write-Host "Done." -ForegroundColor Green
} else {
    Write-Error "Export failed."
    exit 1
}

Write-Host "2. Importing to Render..."
# Import
# We need to unset PGPASSWORD because the remote DB likely has a different password embedded in the URL.
# However, psql with a URL argument uses the password from the URL.
$env:PGPASSWORD = $null 

& "$PG_PATH\psql.exe" "$RenderDBUrl" -f $TempFile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migration Complete!" -ForegroundColor Green
    Write-Host "Your local database has been cloned to Render."
} else {
    Write-Error "Import failed."
}

# Cleanup
if (Test-Path $TempFile) {
    Remove-Item $TempFile
}
