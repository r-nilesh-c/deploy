# Fix Auto-Refresh Issue

## 🚨 Problem
The auto-refresh system is not working because there's an issue with your Firebase credentials.

## 🔧 Solution Steps

### Step 1: Check Your Firebase Credentials

Run this test to check if your Firebase connection is working:

```bash
cd backend
node test-firebase-connection.js
```

### Step 2: Update Your Firebase Credentials

If the test fails, you need to update your `backend/.env` file with your **actual** Firebase credentials:

1. **Open** `backend/.env` file
2. **Replace** the placeholder values with your real Firebase credentials:

```env
PORT=5000
FIREBASE_PROJECT_ID=cyber-hunt-quiz-155b5
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@cyber-hunt-quiz-155b5.iam.gserviceaccount.com
NODE_ENV=development
```

### Step 3: Get Your Real Firebase Credentials

If you don't have your Firebase credentials:

1. **Go to** [Firebase Console](https://console.firebase.google.com/)
2. **Select** your project: `cyber-hunt-quiz-155b5`
3. **Click** the gear icon → Project Settings
4. **Go to** Service Accounts tab
5. **Click** "Generate new private key"
6. **Download** the JSON file
7. **Extract** the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \\n)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### Step 4: Test the Auto-Refresh

Once your credentials are correct:

```bash
# Test Firebase connection
cd backend
node test-firebase-connection.js

# If that passes, test auto-refresh manually
node manual-refresh-test.js
```

### Step 5: Restart Server

If the manual test works, restart your server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

You should see output like this:

```
🔥 Initializing Firebase...
✅ Firebase connected successfully
🔄 Starting auto-refresh...
🗑️ Clearing all user results...
✅ Cleared X user results
🗑️ Clearing all questions...
✅ Cleared X questions
🌱 Adding fresh questions...
✅ Added 20 fresh questions
📊 Difficulty: 15 Easy + 5 Medium level questions
✅ Auto-refresh completed successfully
```

## 🎯 Expected Result

After fixing the credentials and restarting:

- ✅ All user results should be cleared from your database
- ✅ All old questions should be removed
- ✅ 20 fresh cybersecurity questions should be added
- ✅ Leaderboard should be empty
- ✅ Quiz should work with fresh questions

## 🔍 Troubleshooting

### If you still see old data:

1. **Check the server console** for error messages
2. **Verify Firebase credentials** are correct
3. **Check Firebase Console** - go to Firestore and manually verify the data
4. **Try manual refresh** via API:
   ```bash
   curl -X POST http://localhost:5000/api/refresh
   ```

### Common Issues:

1. **Private Key Format Error**
   - Make sure the private key has proper \\n escaping
   - Ensure it's wrapped in quotes in the .env file

2. **Project ID Wrong**
   - Double-check your Firebase project ID
   - Make sure it matches exactly: `cyber-hunt-quiz-155b5`

3. **Service Account Permissions**
   - Ensure your service account has Firestore read/write permissions

## 📞 Need Help?

If you're still having issues:

1. **Run the connection test** and share the output
2. **Check your Firebase Console** for any error messages
3. **Verify your project settings** in Firebase

The auto-refresh system will work once your Firebase credentials are properly configured! 🚀