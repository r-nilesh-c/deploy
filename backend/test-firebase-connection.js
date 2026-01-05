/**
 * Test Firebase Connection
 * Run this to verify your Firebase credentials are working
 */

require('dotenv').config();

const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase Connection...\n');
    
    // Check environment variables
    console.log('📋 Checking environment variables...');
    console.log(`FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`FIREBASE_CLIENT_EMAIL: ${process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing'}`);
    console.log(`FIREBASE_PRIVATE_KEY: ${process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}\n`);
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      console.log('❌ Missing Firebase credentials in .env file');
      console.log('📝 Please update your backend/.env file with your actual Firebase credentials');
      console.log('📖 See FIREBASE_SETUP.md for detailed instructions');
      return;
    }
    
    // Test Firebase initialization
    console.log('🔥 Testing Firebase initialization...');
    const { initializeFirebase, getFirestore } = require('./config/firebase');
    
    initializeFirebase();
    console.log('✅ Firebase initialized successfully');
    
    // Test Firestore connection
    console.log('📊 Testing Firestore connection...');
    const db = getFirestore();
    
    // Try to read from Firestore
    const testCollection = await db.collection('_test').limit(1).get();
    console.log('✅ Firestore connection successful');
    
    // Test reading questions collection
    console.log('📚 Checking questions collection...');
    const questionsSnapshot = await db.collection('questions').get();
    console.log(`📊 Found ${questionsSnapshot.size} questions in database`);
    
    // Test reading results collection
    console.log('🏆 Checking results collection...');
    const resultsSnapshot = await db.collection('results').get();
    console.log(`📊 Found ${resultsSnapshot.size} results in database`);
    
    console.log('\n🎉 Firebase connection test PASSED! ✅');
    console.log('🚀 Your Firebase credentials are working correctly');
    console.log('🔄 Auto-refresh should work when you restart the server');
    
  } catch (error) {
    console.error('\n💥 Firebase connection test FAILED! ❌');
    console.error('Error:', error.message);
    
    if (error.message.includes('private key')) {
      console.log('\n🔧 Private Key Issue:');
      console.log('1. Make sure your private key is properly formatted');
      console.log('2. Ensure it starts with -----BEGIN PRIVATE KEY-----');
      console.log('3. Ensure it ends with -----END PRIVATE KEY-----');
      console.log('4. Make sure all \\n are properly escaped in the .env file');
    }
    
    if (error.message.includes('project')) {
      console.log('\n🔧 Project ID Issue:');
      console.log('1. Check your Firebase project ID is correct');
      console.log('2. Make sure the project exists in Firebase Console');
    }
    
    if (error.message.includes('email')) {
      console.log('\n🔧 Client Email Issue:');
      console.log('1. Check your service account email is correct');
      console.log('2. Make sure the service account exists');
    }
    
    console.log('\n📖 For detailed setup instructions, see FIREBASE_SETUP.md');
  }
  
  process.exit(0);
};

// Run the test
testFirebaseConnection();