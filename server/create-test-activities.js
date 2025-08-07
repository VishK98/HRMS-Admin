const mongoose = require('mongoose');
const Activity = require('./src/models/activity.model');
const User = require('./src/models/user.model');
const Employee = require('./src/models/employee.model');
const Company = require('./src/models/company.model');
require('dotenv').config();

async function createTestActivities() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms');
    console.log('Connected to MongoDB');

    // Get a company
    const company = await Company.findOne({});
    if (!company) {
      console.log('No company found. Creating a test company...');
      const testCompany = new Company({
        name: 'Test Company',
        code: 'TEST',
        email: 'test@company.com',
        phone: '1234567890',
        address: 'Test Address',
        isActive: true
      });
      await testCompany.save();
      console.log('Test company created:', testCompany._id);
    }

    // Get a user
    const user = await User.findOne({});
    if (!user) {
      console.log('No user found. Creating a test user...');
      const testUser = new User({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        company: company?._id || testCompany._id,
        isActive: true
      });
      await testUser.save();
      console.log('Test user created:', testUser._id);
    }

    // Get an employee
    const employee = await Employee.findOne({});
    if (!employee) {
      console.log('No employee found. Creating a test employee...');
      const testEmployee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        employeeId: 'EMP001',
        company: company?._id || testCompany._id,
        isActive: true
      });
      await testEmployee.save();
      console.log('Test employee created:', testEmployee._id);
    }

    // Create test activities
    const testActivities = [
      {
        action: 'Employee registered: John Doe',
        type: 'employee',
        employeeId: employee?._id || testEmployee._id,
        companyId: company?._id || testCompany._id,
        userId: user?._id || testUser._id,
        severity: 'info',
        status: 'completed'
      },
      {
        action: 'Employee checked in: John Doe',
        type: 'attendance',
        employeeId: employee?._id || testEmployee._id,
        companyId: company?._id || testCompany._id,
        userId: user?._id || testUser._id,
        severity: 'info',
        status: 'completed'
      },
      {
        action: 'Leave request created: John Doe - Sick leave',
        type: 'leave',
        employeeId: employee?._id || testEmployee._id,
        companyId: company?._id || testCompany._id,
        userId: user?._id || testUser._id,
        severity: 'info',
        status: 'pending'
      },
      {
        action: 'Company registered: Test Company',
        type: 'company',
        companyId: company?._id || testCompany._id,
        userId: user?._id || testUser._id,
        severity: 'info',
        status: 'completed'
      },
      {
        action: 'System maintenance completed',
        type: 'system',
        severity: 'info',
        status: 'completed'
      }
    ];

    // Add activities with different timestamps
    for (let i = 0; i < testActivities.length; i++) {
      const activity = new Activity({
        ...testActivities[i],
        createdAt: new Date(Date.now() - (i * 60 * 60 * 1000)) // Each activity 1 hour apart
      });
      await activity.save();
      console.log(`Test activity ${i + 1} created:`, activity.action);
    }

    console.log('All test activities created successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

createTestActivities();
