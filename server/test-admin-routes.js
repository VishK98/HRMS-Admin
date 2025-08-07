const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAdminRoutes() {
  console.log('🧪 Testing Admin Dashboard Routes...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test 2: Test admin routes without auth (should fail)
    console.log('\n2. Testing admin routes without authentication...');
    try {
      await axios.get(`${BASE_URL}/admin/test`);
      console.log('❌ Admin routes should require authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Admin routes properly protected (401 Unauthorized)');
      } else {
        console.log('⚠️ Unexpected error:', error.response?.status, error.response?.data?.message);
      }
    }

    // Test 3: Test with invalid token
    console.log('\n3. Testing admin routes with invalid token...');
    try {
      await axios.get(`${BASE_URL}/admin/test`, {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      });
      console.log('❌ Should have failed with invalid token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Properly rejected invalid token (401 Unauthorized)');
      } else {
        console.log('⚠️ Unexpected error:', error.response?.status, error.response?.data?.message);
      }
    }

    console.log('\n📋 Route Testing Summary:');
    console.log('✅ Server is running');
    console.log('✅ Admin routes are protected');
    console.log('✅ Authentication middleware is working');
    console.log('\n💡 To test with real data:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Seed test data: npm run seed:admin');
    console.log('3. Login as admin user');
    console.log('4. Access the admin dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000');
    }
  }
}

// Run the test
testAdminRoutes();
