# 🔐 Cyber Hunt Quiz - Quick Setup Guide

Your Firebase configuration has been automatically set up! Follow these simple steps to get your cybersecurity quiz running.

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm run setup
```

### Step 2: Start the Application
```bash
npm run dev
```

### Step 3: Seed Cybersecurity Questions
1. Open your browser to `http://localhost:3000`
2. Press `Ctrl+Shift+A` to open the admin panel
3. Click "Seed Cybersecurity Questions" to add 20 beginner-friendly questions to Firestore

## 🔥 Your Firebase Project

**Project ID:** `cyber-hunt-quiz-155b5`  
**Database:** Firestore (already configured)  
**Questions:** 20 beginner-friendly cybersecurity MCQs  
**Level:** Perfect for beginners - no prior cybersecurity experience needed!  

## 🎯 Quiz Features

- **🔐 Cybersecurity Focus**: Questions about phishing, malware, encryption, etc.
- **⏱️ 20-minute Timer**: Auto-submit when time expires
- **🏆 Real-time Leaderboard**: See top cyber hunters
- **📱 Mobile Responsive**: Works on all devices
- **🔥 Firebase Powered**: Real-time data storage

## 📊 Question Topics Included

1. **Computer Viruses & Malware** - Understanding basic threats
2. **Passwords & Authentication** - Account security basics  
3. **Network Devices** - Switches, routers, firewalls
4. **Internet Basics** - How networks and Wi-Fi work
5. **Safe Online Habits** - Best practices for internet use
6. **Cyber Threats** - Hacking, phishing, and protection
7. **Personal Information** - What to keep private online
8. **Email Security** - Safe messaging practices

**Perfect for beginners!** No prior cybersecurity knowledge required.

## 🎮 How to Use

### For Quiz Takers:
1. Enter your name on the start screen
2. Click "Start Quiz" 
3. Answer 20 cybersecurity questions
4. Submit before the timer expires
5. View your score and leaderboard ranking

### For Administrators:
- Press `Ctrl+Shift+A` on start screen for admin panel
- Seed questions, check database status, manage content
- View real-time Firebase Firestore data

## 🔧 Troubleshooting

### If questions don't load:
1. Make sure you've seeded the questions (Step 3 above)
2. Check browser console for Firebase errors
3. Verify Firestore is enabled in your Firebase project

### If Firebase connection fails:
1. Check that Firestore is enabled in Firebase Console
2. Ensure security rules are set to "test mode"
3. Verify your project ID matches: `cyber-hunt-quiz-155b5`

## 📱 Mobile Usage

The quiz is fully responsive and works great on:
- 📱 Smartphones (iOS/Android)
- 📟 Tablets (iPad, Android tablets)  
- 💻 Desktop computers
- 🖥️ Large screens

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Firebase Hosting
```bash
cd frontend
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Netlify
1. Connect GitHub repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/build`

## 📈 Next Steps

1. **Customize Questions**: Add more cybersecurity questions via admin panel
2. **Modify Styling**: Update colors/themes in CSS files
3. **Add Features**: Extend with user accounts, detailed analytics
4. **Deploy**: Choose a hosting platform and go live

## 🎯 Firebase Collections

Your app uses these Firestore collections:

### `questions`
```javascript
{
  question: "What is phishing?",
  options: ["...", "...", "...", "..."],
  correctAnswer: "Fraudulent attempt to obtain sensitive information",
  category: "Cybersecurity",
  difficulty: "Medium"
}
```

### `results`  
```javascript
{
  userName: "CyberHunter123",
  finalScore: 85,
  correctAnswers: 17,
  timeTaken: 900,
  submittedAt: Timestamp
}
```

## 🏆 Leaderboard

The leaderboard shows:
- **Top Scores**: Highest scoring cyber hunters
- **Accuracy**: Percentage of correct answers
- **Speed**: Time taken to complete quiz
- **Real-time Updates**: Live Firebase data

---

**Ready to hunt for cyber threats? Start your quiz now! 🔐🎯**

Need help? Check the browser console for Firebase connection logs or open an issue in the repository.