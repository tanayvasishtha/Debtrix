const fs = require('fs');
const path = require('path');

// Get the API key from command line arguments
const apiKey = process.argv[2];

if (!apiKey) {
    console.log('❌ ERROR: Please provide your Supabase API key');
    console.log('');
    console.log('USAGE:');
    console.log('   node update-env.js "YOUR_ACTUAL_API_KEY_HERE"');
    console.log('');
    console.log('🔍 To get your API key:');
    console.log('   1. Go to https://supabase.com/dashboard/projects');
    console.log('   2. Select your project');
    console.log('   3. Go to Settings → API');
    console.log('   4. Copy the "anon public" key (starts with "eyJ")');
    process.exit(1);
}

// Validate the API key format
if (!apiKey.startsWith('eyJ')) {
    console.log('⚠️  WARNING: API key should start with "eyJ"');
    console.log('   Make sure you copied the correct "anon public" key from Supabase dashboard');
}

if (apiKey.length < 100) {
    console.log('⚠️  WARNING: API key seems too short');
    console.log('   Supabase API keys are typically 200+ characters long');
}

// Create the environment content
const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://todrjyvusqkucpaxtqwt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${apiKey}

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Debtrix
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Debt Elimination Platform

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEMO_MODE=false

# Development
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env.local');

try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ SUCCESS: Environment file updated!');
    console.log('📁 Location:', envPath);
    console.log('');
    console.log('🔧 Configuration:');
    console.log('   URL: https://todrjyvusqkucpaxtqwt.supabase.co');
    console.log('   API Key: ' + apiKey.substring(0, 20) + '...[' + (apiKey.length - 20) + ' more characters]');
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('   1. Restart your development server: npm run dev');
    console.log('   2. Test authentication and database operations');
    console.log('   3. Both real users and demo mode should now work!');
    console.log('');
    console.log('✨ Your app now supports:');
    console.log('   • Real user authentication with Supabase');
    console.log('   • Persistent data storage in real database');
    console.log('   • Demo mode for testing');

} catch (error) {
    console.error('❌ ERROR: Could not create .env.local file:', error.message);
    console.log('');
    console.log('📝 MANUAL SETUP:');
    console.log('   Create a file named ".env.local" in your project root with this content:');
    console.log('');
    console.log(envContent);
} 