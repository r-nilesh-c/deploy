# Auto-Refresh System Guide

## 🔄 Overview

The Cyber Hunt Quiz application includes an **automatic data refresh system** that ensures every server restart provides a completely fresh competition environment. This feature is perfect for competitions, testing, and ensuring fair play.

## ✨ What Gets Refreshed

### 🗑️ Data Cleared
- **All user quiz results** - Complete leaderboard reset
- **All existing questions** - Removes any old or modified questions
- **User history** - Fresh start for all participants

### 🌱 Data Added
- **20 fresh cybersecurity questions** - Latest question set
- **Mixed difficulty levels** - 15 Easy + 5 Medium questions
- **Proper categorization** - All questions tagged as "Cybersecurity"
- **Timestamps** - Fresh creation dates for all questions

## 🚀 When Auto-Refresh Happens

### Automatic Triggers
1. **Server Startup** - Every time you run `npm run dev` or `node server.js`
2. **Development Restarts** - When nodemon restarts the server
3. **Production Deployment** - When the server starts in production

### Manual Triggers
1. **API Endpoint** - POST request to `/api/refresh`
2. **Test Script** - Run `node test-auto-refresh.js` in backend folder

## 🎯 Benefits

### For Competitions
- **Fair Play** - Everyone starts with zero scores
- **Fresh Questions** - Prevents question memorization
- **Clean Leaderboard** - New rankings every session
- **Consistent Experience** - Same 20 questions for all participants

### For Development
- **Easy Testing** - Quick reset for new test sessions
- **Clean State** - No leftover data from previous tests
- **Predictable Environment** - Always starts with known data set

### For Production
- **Competition Rounds** - Easy to start new competition rounds
- **Data Management** - Automatic cleanup of old data
- **Performance** - Keeps database lean and fast

## 🛠️ Technical Implementation

### Server Startup Process
```javascript
// In server.js
const { autoRefreshData } = require('./utils/autoRefresh');

// Auto-refresh on startup
(async () => {
  try {
    await autoRefreshData();
  } catch (error) {
    console.error('⚠️ Auto-refresh failed, but server will continue...');
  }
})();
```

### Auto-Refresh Function
```javascript
// In utils/autoRefresh.js
const autoRefreshData = async () => {
  // 1. Clear all user results
  const clearedResults = await clearAllResults();
  
  // 2. Clear all questions  
  const clearedQuestions = await clearAllQuestions();
  
  // 3. Add fresh questions
  const addedQuestions = await seedFreshQuestions();
  
  return { clearedResults, clearedQuestions, addedQuestions };
};
```

## 📋 Usage Examples

### Starting the Server
```bash
# Normal startup (auto-refresh happens automatically)
npm run dev

# Or using the start script
npm start
```

### Manual Refresh via API
```bash
# Using curl
curl -X POST http://localhost:5000/api/refresh

# Response
{
  "success": true,
  "message": "Data refreshed successfully",
  "data": {
    "clearedResults": 5,
    "clearedQuestions": 20,
    "addedQuestions": 20,
    "duration": 1250
  }
}
```

### Manual Refresh via Frontend
```javascript
// JavaScript fetch example
const refreshData = async () => {
  try {
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('Refresh result:', result);
  } catch (error) {
    console.error('Refresh failed:', error);
  }
};
```

### Testing Auto-Refresh
```bash
# Run the test script
cd backend
node test-auto-refresh.js

# Expected output:
# ✅ AUTO-REFRESH TEST PASSED!
# Final question count: 20
# Final result count: 0
```

## 🔧 Configuration

### Environment Variables
The auto-refresh system uses the same Firebase configuration as the main application:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### Question Set Customization
To modify the questions that get loaded during refresh:

1. **Edit the question array** in `backend/utils/autoRefresh.js`
2. **Update difficulty levels** in the `difficultyLevels` array
3. **Modify categories** by changing the `category` field

```javascript
// Example: Adding a new question
const quizQuestions = [
  // ... existing questions
  {
    question: "What is a VPN?",
    options: [
      "Virtual Private Network",
      "Very Personal Network", 
      "Verified Public Network",
      "Visual Protocol Network"
    ],
    correctAnswer: "Virtual Private Network"
  }
];
```

## 📊 Monitoring and Logging

### Console Output
The auto-refresh system provides detailed console logging:

```
🔄 ===== AUTO REFRESH STARTED =====
🎯 Clearing all data and refreshing questions...
🗑️ Clearing all user results...
✅ Cleared 15 user results
🗑️ Clearing all questions...
✅ Cleared 20 questions
🌱 Adding fresh questions...
✅ Added 20 fresh questions
📊 Difficulty: 15 Easy + 5 Medium level questions

🎉 ===== AUTO REFRESH COMPLETED =====
📊 Results cleared: 15
📊 Questions cleared: 20
📊 Questions added: 20
⏱️ Duration: 1250ms
🚀 Server ready for fresh competition!
```

### Health Check Endpoint
The health check endpoint now includes auto-refresh information:

```bash
curl http://localhost:5000/api/health

# Response
{
  "success": true,
  "message": "Quiz Competition API is running with auto-refresh!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "features": [
    "Auto-refresh on server start",
    "Fresh questions every restart", 
    "Clean leaderboard every restart"
  ]
}
```

## 🚨 Error Handling

### Graceful Failure
If auto-refresh fails, the server continues to run:

```javascript
// Server continues even if refresh fails
(async () => {
  try {
    await autoRefreshData();
  } catch (error) {
    console.error('⚠️ Auto-refresh failed, but server will continue...');
    // Server keeps running with existing data
  }
})();
```

### Common Issues and Solutions

1. **Firebase Connection Error**
   ```
   ❌ Error: Missing Firebase configuration
   ```
   **Solution**: Check your `.env` file has all required Firebase credentials

2. **Permission Denied**
   ```
   ❌ Error: Permission denied on Firestore operation
   ```
   **Solution**: Verify your Firebase service account has Firestore read/write permissions

3. **Network Timeout**
   ```
   ❌ Error: Request timeout
   ```
   **Solution**: Check your internet connection and Firebase project status

## 🎮 Competition Workflow

### Setting Up a New Competition
1. **Announce the competition** to participants
2. **Restart the server** to trigger auto-refresh
3. **Verify clean state** by checking the leaderboard (should be empty)
4. **Share the quiz URL** with participants
5. **Monitor results** in real-time

### During Competition
- **No manual refresh needed** - data stays consistent
- **Monitor server logs** for any issues
- **Leaderboard updates** automatically as users submit

### After Competition
- **Export results** if needed (before next restart)
- **Announce winners** from the leaderboard
- **Restart server** when ready for next competition

## 🔮 Future Enhancements

### Planned Features
- **Scheduled refresh** - Auto-refresh at specific times
- **Backup before refresh** - Save previous competition data
- **Custom question sets** - Load different question sets per competition
- **Admin dashboard** - Web interface for manual refresh control

### Configuration Options
- **Disable auto-refresh** - Environment variable to turn off
- **Refresh intervals** - Periodic refresh instead of startup only
- **Selective refresh** - Refresh only questions or only results

## 📞 Support

If you encounter issues with the auto-refresh system:

1. **Check the console logs** for detailed error messages
2. **Verify Firebase configuration** in your `.env` file
3. **Test manually** using `node test-auto-refresh.js`
4. **Check Firebase console** for any service issues

---

**The auto-refresh system ensures every competition starts fresh! 🔄✨**