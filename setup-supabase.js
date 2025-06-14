const fs = require('fs');
const path = require('path');

console.log('🔧 Supabase Setup for Debtrix');
console.log('=============================\n');

console.log('To connect to a real Supabase database instead of demo mode:');
console.log('1. Go to https://supabase.com and create a new project');
console.log('2. Get your project URL and anon key from Settings > API');
console.log('3. Run this script with your credentials:\n');

console.log('Usage:');
console.log('node setup-supabase.js <SUPABASE_URL> <ANON_KEY>\n');

console.log('Example:');
console.log('node setup-supabase.js https://abcdefgh.supabase.co eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n');

const [, , supabaseUrl, anonKey] = process.argv;

if (!supabaseUrl || !anonKey) {
    console.log('❌ Missing arguments. Please provide both Supabase URL and anon key.');
    console.log('\nFor demo mode, your current setup is fine.');
    console.log('For real database, provide the credentials as shown above.');
    process.exit(1);
}

// Validate URL format
if (!supabaseUrl.includes('.supabase.co')) {
    console.log('❌ Invalid Supabase URL format. Should be like: https://yourproject.supabase.co');
    process.exit(1);
}

const envContent = `# Real Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Debtrix
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Debt Elimination Platform

# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Development
NODE_ENV=development

# Perplexity API (if you have it)
PERPLEXITY_API_KEY=your-perplexity-api-key-here
`;

const envPath = path.join(__dirname, '.env.local');

try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local with real Supabase credentials');
    console.log('🔄 Please restart your development server: npm run dev');
    console.log('📊 Don\'t forget to run the database setup SQL in your Supabase project!');
    console.log('📁 SQL file: FINAL-DATABASE-SETUP.sql');
} catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
    console.log('\n📋 Please create .env.local manually with this content:');
    console.log(envContent);
} 