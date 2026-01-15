# Test runner script for Makana backend (PowerShell)

Write-Host "🧪 Running Makana Backend Tests" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Run all tests with coverage
Write-Host "📊 Running all tests with coverage..." -ForegroundColor Yellow
pytest --cov=. --cov-report=term-missing --cov-report=html -v

# Check exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📈 Coverage report generated in htmlcov/index.html" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Some tests failed. Please review the output above." -ForegroundColor Red
    exit 1
}
