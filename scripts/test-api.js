import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.PLATFORM_URL || 'http://localhost:3000';

/**
 * Basic API Sanity Tests
 * Note: Requires server to be running (npm run dev)
 */
async function runSanityTests() {
  console.log('🚀 Starting API Sanity Tests...');
  
  try {
    // 1. Check Health/Home
    console.log('\n--- 1. Base Connectivity ---');
    const homeRes = await fetch(`${BASE_URL}/api/admin/settings`);
    console.log(`GET /api/admin/settings: ${homeRes.status} (likely 401 if unauth)`);
    
    // 2. Check Static Files
    console.log('\n--- 2. Static Resources ---');
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    console.log(`GET /robots.txt: ${robotsRes.status}`);

    // LOGGING IN (Manual Step Suggestion)
    console.log('\n--- 3. Authentication Test (Recommended) ---');
    console.log('Use Postman or Browser to login with:');
    console.log('User: user@test.com / user123');
    console.log('Admin: admin@jspm.edu / admin123');

    // 4. Check Complaint Schema Constants
    console.log('\n--- 4. Data Consistency ---');
    const statsRes = await fetch(`${BASE_URL}/api/stats`);
    console.log(`GET /api/stats: ${statsRes.status} (Needs Auth)`);

    console.log('\n✅ Sanity checks complete. Follow the testing_guide.md for manual UI flows.');
  } catch (err) {
    console.error('❌ Connectivity Error: Is the dev server running at `http://localhost:3000`?');
    console.error(err.message);
  }
}

runSanityTests();
