# Initial setup script for Makana development (PowerShell)

Write-Host "🌱 Setting up Makana development environment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check for Conda
if (-not (Get-Command conda -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Conda not found. Please install Miniconda or Anaconda first." -ForegroundColor Red
    Write-Host "   Visit: https://docs.conda.io/en/latest/miniconda.html" -ForegroundColor Yellow
    exit 1
}

# Create Conda environment
Write-Host "📦 Creating Conda environment..." -ForegroundColor Yellow
conda env create -f environment.yml

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Activate environment: conda activate makana" -ForegroundColor White
Write-Host "  2. Copy .env.example to .env and add your Supabase credentials" -ForegroundColor White
Write-Host "  3. Run: .\scripts\dev.ps1" -ForegroundColor White
Write-Host ""
