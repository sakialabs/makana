# Manual API testing helper (PowerShell)

$API_URL = "http://localhost:8000"

Write-Host "🔧 Makana API Testing Helper" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "API: $API_URL" -ForegroundColor White
Write-Host "Docs: $API_URL/docs" -ForegroundColor White
Write-Host ""

# Check if API is running
try {
    $response = Invoke-WebRequest -Uri "$API_URL/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "✅ API is running" -ForegroundColor Green
} catch {
    Write-Host "❌ API is not running. Start it with: .\scripts\dev.ps1" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Quick test commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Sign up" -ForegroundColor Yellow
Write-Host "curl -X POST $API_URL/api/v1/auth/signup ``" -ForegroundColor White
Write-Host "  -H 'Content-Type: application/json' ``" -ForegroundColor White
Write-Host "  -d '{`"email`":`"test@example.com`",`"password`":`"password123`"}'" -ForegroundColor White
Write-Host ""
Write-Host "# Sign in (save token)" -ForegroundColor Yellow
Write-Host "`$TOKEN = (curl -X POST $API_URL/api/v1/auth/signin ``" -ForegroundColor White
Write-Host "  -H 'Content-Type: application/json' ``" -ForegroundColor White
Write-Host "  -d '{`"email`":`"test@example.com`",`"password`":`"password123`"}' ``" -ForegroundColor White
Write-Host "  | ConvertFrom-Json).access_token" -ForegroundColor White
Write-Host ""
Write-Host "# Create daily check" -ForegroundColor Yellow
Write-Host "curl -X POST $API_URL/api/v1/daily-check ``" -ForegroundColor White
Write-Host "  -H `"Authorization: Bearer `$TOKEN`" ``" -ForegroundColor White
Write-Host "  -H 'Content-Type: application/json' ``" -ForegroundColor White
Write-Host "  -d '{`"responses`":{`"energy`":`"medium`"}}'" -ForegroundColor White
Write-Host ""
Write-Host "For interactive testing, visit: $API_URL/docs" -ForegroundColor Cyan
Write-Host ""
