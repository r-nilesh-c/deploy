# 🚨 URGENT: Fix Firebase Credentials for Auto-Refresh

## Your Current Issue
Your `backend/.env` file has **placeholder values** instead of real Firebase credentials. This is why auto-refresh isn't working.

## 🔧 Step-by-Step Fix

### Step 1: Get Your Firebase Service Account Key

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `cyber-hunt-quiz-155b5`
3. **Click the gear icon** (⚙️) → **Project Settings**
4. **Go to "Service Accounts" tab**
5. **Click "Generate new private key"**
6. **Download the JSON file** (it will be named something like `cyber-hunt-quiz-155b5-firebase-adminsdk-xxxxx.json`)

### Step 2: Extract Values from JSON

Open the downloaded JSON file and find these values:

```json
{
  "type": "service_account",
  "project_id": "cyber-hunt-quiz-155b5",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@cyber-hunt-quiz-155b5.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### Step 3: Update Your .env File

Replace the content of `backend/.env` with:

```env
PORT=5000
FIREBASE_PROJECT_ID=cyber-hunt-quiz-155b5
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@cyber-hunt-quiz-155b5.iam.gserviceaccount.com
NODE_ENV=development
```

**IMPORTANT**: 
- Use the **exact** `project_id` from your JSON
- Use the **exact** `private_key` from your JSON (keep all the \n characters)
- Use the **exact** `client_email` from your JSON

### Step 4: Test the Connection

```bash
cd backend
node test-firebase-connection.js
```

You should see:
```
✅ Firebase initialized successfully
✅ Firestore connection successful
🎉 Firebase connection test PASSED! ✅
```

### Step 5: Test Auto-Refresh

```bash
node manual-refresh-test.js
```

You should see:
```
✅ Auto-refresh completed
🎉 SUCCESS: Auto-refresh worked correctly!
```

### Step 6: Restart Server

```bash
npm run dev
```

You should see:
```
🔥 Initializing Firebase...
✅ Firebase connected successfully
🔄 Starting auto-refresh...
✅ Cleared X user results
✅ Added 20 fresh questions
✅ Auto-refresh completed successfully
```

## 🎯 Quick Alternative (If You Have Issues)

If you're having trouble with the service account, you can also:

1. **Use your existing frontend Firebase config**
2. **Create a new service account** specifically for the backend
3. **Make sure Firestore permissions** are enabled

## ⚠️ Security Note

- **Never commit** your `.env` file to git
- **Keep your private key secure**
- **Don't share** your service account credentials

## 🔍 Verification

After fixing, your leaderboard should be **completely empty** and you should have **20 fresh cybersecurity questions** when you restart the server.

The auto-refresh will then work every time you restart! 🚀