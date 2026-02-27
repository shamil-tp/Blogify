# 404 Error Diagnostic Script
# Run this to help identify what's causing the 404 error

Write-Host "ogDoc 404 Error Diagnostic Tool" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Backend Health
Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $backendHealth = Invoke-RestMethod -Uri "https://ogdoc.onrender.com/health" -Method Get -TimeoutSec 10
    if ($backendHealth.status -eq "ok") {
        Write-Host "   OK: Backend is healthy!" -ForegroundColor Green
        Write-Host "   Response: $($backendHealth | ConvertTo-Json -Compress)" -ForegroundColor Gray
    } else {
        Write-Host "   Warning: Backend returned unexpected response" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   Error: Backend health check failed!" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Check Local Backend
Write-Host "2. Testing Local Backend (Port 5001)..." -ForegroundColor Yellow
try {
    $localBackend = Invoke-RestMethod -Uri "http://localhost:5001/health" -Method Get -TimeoutSec 2
    Write-Host "   OK: Local backend is running on port 5001" -ForegroundColor Green
} catch {
    Write-Host "   Info: Local backend not running on 5001" -ForegroundColor Gray
}
Write-Host ""

# Test 3: Check Frontend
Write-Host "3. Testing Frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "https://ogdoc-1.onrender.com/" -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "   OK: Frontend is accessible!" -ForegroundColor Green
    Write-Host "   Status Code: $($frontendResponse.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "   Error: Frontend failed!" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check if local dev server is running
Write-Host "4. Checking Local Dev Server (Port 5173)..." -ForegroundColor Yellow
try {
    $localResponse = Invoke-WebRequest -Uri "http://localhost:5173/" -Method Get -TimeoutSec 2 -UseBasicParsing
    Write-Host "   OK: Local dev server is running on port 5173" -ForegroundColor Green
} catch {
    Write-Host "   Info: Local dev server not running" -ForegroundColor Gray
}
Write-Host ""

Write-Host "Summary & Next Steps:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you're seeing 404 errors, please provide:" -ForegroundColor White
Write-Host "1. The EXACT URL showing the 404 (from network tab)" -ForegroundColor White
Write-Host "2. Check if VITE_BACKEND_URL in frontend/.env matches your intended backend" -ForegroundColor White
Write-Host ""
Write-Host "Common Issues:" -ForegroundColor Yellow
Write-Host "- Testing locally without rebuilding: Run 'npm run dev' in frontend folder" -ForegroundColor Gray
Write-Host "- Render still deploying: Wait 2-3 minutes after git push" -ForegroundColor Gray
Write-Host "- Browser cache: Hard refresh with Ctrl+Shift+R" -ForegroundColor Gray
Write-Host "- Missing render.json: Ensure it's in your build output" -ForegroundColor Gray
Write-Host ""

