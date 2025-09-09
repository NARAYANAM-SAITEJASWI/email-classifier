# Deploy Smart Email Verifier to Render
Write-Host "🚀 Deploying Smart Email Verifier to Render..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Initializing..." -ForegroundColor Red
    git init
}

# Add all files
Write-Host "📁 Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Fix Render deployment - Remove Dockerfile, use Node.js build"

# Add remote if not exists
Write-Host "🔗 Adding remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/NARAYANAM-SAITEJASWI/email-classifier.git"
try {
    git remote add origin $remoteUrl
    Write-Host "✅ Remote added successfully" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Remote already exists" -ForegroundColor Blue
}

# Push to GitHub
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Code pushed to GitHub successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Next steps for Render deployment:" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "4. Connect repository: NARAYANAM-SAITEJASWI/email-classifier" -ForegroundColor White
Write-Host "5. Configure:" -ForegroundColor White
Write-Host "   - Build Command: npm install" -ForegroundColor Gray
Write-Host "   - Start Command: npm start" -ForegroundColor Gray
Write-Host "   - Environment: Node" -ForegroundColor Gray
Write-Host "6. Add environment variables:" -ForegroundColor White
Write-Host "   - NODE_ENV=production" -ForegroundColor Gray
Write-Host "   - MONGODB_URI=your_mongodb_connection_string" -ForegroundColor Gray
Write-Host "7. Click 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your app will be deployed automatically!" -ForegroundColor Green
