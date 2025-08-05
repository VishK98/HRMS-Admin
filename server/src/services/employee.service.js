const Employee = require("../models/employee.model");
const Company = require("../models/company.model");
const { generateToken } = require("../utils/token.util");

class EmployeeService {
  // Employee self-registration
  async registerEmployee(employeeData) {
    try {
      // Check if company exists
      const company = await Company.findOne({
        name: { $regex: new RegExp(employeeData.companyName, "i") },
        isActive: true,
      });

      if (!company) {
        throw new Error("Company not found or inactive");
      }

      // Check if email already exists
      const existingEmployee = await Employee.findOne({
        email: employeeData.email,
      });
      if (existingEmployee) {
        throw new Error("Employee with this email already exists");
      }

      // Create employee with basic info
      const employee = new Employee({
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        gender: employeeData.gender,
        dateOfBirth: employeeData.dateOfBirth,
        email: employeeData.email,
        phone: employeeData.phone,
        password: employeeData.password,
        company: company._id,
        employeeId: this.generateEmployeeId(),
        isProfileComplete: false,
      });

      await employee.save();

      // Return employee without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        message: "Employee registered successfully",
        data: {
          employee: employeeResponse,
          company: {
            id: company._id,
            name: company.name,
            code: company.code,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Employee login
  async loginEmployee(email, password) {
    try {
      const employee = await Employee.findOne({ email: email.toLowerCase() })
        .populate("company", "name code")
        .populate("reportingManager", "firstName lastName employeeId");

      if (!employee) {
        throw new Error("Invalid email or password");
      }

      if (employee.status !== "active") {
        throw new Error("Account is not active");
      }

      const isPasswordValid = await employee.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      // Update last login
      employee.lastLogin = new Date();
      await employee.save();

      // Generate token
      const token = generateToken({
        id: employee._id,
        email: employee.email,
        role: employee.role,
        company: employee.company._id,
      });

      // Return employee data without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        message: "Login successful",
        data: {
          employee: employeeResponse,
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get employee profile
  async getEmployeeProfile(employeeId) {
    try {
      const employee = await Employee.findById(employeeId)
        .populate("company", "name code")
        .populate("reportingManager", "firstName lastName employeeId");

      if (!employee) {
        throw new Error("Employee not found");
      }

      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        data: { employee: employeeResponse },
      };
    } catch (error) {
      throw error;
    }
  }

  // Update employee profile (admin function)
  async updateEmployeeProfile(employeeId, updateData) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Update fields - expanded to include all employee fields
      const allowedFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "employeeId",
        "department",
        "designation",
        "subcategory",
        "reportingManager",
        "joiningDate",
        "dateOfBirth",
        "gender",
        "maritalStatus",
        "bloodGroup",
        "salary",
        "bankDetails",
        "address",
        "emergencyContact",
        "documents",
        "education",
        "skills",
        "team",
        "performance",
        "notes",
        "leaveBalance",
        "status",
        "isProfileComplete",
        "role",
        "lastLogin",
      ];

      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          employee[field] = updateData[field];
        }
      });

      // Mark profile as complete if all required fields are filled
      if (employee.department && employee.designation && employee.joiningDate) {
        employee.isProfileComplete = true;
      }

      await employee.save();

      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        message: "Employee profile updated successfully",
        data: { employee: employeeResponse },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all employees by company (admin function)
  async getEmployeesByCompany(companyId, filters = {}) {
    try {
      const query = { company: companyId };

      // Apply filters
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.department) {
        query.department = { $regex: new RegExp(filters.department, "i") };
      }
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: new RegExp(filters.search, "i") } },
          { lastName: { $regex: new RegExp(filters.search, "i") } },
          { email: { $regex: new RegExp(filters.search, "i") } },
          { employeeId: { $regex: new RegExp(filters.search, "i") } },
        ];
      }

      const employees = await Employee.find(query)
        .populate("company", "name code")
        .populate("reportingManager", "firstName lastName employeeId")
        .select("-password")
        .sort({ createdAt: -1 });

      return {
        success: true,
        data: { employees },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get employee by ID (admin function)
  async getEmployeeById(employeeId) {
    try {
      const employee = await Employee.findById(employeeId)
        .populate("company", "name code")
        .populate("reportingManager", "firstName lastName employeeId");

      if (!employee) {
        throw new Error("Employee not found");
      }

      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        data: { employee: employeeResponse },
      };
    } catch (error) {
      throw error;
    }
  }

  // Deactivate employee (admin function)
  async deactivateEmployee(employeeId) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      employee.status = "inactive";
      await employee.save();

      return {
        success: true,
        message: "Employee deactivated successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate unique employee ID
  generateEmployeeId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `EMP${year}${random}`;
  }

  // Get employee statistics (admin function)
  async getEmployeeStats(companyId) {
    try {
      const stats = await Employee.aggregate([
        { $match: { company: companyId } },
        {
          $group: {
            _id: null,
            totalEmployees: { $sum: 1 },
            activeEmployees: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            inactiveEmployees: {
              $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
            },
            completeProfiles: {
              $sum: { $cond: ["$isProfileComplete", 1, 0] },
            },
            incompleteProfiles: {
              $sum: { $cond: ["$isProfileComplete", 0, 1] },
            },
          },
        },
      ]);

      return {
        success: true,
        data: { stats: stats[0] || {} },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EmployeeService();
