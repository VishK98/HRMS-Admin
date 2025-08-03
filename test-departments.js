const API_BASE_URL = 'http://localhost:5000/api';

async function testDepartmentsAPI() {
  try {
    // First, let's test if the server is running
    console.log('Testing departments API...');
    
    // Test the departments endpoint
    const response = await fetch(`${API_BASE_URL}/departments/company/test-company-id`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testDepartmentsAPI(); 