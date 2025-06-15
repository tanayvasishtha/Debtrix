const fs = require('fs');
const path = require('path');

console.log('🔧 SUPABASE CREDENTIALS SETUP');
console.log('===============================\n');

console.log('❌ ISSUE: Invalid API key detected in your project.');
console.log('   The current API key is a placeholder and needs to be replaced with your real Supabase credentials.\n');

console.log('📋 TO FIX THIS, FOLLOW THESE STEPS:\n');

console.log('1️⃣  Go to your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard/projects\n');

console.log('2️⃣  Select your project (todrjyvusqkucpaxtqwt)\n');

console.log('3️⃣  Go to Settings → API:');
console.log('   https://supabase.com/dashboard/project/todrjyvusqkucpaxtqwt/settings/api\n');

console.log('4️⃣  Copy these values:\n');
console.log('   📄 Project URL: (should be https://todrjyvusqkucpaxtqwt.supabase.co)');
console.log('   🔑 Project API Keys → anon/public key (starts with "eyJ...")\n');

console.log('5️⃣  Run this command with your real credentials:');
console.log('   node update-env.js "YOUR_REAL_API_KEY_HERE"\n');

console.log('🔍 WHAT TO LOOK FOR:');
console.log('   • The API key should be very long (200+ characters)');
console.log('   • It should start with "eyJ"');
console.log('   • It should NOT be the service_role key (keep that secret!)');
console.log('   • Use the "anon" or "public" key\n');

console.log('⚠️  CURRENT STATUS:');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZHJqeXZ1c3FrdWNwYXh0dHF3dCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM2Nzk2NzUyLCJleHAiOjIwNTIzNzI3NTJ9')) {
        console.log('   ❌ Using placeholder API key (needs replacement)');
    } else {
        console.log('   ✅ Environment file exists with custom key');
    }
} else {
    console.log('   ❌ No .env.local file found');
}

console.log('\n💡 ALTERNATIVE: If you want to use demo mode only:');
console.log('   Delete the .env.local file and the app will run in demo mode');
console.log('   rm .env.local\n');

console.log('🚨 NEVER SHARE your API keys publicly or commit them to git!'); 