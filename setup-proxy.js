const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up proxy dependencies for geo-locked games...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this from the project root.');
  process.exit(1);
}

// Install proxy dependencies
const proxyDeps = [
  'express@^4.18.2',
  'http-proxy-middleware@^2.0.6',
  'cors@^2.8.5',
  'node-fetch@^3.3.2',
  'concurrently@^8.2.2'
];

console.log('📦 Installing proxy dependencies...');
try {
  execSync(`npm install ${proxyDeps.join(' ')} --save`, { stdio: 'inherit' });
  console.log('✅ Proxy dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Create .env file for proxy configuration
const envContent = `# Proxy Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:4200,http://localhost:3000

# Proxy Services
CORS_ANYWHERE_URL=https://cors-anywhere.herokuapp.com/
ALLORIGINS_URL=https://api.allorigins.win/
CORSPROXY_URL=https://corsproxy.io/
`;

if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envContent);
  console.log('📝 Created .env file with proxy configuration');
} else {
  console.log('ℹ️  .env file already exists, skipping creation');
}

console.log('\n🎉 Setup complete! You can now:');
console.log('   • Run "npm run dev" to start both Angular and proxy server');
console.log('   • Run "npm run start:proxy" for Angular with proxy config');
console.log('   • Run "npm run proxy" to start only the proxy server');
console.log('   • Run "npm run deploy" to build and deploy with proxy');
console.log('\n🌐 Available proxy services:');
console.log('   • CORS Anywhere - Bypass CORS restrictions');
console.log('   • AllOrigins - Universal CORS proxy');
console.log('   • CORS Proxy - Fast proxy for web apps');
console.log('   • Custom Proxy - Your own proxy server');
console.log('\n💡 For geo-locked games, select a proxy service in the UI!');
