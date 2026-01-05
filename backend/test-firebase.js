#!/usr/bin/env node

/**
 * Firebase Connection Test Script
 * Run this script to verify your Firebase setup is working correctly
 */

require('dotenv').config();
const { initializeFirebase, getFirestore } = require('./config/firebase');

const testFirebaseConnection = async () => {
  console.log('🔥 Testing Firebase Connection...\n');

  try {
    // Test 1: Initialize Firebase
    console.log('1️⃣  Testing Firebase initialization...');
    initializeFirebase();
    console.log('   ✅ Firebase initialized successfully\n');

    // Test 2: Get Firestore instance
    console.log('2️⃣  Testing Firestore connection...');
    const db = getFirestore();
    console.log('   ✅ Firestore instance created\n');

    // Test 3: Test write operation
    console.log('3️⃣  Testing write operation...');
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Firebase connection test'
    };
    
    const docRef = await db.collection('_test').add(testDoc);
    console.log(`   ✅ Write test passed - Document ID: ${docRef.id}\n`);

    // Test 4: Test read operation
    console.log('4️⃣  Testing read operation...');
    const doc = await docRef.get();
    if (doc.exists) {
      console.log('   ✅ Read test passed - Document data:', doc.data());
    } else {
      throw new Error('Document not found after write');
    }

    // Test 5: Test delete operation
    console.log('\n5️⃣  Testing delete operation...');
    await docRef.delete();
    console.log('   ✅ Delete test passed\n');

    // Test 6: Verify collections access
    console.log('6️⃣  Testing collections access...');
    const collections = ['questions', 'results'];
    
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).limit(1).get();
      console.log(`   ✅ ${collectionName} collection accessible (${snapshot.size} documents)`);
    }

    console.log('\n🎉 All Firebase tests passed successfully!');
    console.log('🚀 Your Firebase setup is ready for the Quiz Competition App');

  } catch (error) {
    console.error('\n❌ Firebase test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your .env file has all required Firebase credentials');
    console.log('2. Verify your Firebase project ID is correct');
    console.log('3. Ensure your service account has Firestore permissions');
    console.log('4. Check that Firestore is enabled in your Firebase project');
    console.log('5. See FIREBASE_SETUP.md for detailed setup instructions');
    
    process.exit(1);
  }
};

// Environment variables check
const checkEnvironmentVariables = () => {
  console.log('🔍 Checking environment variables...\n');
  
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];

  let allPresent = true;

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✅ ${varName}: ${varName === 'FIREBASE_PRIVATE_KEY' ? '[HIDDEN]' : value}`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      allPresent = false;
    }
  }

  if (!allPresent) {
    console.log('\n❌ Missing required environment variables');
    console.log('📝 Please update your backend/.env file with Firebase credentials');
    console.log('📚 See FIREBASE_SETUP.md for detailed instructions');
    process.exit(1);
  }

  console.log('\n✅ All required environment variables are present\n');
};

// Main execution
const main = async () => {
  console.log('🧪 Firebase Connection Test for Quiz Competition App');
  console.log('=' .repeat(60) + '\n');

  checkEnvironmentVariables();
  await testFirebaseConnection();

  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Next steps:');
  console.log('1. Run: npm run seed (to add sample questions)');
  console.log('2. Run: npm run dev (to start the application)');
  console.log('3. Visit: http://localhost:3000 (to use the app)');
};

// Run the test
main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});