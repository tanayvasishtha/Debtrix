// Simple Database Connection Test
// Run with: node test-database.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Make sure .env.local contains:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
    console.log('🧪 Testing Debtrix Database Connection...\n');

    const tests = [
        { table: 'users', description: 'Users table' },
        { table: 'debts', description: 'Debts table' },
        { table: 'debt_assessment', description: 'Assessment table' },
        { table: 'progress_tracking', description: 'Progress tracking table' },
        { table: 'chat_history', description: 'Chat history table' },
        { table: 'blog_posts', description: 'Blog posts table' }
    ];

    let allGood = true;

    for (const test of tests) {
        try {
            const { data, error } = await supabase
                .from(test.table)
                .select('id')
                .limit(1);

            if (error) {
                console.log(`❌ ${test.description}: ${error.message}`);
                allGood = false;
            } else {
                console.log(`✅ ${test.description}: Connected successfully`);
            }
        } catch (err) {
            console.log(`❌ ${test.description}: ${err.message}`);
            allGood = false;
        }
    }

    console.log('\n' + '='.repeat(50));

    if (allGood) {
        console.log('🎉 All database tables are working correctly!');
        console.log('Your Debtrix app should work perfectly now.');
    } else {
        console.log('⚠️  Some tables are missing or inaccessible.');
        console.log('Please run the SQL setup script in Supabase:');
        console.log('📝 Copy FINAL-DATABASE-SETUP.sql to Supabase SQL Editor');
    }

    console.log('='.repeat(50));
}

// Run the test
testDatabase().catch(console.error); 