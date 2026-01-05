import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

/**
 * Firebase Configuration for Cyber Hunt Quiz App
 * Your actual Firebase project configuration
 */
const firebaseConfig = {
  apiKey: "AIzaSyAmODQJfXIX2xglljfe5lfZ__S0ZhymzJ0",
  authDomain: "cyber-hunt-quiz-155b5.firebaseapp.com",
  projectId: "cyber-hunt-quiz-155b5",
  storageBucket: "cyber-hunt-quiz-155b5.firebasestorage.app",
  messagingSenderId: "667686251446",
  appId: "1:667686251446:web:4809d5e30dae2e26822f17",
  measurementId: "G-GQ7HMZWM6F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

console.log('🔥 Firebase initialized for Cyber Hunt Quiz');
console.log('📊 Project ID:', firebaseConfig.projectId);

export default app;