async function testAnalytics() {
  try {
    // First, login to get a token
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@othtech.com',
        password: 'admin@123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.error('Login failed:', loginData.message);
      return;
    }

    const token = loginData.data.token;
    console.log('Token received:', token ? 'Yes' : 'No');

    // Test analytics endpoint
    console.log('\nTesting analytics overview...');
    const analyticsResponse = await fetch('http://localhost:5000/api/analytics/overview?timeRange=30d', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const analyticsData = await analyticsResponse.json();
    console.log('Analytics response:', analyticsData);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAnalytics();
