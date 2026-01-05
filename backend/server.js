const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const quizRoutes = require('./routes/quiz');
const errorHandler = require('./middleware/errorHandler');
const { autoRefreshData } = require('./utils/autoRefresh');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase and Auto-refresh
(async () => {
  try {
    // Connect to Firebase first
    console.log('🔥 Initializing Firebase...');
    await connectDB();
    console.log('✅ Firebase connected successfully');
    
    // Then run auto-refresh
    console.log('🔄 Starting auto-refresh...');
    await autoRefreshData();
    console.log('✅ Auto-refresh completed successfully');
  } catch (error) {
    console.error('⚠️ Initialization failed:', error.message);
    console.error('⚠️ Server will continue but data may not be refreshed...');
  }
})();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/quiz', quizRoutes);

// Auto-refresh endpoint (for manual refresh if needed)
app.post('/api/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual refresh triggered...');
    const { autoRefreshData } = require('./utils/autoRefresh');
    const result = await autoRefreshData();
    res.json({
      success: true,
      message: 'Data refreshed successfully',
      data: result
    });
  } catch (error) {
    console.error('❌ Manual refresh failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh data',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Quiz Competition API is running with auto-refresh!',
    timestamp: new Date().toISOString(),
    features: [
      'Auto-refresh on server start',
      'Fresh questions every restart',
      'Clean leaderboard every restart'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quiz Competition Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔥 Database: Firebase Firestore`);
});