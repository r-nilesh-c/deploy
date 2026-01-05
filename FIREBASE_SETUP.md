# Firebase Setup Guide

This guide will help you set up Firebase Firestore for the Quiz Competition Web Application.

## 🔥 Firebase Project Setup

### Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project"
   - Enter project name: `quiz-competition-app` (or your preferred name)
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"

### Step 2: Enable Firestore Database

1. **Navigate to Firestore**
   - In your Firebase project console
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Configure Security Rules**
   - Choose "Start in test mode" for development
   - Select a location for your database (choose closest to your users)
   - Click "Done"

   **Note:** For production, you'll need to configure proper security rules.

### Step 3: Create Service Account

1. **Go to Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Navigate to Service Accounts**
   - Click on the "Service accounts" tab
   - Click "Generate new private key"
   - Click "Generate key" to download the JSON file

3. **Save the JSON File**
   - Save the downloaded JSON file securely
   - **Never commit this file to version control!**

## 🔧 Backend Configuration

### Step 1: Extract Credentials

From your downloaded service account JSON file, extract these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Step 2: Update Environment Variables

Update your `backend/.env` file:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-actual-project.iam.gserviceaccount.com
NODE_ENV=development
```

**Important Notes:**
- Replace `your-actual-project-id` with your Firebase project ID
- Replace the private key with your actual private key (keep the quotes and newline characters)
- Replace the client email with your actual service account email
- Make sure the private key includes the `\n` characters for line breaks

### Step 3: Verify Configuration

Test your Firebase connection:

```bash
cd backend
node -e "
const { initializeFirebase } = require('./config/firebase');
initializeFirebase();
console.log('✅ Firebase connected successfully!');
"
```

## 🗄️ Database Structure

The application will create these Firestore collections:

### Collections

1. **`questions`** - Quiz questions
   ```javascript
   {
     questionText: "What is the capital of France?",
     options: ["London", "Berlin", "Paris", "Madrid"],
     correctAnswer: 2,
     category: "Geography",
     difficulty: "Easy",
     createdAt: Timestamp,
     updatedAt: Timestamp
   }
   ```

2. **`results`** - Quiz results
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
     createdAt: Timestamp,
     updatedAt: Timestamp
   }
   ```

## 🔒 Security Rules (Production)

For production deployment, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Questions collection - read only for clients
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
    
    // Results collection - write only, no read for clients
    match /results/{resultId} {
      allow read: if false; // Only server can read
      allow create: if true; // Allow creating new results
      allow update, delete: if false;
    }
    
    // Health check collection
    match /_health/{document} {
      allow read, write: if true;
    }
  }
}
```

## 🚀 Deployment Configuration

### Environment Variables for Production

```env
PORT=5000
FIREBASE_PROJECT_ID=your-production-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour production private key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-production-project.iam.gserviceaccount.com
NODE_ENV=production
```

### Heroku Deployment

If deploying to Heroku, set environment variables:

```bash
heroku config:set FIREBASE_PROJECT_ID="your-project-id"
heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
heroku config:set FIREBASE_CLIENT_EMAIL="your-service-account-email"
heroku config:set NODE_ENV="production"
```

### Vercel Deployment

For Vercel, add environment variables in the dashboard or use `.env.local`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email
NODE_ENV=production
```

## 🔍 Troubleshooting

### Common Issues

1. **"Firebase initialization error"**
   - Check that all environment variables are set correctly
   - Verify the private key format (should include `\n` characters)
   - Ensure the service account has proper permissions

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Verify service account permissions
   - Ensure the project ID is correct

3. **"Invalid private key" errors**
   - Make sure the private key is properly formatted
   - Check for extra spaces or missing newline characters
   - Verify the key is from the correct service account

### Debug Commands

```bash
# Test Firebase connection
cd backend
node -e "require('./config/firebase').initializeFirebase(); console.log('Connected!');"

# Test Firestore operations
cd backend
node -e "
const { getFirestore } = require('./config/firebase');
const db = getFirestore();
db.collection('_test').add({test: true}).then(() => console.log('Write test passed'));
"

# Check environment variables
cd backend
node -e "
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key Length:', process.env.FIREBASE_PRIVATE_KEY?.length);
"
```

## 📊 Monitoring and Analytics

### Firebase Console Monitoring

1. **Database Usage**
   - Monitor read/write operations in Firebase Console
   - Check for quota limits and billing

2. **Performance**
   - Use Firebase Performance Monitoring
   - Track query performance and optimization opportunities

3. **Security**
   - Monitor security rule violations
   - Review access patterns and potential security issues

### Application Monitoring

```javascript
// Add to your backend for monitoring
const { getFirestore } = require('./config/firebase');

// Monitor database operations
const monitorOperation = async (operation, collectionName) => {
  const startTime = Date.now();
  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    console.log(`✅ ${collectionName} operation completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ ${collectionName} operation failed after ${duration}ms:`, error);
    throw error;
  }
};
```

## 🔄 Migration from MongoDB

If you're migrating from MongoDB:

1. **Export MongoDB Data**
   ```bash
   mongoexport --db quiz_competition --collection questions --out questions.json
   mongoexport --db quiz_competition --collection results --out results.json
   ```

2. **Convert and Import to Firestore**
   ```javascript
   // Create a migration script
   const fs = require('fs');
   const { getFirestore } = require('./config/firebase');
   
   const migrateData = async () => {
     const db = getFirestore();
     const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
     
     for (const question of questions) {
       delete question._id; // Remove MongoDB ID
       await db.collection('questions').add(question);
     }
   };
   ```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.