@echo off
echo 🚀 Cyber Hunt Quiz - GitHub Repository Setup
echo ================================================
echo.

echo 📋 Step 1: Checking if Git is installed...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first:
    echo    https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git is installed

echo.
echo 📋 Step 2: Initializing Git repository...
git init
if errorlevel 1 (
    echo ❌ Failed to initialize Git repository
    pause
    exit /b 1
)
echo ✅ Git repository initialized

echo.
echo 📋 Step 3: Adding all files...
git add .
if errorlevel 1 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)
echo ✅ Files added to Git

echo.
echo 📋 Step 4: Creating initial commit...
git commit -m "Initial commit: Cyber Hunt Quiz Application with Auto-Refresh System"
if errorlevel 1 (
    echo ❌ Failed to create commit
    pause
    exit /b 1
)
echo ✅ Initial commit created

echo.
echo 🎯 NEXT STEPS:
echo ================================================
echo 1. Go to GitHub.com and create a new repository
echo 2. Name it: cyber-hunt-quiz
echo 3. DON'T initialize with README (we have one)
echo 4. Copy the repository URL (it will look like):
echo    https://github.com/YOUR_USERNAME/cyber-hunt-quiz.git
echo.
echo 5. Run this command (replace YOUR_USERNAME):
echo    git remote add origin https://github.com/YOUR_USERNAME/cyber-hunt-quiz.git
echo    git push -u origin main
echo.
echo 📁 Your local repository is ready!
echo 🔒 Sensitive files (.env) are protected by .gitignore
echo.
pause