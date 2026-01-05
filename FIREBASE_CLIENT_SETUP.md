# Firebase Client Setup Guide

This guide will help you set up the Quiz Competition App to use Firebase Firestore directly from the React frontend.

## 🔥 Quick Setup Steps

### Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account
   - Click "Create a project"

2. **Project Configuration**
   - Enter project name: `quiz-competition-app`
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"

### Step 2: Enable Firestore Database

1. **Navigate to Firestore**
   - In your Firebase project console
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Configure Security Rules**
   - Choose "Start in test mode" for development
   - Select a location for your database
   - Click "Done"

### Step 3: Get Web App Configuration

1. **Add Web App**
   - In project overview, click the web icon `</>`
   - Register app with nickname: `quiz-app`
   - Don't check "Firebase Hosting" (unless you want to use it)
   - Click "Register app"

2. **Copy Configuration**
   - Copy the `firebaseConfig` object shown
   - You'll need these values for the next step

### Step 4: Configure Frontend

1. **Create Environment File**
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. **Update .env File**
   ```env
   REACT_APP_FIREBASE_API_KEY=your-actual-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
   REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
   ```

### Step 5: Install Dependencies and Start

1. **Install Dependencies**
   ```bash
   npm run setup
   ```

2. **Start the Application**
   ```bash
   npm run dev
   ```

3. **Seed Questions**
   - Open the app at `http://localhost:3000`
   - Press `Ctrl+Shift+A` to open the admin panel
   - Click "Seed Questions" to add 20 quiz questions to Firestore

## 📊 Firestore Collections

The app will create these collections automatically:

### `questions` Collection
```javascript
{
  question: "What is a computer virus?",
  options: [
    "Hardware problem",
    "Software that harms a computer", 
    "Input device",
    "Operating system"
  ],
  correctAnswer: "Software that harms a computer",
  category: "Technology",
  difficulty: "Medium",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `results` Collection
```javascript
{
  userName: "John Doe",
  totalQuestions: 20,
  correctAnswers: 15,
  wrongAnswers: 5,
  finalScore: 75,
  timeTaken: 900,
  answers: [
    {
      questionId: "question-doc-id",
      selectedOption: 2,
      isCorrect: true
    }
  ],
  submittedAt: Timestamp,
  createdAt: Timestamp
}
```

## 🔒 Security Rules (Production)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Questions - read only
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Results - write only for new documents
    match /results/{resultId} {
      allow read: if false;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

## 🎮 Using the Application

### Admin Panel Access
- Press `Ctrl+Shift+A` on the start screen
- Use the admin panel to:
  - Check question count in Firestore
  - Seed 20 technology questions
  - Clear all questions (be careful!)

### Taking a Quiz
1. Enter your name on the start screen
2. Click "Start Quiz"
3. Answer 20 multiple-choice questions
4. Submit before the 20-minute timer expires
5. View your results and leaderboard position

### Features
- **Real-time Data**: Questions and results stored in Firestore
- **Automatic Scoring**: Calculates score based on correct answers
- **Leaderboard**: Shows top performers in real-time
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Timer**: 20-minute countdown with auto-submit

## 🚀 Deployment Options

### Vercel (Recommended)
1. **Connect Repository**
   - Push your code to GitHub
   - Connect repository to Vercel

2. **Environment Variables**
   - Add all `REACT_APP_FIREBASE_*` variables in Vercel dashboard
   - Deploy the application

### Firebase Hosting
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Hosting**
   ```bash
   cd frontend
   firebase login
   firebase init hosting
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Netlify
1. **Connect Repository**
   - Connect your GitHub repository to Netlify

2. **Build Settings**
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`

3. **Environment Variables**
   - Add all Firebase config variables in Netlify dashboard

## 🔧 Troubleshooting

### Common Issues

1. **"Firebase not initialized" Error**
   - Check that all environment variables are set correctly
   - Verify the Firebase project ID matches your actual project
   - Ensure the web app is properly registered in Firebase console

2. **"Permission denied" Errors**
   - Check Firestore security rules
   - Make sure you're in "test mode" for development
   - Verify the Firebase project is active

3. **Questions Not Loading**
   - Use the admin panel to seed questions first
   - Check browser console for Firebase errors
   - Verify Firestore is enabled in your Firebase project

4. **Environment Variables Not Working**
   - Restart the development server after changing `.env`
   - Ensure all variables start with `REACT_APP_`
   - Check for typos in variable names

### Debug Commands

```bash
# Check if Firebase is properly configured
cd frontend
npm start
# Open browser console and check for Firebase connection logs

# Test Firestore connection
# Open admin panel (Ctrl+Shift+A) and try seeding questions
```

## 📱 Mobile Considerations

The app is fully responsive and works on mobile devices:

- **Touch-friendly**: Large buttons and touch targets
- **Responsive Layout**: Adapts to different screen sizes
- **Mobile Timer**: Optimized timer display for small screens
- **Swipe Navigation**: Easy question navigation on mobile

## 🔄 Data Flow

1. **Questions**: Loaded directly from Firestore on quiz start
2. **Answers**: Stored in React state during quiz
3. **Submission**: Sent to Firestore with score calculation
4. **Leaderboard**: Real-time data from Firestore results collection

## 📈 Performance Tips

1. **Firestore Optimization**
   - Questions are loaded once per quiz session
   - Results are written only on submission
   - Leaderboard uses indexed queries for fast loading

2. **React Optimization**
   - Components use React.memo where appropriate
   - State updates are batched for better performance
   - Images and assets are optimized for web

## 🎯 Next Steps

After setup, you can:

1. **Customize Questions**: Add your own questions via the admin panel
2. **Modify Styling**: Update CSS in `src/App.css` and `src/index.css`
3. **Add Features**: Extend functionality with additional Firebase services
4. **Deploy**: Choose a deployment platform and go live

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Web Guide](https://firebase.google.com/docs/firestore/quickstart)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Happy Quizzing with Firebase! 🔥🧠**