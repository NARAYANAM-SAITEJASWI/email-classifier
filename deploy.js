#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Smart Email Verifier - Deployment Helper\n');

// Check if we're in a git repository
try {
    execSync('git status', { stdio: 'pipe' });
    console.log('✅ Git repository detected');
} catch (error) {
    console.log('❌ Not a git repository. Please initialize git first:');
    console.log('   git init');
    console.log('   git add .');
    console.log('   git commit -m "Initial commit"');
    process.exit(1);
}

// Check for required files
const requiredFiles = [
    'package.json',
    'src/index.js',
    'public/index.html',
    'Dockerfile'
];

console.log('\n📋 Checking required files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - Missing!`);
    }
});

// Check environment variables
console.log('\n🔧 Environment Variables:');
const envVars = ['NODE_ENV', 'PORT', 'MONGODB_URI'];
envVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar}=${process.env[envVar].substring(0, 20)}...`);
    } else {
        console.log(`⚠️  ${envVar} - Not set (will use default)`);
    }
});

// Deployment options
console.log('\n🌐 Available Deployment Options:');
console.log('1. Render (Recommended - Free)');
console.log('2. Railway (Simple)');
console.log('3. Heroku (Popular)');
console.log('4. Vercel (Frontend optimized)');
console.log('5. DigitalOcean (Paid)');
console.log('6. Docker (Any platform)');

console.log('\n📖 For detailed instructions, see DEPLOYMENT.md');
console.log('\n🎯 Quick Start:');
console.log('1. Push your code to GitHub');
console.log('2. Go to https://render.com');
console.log('3. Connect your repository');
console.log('4. Set MONGODB_URI environment variable');
console.log('5. Deploy!');

console.log('\n✨ Your application is ready for deployment!');
