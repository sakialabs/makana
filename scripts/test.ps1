# Run Makana tests (PowerShell)

Write-Host "🧪 Running Makana tests" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

# Run tests with coverage
pytest --cov=. --cov-report=term-missing --cov-report=html -v

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    Write-Host "📈 Coverage report: backend/htmlcov/index.html" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Some tests failed" -ForegroundColor Red
    exit 1
}
