/**
 * Complete Quiz Reset Script
 * Clears all data and restarts with fresh questions
 */

const { spawn } = require('child_process');

console.log('🔄 QUIZ RESET STARTING...\n');

// Function to run a command and wait for it to complete
const runCommand = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd: cwd || __dirname,
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
};

const resetQuiz = async () => {
  try {
    console.log('1️⃣ Testing Firebase connection...');
    await runCommand('node', ['test-firebase-connection.js'], './backend');
    
    console.log('\n2️⃣ Running manual refresh...');
    await runCommand('node', ['manual-refresh-test.js'], './backend');
    
    console.log('\n3️⃣ Quiz reset completed! ✅');
    console.log('📊 All user data cleared');
    console.log('📚 Fresh questions loaded');
    console.log('🏆 Leaderboard is now empty');
    console.log('\n🚀 You can now restart your server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Quiz reset failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure your Firebase credentials are configured in backend/.env');
    console.log('2. Check that your Firebase project is accessible');
    console.log('3. Verify Firestore permissions are enabled');
    console.log('\n📖 See URGENT_FIREBASE_FIX.md for detailed instructions');
  }
};

resetQuiz();