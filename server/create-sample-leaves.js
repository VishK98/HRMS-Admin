const mongoose = require("mongoose");
const Leave = require("./src/models/leave.model");
const Employee = require("./src/models/employee.model");
const User = require("./src/models/user.model");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/hrms", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createSampleLeaves() {
  try {
    // Get the first company and admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found");
      return;
    }

    const companyId = adminUser.company._id || adminUser.companyId;
    console.log("Company ID:", companyId);

    // Get some employees
    const employees = await Employee.find({ company: companyId }).limit(3);
    if (employees.length === 0) {
      console.log("No employees found");
      return;
    }

    console.log(`Found ${employees.length} employees`);

    // Sample leave requests with different statuses
    const sampleLeaves = [
      {
        employee: employees[0]._id,
        company: companyId,
        leaveType: "paid",
        startDate: new Date("2025-08-05"),
        endDate: new Date("2025-08-07"),
        days: 3,
        reason: "Family vacation",
        status: "pending",
        managerAction: "pending",
        submittedDate: new Date("2025-08-01"),
      },
      {
        employee: employees[0]._id,
        company: companyId,
        leaveType: "sick",
        startDate: new Date("2025-08-10"),
        endDate: new Date("2025-08-10"),
        days: 1,
        reason: "Not feeling well",
        status: "approved",
        managerAction: "approved",
        approvedBy: adminUser._id,
        approvedDate: new Date("2025-08-02"),
        submittedDate: new Date("2025-08-01"),
      },
      {
        employee: employees[1] ? employees[1]._id : employees[0]._id,
        company: companyId,
        leaveType: "casual",
        startDate: new Date("2025-08-15"),
        endDate: new Date("2025-08-15"),
        days: 1,
        reason: "Personal work",
        status: "rejected",
        managerAction: "rejected",
        approvedBy: adminUser._id,
        approvedDate: new Date("2025-08-02"),
        submittedDate: new Date("2025-08-01"),
      },
      {
        employee: employees[2] ? employees[2]._id : employees[0]._id,
        company: companyId,
        leaveType: "halfday",
        halfDayType: "first",
        startDate: new Date("2025-08-20"),
        endDate: new Date("2025-08-20"),
        days: 0.5,
        reason: "Doctor appointment",
        status: "pending",
        managerAction: "pending",
        submittedDate: new Date("2025-08-01"),
      },
      {
        employee: employees[1] ? employees[1]._id : employees[0]._id,
        company: companyId,
        leaveType: "short",
        startDate: new Date("2025-08-25"),
        endDate: new Date("2025-08-25"),
        days: 1,
        reason: "Wedding ceremony",
        status: "approved",
        managerAction: "approved",
        approvedBy: adminUser._id,
        approvedDate: new Date("2025-08-02"),
        submittedDate: new Date("2025-08-01"),
      },
    ];

    // Clear existing sample leaves (optional)
    await Leave.deleteMany({ company: companyId });

    // Create sample leaves
    for (const leaveData of sampleLeaves) {
      const leave = new Leave(leaveData);
      await leave.save();
      console.log(`Created leave request for ${leaveData.leaveType} leave`);
    }

    console.log("Sample leave requests created successfully!");
    console.log("Created leaves with statuses: pending, approved, rejected, pending, approved");

  } catch (error) {
    console.error("Error creating sample leaves:", error);
  } finally {
    mongoose.connection.close();
  }
}

createSampleLeaves(); 