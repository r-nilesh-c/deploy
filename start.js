#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Cyber Hunt Quiz App with Auto-Refresh...\n');

// Function to start a process
const startProcess = (command, args, cwd, name, color) => {
  const process = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    shell: true
  });

  // Color codes for console output
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
  };

  const colorCode = colors[color] || colors.reset;

  process.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${colorCode}[${name}]${colors.reset} ${line}`);
    });
  });

  process.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${colorCode}[${name}]${colors.reset} ${line}`);
    });
  });

  process.on('close', (code) => {
    console.log(`${colorCode}[${name}]${colors.reset} Process exited with code ${code}`);
  });

  return process;
};

// Start backend server
console.log('🔧 Starting backend server...');
const backendProcess = startProcess(
  'npm',
  ['run', 'dev'],
  path.join(__dirname, 'backend'),
  'BACKEND',
  'blue'
);

// Wait a bit before starting frontend
setTimeout(() => {
  console.log('⚛️  Starting frontend server...');
  const frontendProcess = startProcess(
    'npm',
    ['start'],
    path.join(__dirname, 'frontend'),
    'FRONTEND',
    'green'
  );

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backendProcess.kill('SIGINT');
    frontendProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down servers...');
    backendProcess.kill('SIGTERM');
    frontendProcess.kill('SIGTERM');
    process.exit(0);
  });

}, 2000);

console.log('\n📱 Application starting with Auto-Refresh...');
console.log('🌐 Frontend will be available at: http://localhost:3000');
console.log('🔌 Backend will be available at: http://localhost:5000');
console.log('\n🔄 Auto-Refresh Features:');
console.log('✅ All user data cleared on server restart');
console.log('✅ Fresh questions loaded on server restart');
console.log('✅ Clean leaderboard every time');
console.log('✅ Manual refresh: POST /api/refresh');
console.log('\n💡 Press Ctrl+C to stop both servers');
console.log('📋 Check the console output above for any errors\n');