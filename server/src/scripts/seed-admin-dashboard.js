const mongoose = require('mongoose');
const Employee = require('../models/employee.model');
const Attendance = require('../models/attendance.model');
const Leave = require('../models/leave.model');
const Company = require('../models/company.model');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdminDashboardData = async () => {
  try {
    console.log('🌱 Seeding admin dashboard data...');

    // Create a test company if it doesn't exist
    let testCompany = await Company.findOne({ name: 'Test Company' });
    if (!testCompany) {
      testCompany = await Company.create({
        name: 'Test Company',
        email: 'admin@testcompany.com',
        phone: '+1234567890',
        address: '123 Test Street, Test City',
        industry: 'Technology',
        size: '50-100',
        subscription: {
          plan: 'premium',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        isActive: true
      });
      console.log('✅ Test company created');
    }

    // Create test employees
    const employees = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@testcompany.com',
        phone: '+1234567891',
        employeeId: 'EMP001',
        department: 'Engineering',
        designation: 'Software Engineer',
        company: testCompany._id,
        status: 'active',
        joiningDate: new Date('2023-01-15'),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@testcompany.com',
        phone: '+1234567892',
        employeeId: 'EMP002',
        department: 'Marketing',
        designation: 'Marketing Manager',
        company: testCompany._id,
        status: 'active',
        joiningDate: new Date('2023-02-20'),
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@testcompany.com',
        phone: '+1234567893',
        employeeId: 'EMP003',
        department: 'Sales',
        designation: 'Sales Executive',
        company: testCompany._id,
        status: 'active',
        joiningDate: new Date('2023-03-10'),
        lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@testcompany.com',
        phone: '+1234567894',
        employeeId: 'EMP004',
        department: 'HR',
        designation: 'HR Specialist',
        company: testCompany._id,
        status: 'active',
        joiningDate: new Date('2023-04-05'),
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@testcompany.com',
        phone: '+1234567895',
        employeeId: 'EMP005',
        department: 'Engineering',
        designation: 'Senior Developer',
        company: testCompany._id,
        status: 'active',
        joiningDate: new Date('2023-05-12'),
        lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      }
    ];

    // Create employees
    const createdEmployees = [];
    for (const employeeData of employees) {
      let employee = await Employee.findOne({ email: employeeData.email });
      if (!employee) {
        employee = await Employee.create(employeeData);
        console.log(`✅ Employee created: ${employee.firstName} ${employee.lastName}`);
      }
      createdEmployees.push(employee);
    }

    // Create attendance records for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceRecords = [
      {
        employee: createdEmployees[0]._id,
        company: testCompany._id,
        checkIn: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        checkOut: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6 PM
        status: 'present',
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Office Location'
        }
      },
      {
        employee: createdEmployees[1]._id,
        company: testCompany._id,
        checkIn: new Date(today.getTime() + 8 * 60 * 60 * 1000), // 8 AM
        checkOut: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5 PM
        status: 'present',
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Office Location'
        }
      },
      {
        employee: createdEmployees[2]._id,
        company: testCompany._id,
        checkIn: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10 AM
        checkOut: new Date(today.getTime() + 19 * 60 * 60 * 1000), // 7 PM
        status: 'late',
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Office Location'
        }
      },
      {
        employee: createdEmployees[3]._id,
        company: testCompany._id,
        checkIn: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        checkOut: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6 PM
        status: 'present',
        location: {
          latitude: 12.9716,
          longitude: 77.5946,
          address: 'Office Location'
        }
      }
      // Employee 5 is absent today
    ];

    // Create attendance records
    for (const attendanceData of attendanceRecords) {
      const existingAttendance = await Attendance.findOne({
        employee: attendanceData.employee,
        checkIn: { $gte: today, $lt: tomorrow }
      });

      if (!existingAttendance) {
        await Attendance.create(attendanceData);
        console.log(`✅ Attendance record created for ${attendanceData.employee}`);
      }
    }

    // Create leave requests
    const leaveRequests = [
      {
        employee: createdEmployees[0]._id,
        company: testCompany._id,
        leaveType: 'sick',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        reason: 'Not feeling well',
        days: 2,
        status: 'pending'
      },
      {
        employee: createdEmployees[1]._id,
        company: testCompany._id,
        leaveType: 'vacation',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
        reason: 'Family vacation',
        days: 5,
        status: 'pending'
      },
      {
        employee: createdEmployees[2]._id,
        company: testCompany._id,
        leaveType: 'personal',
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        reason: 'Personal appointment',
        days: 1,
        status: 'approved'
      }
    ];

    // Create leave requests
    for (const leaveData of leaveRequests) {
      const existingLeave = await Leave.findOne({
        employee: leaveData.employee,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate
      });

      if (!existingLeave) {
        await Leave.create(leaveData);
        console.log(`✅ Leave request created for ${leaveData.employee}`);
      }
    }

    // Create today's leave status records
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Create leave status records for today
    const leaveStatusRecords = [
      {
        employee: createdEmployees[4]._id, // David Brown - On Leave
        company: testCompany._id,
        leaveType: 'sick',
        startDate: today,
        endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        reason: 'Medical appointment',
        days: 2,
        status: 'approved'
      },
      {
        employee: createdEmployees[3]._id, // Sarah Wilson - Half Day
        company: testCompany._id,
        leaveType: 'half_day',
        startDate: today,
        endDate: today,
        reason: 'Afternoon appointment',
        days: 0.5,
        status: 'approved'
      },
      {
        employee: createdEmployees[2]._id, // Mike Johnson - Short Leave
        company: testCompany._id,
        leaveType: 'short_leave',
        startDate: today,
        endDate: today,
        reason: 'Quick errand',
        days: 0.25,
        status: 'approved'
      }
    ];

    // Create leave status records
    for (const leaveStatusData of leaveStatusRecords) {
      const existingLeaveStatus = await Leave.findOne({
        employee: leaveStatusData.employee,
        startDate: { $gte: today, $lt: tomorrow }
      });

      if (!existingLeaveStatus) {
        await Leave.create(leaveStatusData);
        console.log(`✅ Leave status record created for ${leaveStatusData.employee}`);
      }
    }

    console.log('✅ Admin dashboard data seeding completed!');
    console.log(`📊 Company: ${testCompany.name}`);
    console.log(`👥 Employees: ${createdEmployees.length}`);
    console.log(`📅 Attendance records: ${attendanceRecords.length}`);
    console.log(`🏖️ Leave requests: ${leaveRequests.length}`);
    console.log(`📋 Leave status records: ${leaveStatusRecords.length}`);
    console.log('\n📈 Today\'s Status:');
    console.log(`   ✅ Present: 4 employees`);
    console.log(`   ❌ Absent: 1 employee (David Brown)`);
    console.log(`   ⏰ Late: 1 employee (Mike Johnson)`);
    console.log(`   🏖️ On Leave: 1 employee (David Brown)`);
    console.log(`   ⏰ Half Day: 1 employee (Sarah Wilson)`);
    console.log(`   ⏰ Short Leave: 1 employee (Mike Johnson)`);

  } catch (error) {
    console.error('❌ Error seeding admin dashboard data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding function
seedAdminDashboardData();
