/**
 * Test script for auto-refresh functionality
 * Run this to test the auto-refresh system without starting the full server
 */

require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { autoRefreshData, getDataCounts } = require('./utils/autoRefresh');

// Initialize Firebase Admin (same as in config/firebase.js)
const initializeFirebase = () => {
  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Missing Firebase configuration. Please check your environment variables.');
    }

    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id
    });

    console.log('✅ Firebase Admin initialized successfully');
    return getFirestore();
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    throw error;
  }
};

// Test the auto-refresh functionality
const testAutoRefresh = async () => {
  try {
    console.log('🧪 Testing Auto-Refresh Functionality\n');
    
    // Initialize Firebase
    initializeFirebase();
    
    // Get initial counts
    console.log('📊 Getting initial data counts...');
    const initialCounts = await getDataCounts();
    console.log(`Initial Questions: ${initialCounts.questions}`);
    console.log(`Initial Results: ${initialCounts.results}\n`);
    
    // Run auto-refresh
    console.log('🔄 Running auto-refresh...');
    const refreshResult = await autoRefreshData();
    
    // Get final counts
    console.log('\n📊 Getting final data counts...');
    const finalCounts = await getDataCounts();
    console.log(`Final Questions: ${finalCounts.questions}`);
    console.log(`Final Results: ${finalCounts.results}\n`);
    
    // Verify results
    console.log('✅ Auto-refresh test completed successfully!');
    console.log('📋 Test Summary:');
    console.log(`   - Results cleared: ${refreshResult.clearedResults}`);
    console.log(`   - Questions cleared: ${refreshResult.clearedQuestions}`);
    console.log(`   - Questions added: ${refreshResult.addedQuestions}`);
    console.log(`   - Duration: ${refreshResult.duration}ms`);
    console.log(`   - Final question count: ${finalCounts.questions}`);
    console.log(`   - Final result count: ${finalCounts.results}`);
    
    if (finalCounts.questions === 20 && finalCounts.results === 0) {
      console.log('\n🎉 AUTO-REFRESH TEST PASSED! ✅');
    } else {
      console.log('\n⚠️ AUTO-REFRESH TEST FAILED! ❌');
      console.log('Expected: 20 questions, 0 results');
      console.log(`Got: ${finalCounts.questions} questions, ${finalCounts.results} results`);
    }
    
  } catch (error) {
    console.error('\n💥 Auto-refresh test failed:', error);
    process.exit(1);
  }
};

// Run the test
testAutoRefresh()
  .then(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });