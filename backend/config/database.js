const { initializeFirebase, getFirestore } = require('./firebase');

/**
 * Database connection configuration for Firebase Firestore
 */

const connectDB = async () => {
  try {
    // Initialize Firebase
    initializeFirebase();
    
    // Get Firestore instance
    const db = getFirestore();
    
    // Test connection by attempting to read from a collection
    await db.collection('_health').doc('test').get();
    
    console.log('🔥 Firebase Firestore connected successfully');
    return db;
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;