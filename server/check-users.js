const mongoose = require("mongoose");
const User = require("./src/models/user.model");
const Employee = require("./src/models/employee.model");
require("dotenv").config();

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hrms"
    );
    console.log("Connected to MongoDB");

    // Check users
    const users = await User.find({}).select(
      "name email role company isActive"
    );
    console.log("\n=== USERS ===");
    users.forEach((user) => {
      console.log(
        `Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Active: ${user.isActive}, Company: ${user.company}`
      );
    });

    // Check employees
    const employees = await Employee.find({}).select(
      "firstName lastName email role company isActive"
    );
    console.log("\n=== EMPLOYEES ===");
    employees.forEach((emp) => {
      console.log(
        `Name: ${emp.firstName} ${emp.lastName}, Email: ${emp.email}, Role: ${emp.role}, Active: ${emp.isActive}, Company: ${emp.company}`
      );
    });

    // Check companies
    const Company = require("./src/models/company.model");
    const companies = await Company.find({}).select("name code");
    console.log("\n=== COMPANIES ===");
    companies.forEach((company) => {
      console.log(
        `Name: ${company.name}, Code: ${company.code}, ID: ${company._id}`
      );
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
}

checkUsers();
