#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Quiz Competition App...\n');

// Function to run commands
const runCommand = (command, cwd = process.cwd()) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    console.error(error.message);
    return false;
  }
};

// Function to check if file exists
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Main setup function
const setup = async () => {
  try {
    console.log('📦 Installing dependencies...\n');

    // Install backend dependencies
    console.log('Installing backend dependencies...');
    if (!runCommand('npm install', './backend')) {
      throw new Error('Failed to install backend dependencies');
    }

    // Install frontend dependencies
    console.log('\nInstalling frontend dependencies...');
    if (!runCommand('npm install', './frontend')) {
      throw new Error('Failed to install frontend dependencies');
    }

    // Check if .env file exists
    const envPath = path.join(__dirname, 'backend', '.env');
    if (!fileExists(envPath)) {
      console.log('\n⚠️  .env file not found in backend directory');
      console.log('Creating default .env file...');
      
      const defaultEnv = `PORT=5000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYour Firebase Private Key\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
NODE_ENV=development`;
      
      fs.writeFileSync(envPath, defaultEnv);
      console.log('✅ Default .env file created');
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up Firebase project and update .env file with your credentials');
    console.log('2. Seed the database with sample questions:');
    console.log('   cd backend && node seedData.js');
    console.log('3. Start the application:');
    console.log('   npm run dev');
    console.log('\n🌐 The app will be available at:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:5000');
    console.log('\n🔥 Database: Firebase Firestore');
    console.log('📚 For more information, check the README.md file');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Manual setup instructions:');
    console.log('1. cd backend && npm install');
    console.log('2. cd frontend && npm install');
    console.log('3. Create backend/.env file with Firebase credentials');
    console.log('4. Run: cd backend && node seedData.js');
    console.log('5. Run: npm run dev');
    process.exit(1);
  }
};

// Run setup
setup();