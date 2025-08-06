const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hrms");

const Employee = require("./src/models/employee.model");

async function checkUsers() {
  try {
    console.log("Checking all users in database...");

    // Find all users
    const users = await Employee.find({}).select(
      "email firstName lastName role status company"
    );

    console.log(`Found ${users.length} users:`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Company: ${user.company}`);
      console.log("---");
    });

    // Check specifically for contact@purplewave.in
    const adminUser = await Employee.findOne({
      email: "contact@purplewave.in",
    });
    if (adminUser) {
      console.log("\nAdmin user found:");
      console.log("Email:", adminUser.email);
      console.log("Role:", adminUser.role);
      console.log("Status:", adminUser.status);
      console.log("Company:", adminUser.company);
    } else {
      console.log("\nNo user found with email: contact@purplewave.in");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();
