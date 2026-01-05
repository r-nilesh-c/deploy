/**
 * Manual test to trigger auto-refresh and see what happens
 * Run this to manually test the refresh functionality
 */

require('dotenv').config();

const connectDB = require('./config/database');
const { autoRefreshData, getDataCounts } = require('./utils/autoRefresh');

const testRefresh = async () => {
  try {
    console.log('🧪 Manual Refresh Test Starting...\n');
    
    // Step 1: Initialize Firebase
    console.log('🔥 Connecting to Firebase...');
    await connectDB();
    console.log('✅ Firebase connected\n');
    
    // Step 2: Check current data
    console.log('📊 Checking current data counts...');
    const beforeCounts = await getDataCounts();
    console.log(`Questions before: ${beforeCounts.questions}`);
    console.log(`Results before: ${beforeCounts.results}\n`);
    
    // Step 3: Run auto-refresh
    console.log('🔄 Running auto-refresh...');
    const refreshResult = await autoRefreshData();
    console.log('✅ Auto-refresh completed\n');
    
    // Step 4: Check data after refresh
    console.log('📊 Checking data counts after refresh...');
    const afterCounts = await getDataCounts();
    console.log(`Questions after: ${afterCounts.questions}`);
    console.log(`Results after: ${afterCounts.results}\n`);
    
    // Step 5: Summary
    console.log('📋 Refresh Summary:');
    console.log(`   Results cleared: ${refreshResult.clearedResults}`);
    console.log(`   Questions cleared: ${refreshResult.clearedQuestions}`);
    console.log(`   Questions added: ${refreshResult.addedQuestions}`);
    console.log(`   Duration: ${refreshResult.duration}ms\n`);
    
    if (afterCounts.questions === 20 && afterCounts.results === 0) {
      console.log('🎉 SUCCESS: Auto-refresh worked correctly!');
      console.log('✅ 20 questions loaded, 0 results remaining');
    } else {
      console.log('❌ ISSUE: Auto-refresh may not have worked correctly');
      console.log(`Expected: 20 questions, 0 results`);
      console.log(`Got: ${afterCounts.questions} questions, ${afterCounts.results} results`);
    }
    
  } catch (error) {
    console.error('💥 Manual refresh test failed:', error);
    console.error('Stack trace:', error.stack);
  }
  
  process.exit(0);
};

// Run the test
testRefresh();