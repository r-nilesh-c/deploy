@echo off
echo 🚀 Upload to GitHub
echo ==================
echo.

set /p repo_url="Enter your GitHub repository URL: "

if "%repo_url%"=="" (
    echo ❌ No repository URL provided
    pause
    exit /b 1
)

echo.
echo 📋 Adding GitHub repository as remote origin...
git remote add origin %repo_url%
if errorlevel 1 (
    echo ⚠️ Remote origin might already exist, trying to set URL...
    git remote set-url origin %repo_url%
)

echo.
echo 📋 Pushing to GitHub...
git push -u origin main
if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    echo.
    echo 🔧 Troubleshooting:
    echo 1. Make sure the repository URL is correct
    echo 2. Check your GitHub authentication
    echo 3. Ensure the repository exists on GitHub
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Your code is now on GitHub!
echo ✅ Repository uploaded successfully
echo 🔗 You can view it at: %repo_url%
echo.
pause