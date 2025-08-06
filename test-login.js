const axios = require("axios");

async function testLogin() {
  try {
    console.log("Testing login with contact@purplewave.in...");

    const response = await axios.post(
      "http://localhost:5000/api/employees/login",
      {
        email: "contact@purplewave.in",
        password: "Admin@123",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Success:", response.data);
  } catch (error) {
    console.log("Error Status:", error.response?.status);
    console.log("Error Data:", error.response?.data);
    console.log("Error Message:", error.message);
  }
}

testLogin();
