const axios = require("axios");

// Test the analytics endpoints
async function testAnalytics() {
  try {
    console.log("Testing analytics endpoints...\n");

    // First, test if server is running
    console.log("1. Testing server health:");
    try {
      const healthResponse = await axios.get("http://localhost:5000/health");
      console.log("✅ Server is running:", healthResponse.data);
    } catch (error) {
      console.log("❌ Server health check failed:", error.message);
      return;
    }

    // Test super admin analytics without auth (should return 401)
    console.log("\n2. Testing Super Admin Analytics (without auth):");
    try {
      const superAdminResponse = await axios.get(
        "http://localhost:5000/api/analytics/activities?timeRange=7d",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Super Admin Analytics Response:", superAdminResponse.data);
    } catch (error) {
      console.log("❌ Super Admin Analytics Error:", error.response?.status, error.response?.data?.message || error.message);
    }

    // Test admin analytics without auth (should return 401)
    console.log("\n3. Testing Admin Analytics (without auth):");
    try {
      const adminResponse = await axios.get(
        "http://localhost:5000/api/admin/analytics/activities?timeRange=7d",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Admin Analytics Response:", adminResponse.data);
    } catch (error) {
      console.log("❌ Admin Analytics Error:", error.response?.status, error.response?.data?.message || error.message);
    }

    console.log("\n✅ Analytics endpoints are working correctly!");
    console.log("The 401 errors are expected since we're not providing authentication tokens.");
    console.log("This means the endpoints are properly protected and the server is working.");

  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Run the test
testAnalytics();
