# 🚀 GitHub Repository Setup Guide

## 📋 Step-by-Step GitHub Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/
2. **Click "New repository"** (green button)
3. **Repository name**: `cyber-hunt-quiz` (or your preferred name)
4. **Description**: `Cybersecurity Quiz Competition Web Application with Auto-Refresh`
5. **Set to Public** (or Private if you prefer)
6. **DON'T initialize** with README, .gitignore, or license (we already have these)
7. **Click "Create repository"**

### Step 2: Initialize Git in Your Project

```bash
# Navigate to your project root
cd C:\Users\Akhil\OneDrive\Desktop\ctf

# Initialize git repository
git init

# Add all files (except those in .gitignore)
git add .

# Create first commit
git commit -m "Initial commit: Cyber Hunt Quiz Application with Auto-Refresh"
```

### Step 3: Connect to GitHub

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/cyber-hunt-quiz.git

# Push to GitHub
git push -u origin main
```

### Step 4: Verify Upload

1. **Go to your GitHub repository**
2. **Check that all files are uploaded** (except .env files - these should NOT be there)
3. **Verify .gitignore is working** - no sensitive files should be visible

## 🔒 Security Checklist

### ✅ Files That Should NOT be in GitHub:
- `backend/.env` (contains Firebase credentials)
- `frontend/.env` (contains Firebase config)
- `node_modules/` folders
- Any `*-firebase-adminsdk-*.json` files

### ✅ Files That SHOULD be in GitHub:
- All source code files
- `package.json` files
- Documentation files (README.md, etc.)
- `.gitignore` file
- `.env.template` files (without real credentials)

## 📝 Repository Description

Use this description for your GitHub repository:

```
🔐 Cyber Hunt Quiz - A full-stack cybersecurity quiz competition web application built with React, Node.js, Express, and Firebase Firestore. Features auto-refresh system, real-time leaderboard, 10-minute timer, and 20 cybersecurity questions with mixed difficulty levels.

🚀 Features:
- Auto-refresh system (clears data on server restart)
- Real-time leaderboard with live updates
- 20 cybersecurity MCQ questions (15 Easy + 5 Medium)
- 10-minute timer with auto-submit
- Responsive design for all devices
- Firebase Firestore integration
- Admin panel for question management

🛠️ Tech Stack: React, Node.js, Express, Firebase Firestore, CSS3
```

## 🏷️ Suggested Topics/Tags

Add these topics to your GitHub repository:

- `react`
- `nodejs`
- `express`
- `firebase`
- `firestore`
- `quiz-app`
- `cybersecurity`
- `competition`
- `leaderboard`
- `auto-refresh`
- `full-stack`
- `web-application`

## 📂 Repository Structure

Your GitHub repository will have this structure:

```
cyber-hunt-quiz/
├── .gitignore                    # Git ignore file
├── README.md                     # Main documentation
├── package.json                  # Root package.json
├── start.js                      # Application starter
├── reset-quiz.js                 # Quiz reset utility
├── AUTO_REFRESH_GUIDE.md         # Auto-refresh documentation
├── FIREBASE_SETUP.md             # Firebase setup guide
├── DEPLOYMENT.md                 # Deployment instructions
├── backend/
│   ├── .env.template             # Environment template (safe)
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server
│   ├── config/                   # Configuration files
│   ├── models/                   # Data models
│   ├── routes/                   # API routes
│   ├── utils/                    # Utility functions
│   └── middleware/               # Express middleware
├── frontend/
│   ├── package.json              # Frontend dependencies
│   ├── public/                   # Static files
│   └── src/                      # React source code
└── docs/                         # Additional documentation
```

## 🔄 Future Updates

To update your repository after making changes:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push origin main
```

## 🌟 Make it Professional

### Add a Professional README Badge

Add this to the top of your README.md:

```markdown
![Cyber Hunt Quiz](https://img.shields.io/badge/Cyber%20Hunt-Quiz%20App-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)
```

### Create a Demo Section

Add screenshots or GIFs of your application in action.

## 🚀 Quick Commands Summary

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: Cyber Hunt Quiz Application"
git remote add origin https://github.com/YOUR_USERNAME/cyber-hunt-quiz.git
git push -u origin main

# Future updates
git add .
git commit -m "Your update description"
git push origin main
```

## ⚠️ Important Notes

1. **Never commit .env files** - they contain sensitive Firebase credentials
2. **Use .env.template** for sharing configuration structure
3. **Update README.md** with setup instructions for other developers
4. **Add proper documentation** for the auto-refresh feature
5. **Consider adding a LICENSE file** (MIT is recommended)

Your repository will be professional and ready for sharing! 🎉