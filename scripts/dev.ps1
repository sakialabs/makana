# Start Makana development environment (PowerShell)

Write-Host "🚀 Starting Makana development environment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  No .env file found. Copying from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "📝 Please edit .env with your Supabase credentials before continuing." -ForegroundColor Yellow
    exit 1
}

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
docker-compose up

# Note: API will be available at http://localhost:8000
# Docs at http://localhost:8000/docs
