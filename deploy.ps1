# 🚀 Inc11 Vercel Deployment Script (PowerShell)
# This script automates the deployment process to Vercel on Windows

Write-Host "🚀 Starting Inc11 deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Vercel CLI not found"
    }
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Check if user is logged in to Vercel
try {
    vercel whoami 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Not logged in"
    }
    Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "📱 Your app should now be live on Vercel!" -ForegroundColor Green
    Write-Host "🔗 Check your Vercel dashboard for the live URL" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed. Please check the error messages above." -ForegroundColor Red
}
