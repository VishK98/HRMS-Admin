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

      // Return employee without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        data: employeeResponse,
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

      // Clean up reportingManager if it's an empty object
      if (
        updateData.reportingManager &&
        typeof updateData.reportingManager === "object" &&
        Object.keys(updateData.reportingManager).length === 0
      ) {
        updateData.reportingManager = null;
      }

      // Update fields
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
          if (
            typeof updateData[key] === "object" &&
            !Array.isArray(updateData[key])
          ) {
            // Handle nested objects
            employee[key] = { ...employee[key], ...updateData[key] };
          } else {
            employee[key] = updateData[key];
          }
        }
      });

      // Update timestamp
      employee.updatedAt = new Date();

      // Check if profile is complete
      employee.isProfileComplete = this.checkProfileCompleteness(employee);

      await employee.save();

      // Return updated employee without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        message: "Employee profile updated successfully",
        data: employeeResponse,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update employee documents
  async updateEmployeeDocuments(employeeId, documentUrls) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Update documents
      employee.documents = { ...employee.documents, ...documentUrls };
      employee.updatedAt = new Date();

      await employee.save();

      // Return updated employee without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        message: "Documents updated successfully",
        data: employeeResponse,
      };
    } catch (error) {
      throw error;
    }
  }

  // Update employee education documents
  async updateEmployeeEducation(employeeId, educationUrls) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Update education documents
      employee.education = { ...employee.education, ...educationUrls };
      employee.updatedAt = new Date();

      await employee.save();

      // Return updated employee without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        message: "Education documents updated successfully",
        data: employeeResponse,
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
      if (filters.department) {
        query.department = { $regex: new RegExp(filters.department, "i") };
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.role) {
        query.role = filters.role;
      }
      if (filters.search) {
        query.$or = [
          { firstName: { $regex: new RegExp(filters.search, "i") } },
          { lastName: { $regex: new RegExp(filters.search, "i") } },
          { email: { $regex: new RegExp(filters.search, "i") } },
          { employeeId: { $regex: new RegExp(filters.search, "i") } },
        ];
      }

      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const employees = await Employee.find(query)
        .populate("company", "name code")
        .populate("reportingManager", "firstName lastName employeeId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Employee.countDocuments(query);

      // Remove passwords from response
      const employeesResponse = employees.map((emp) => {
        const empObj = emp.toObject();
        delete empObj.password;
        return empObj;
      });

      return {
        success: true,
        data: {
          employees: employeesResponse,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: limit,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(employeeId) {
    try {
      const employee = await Employee.findById(employeeId)
        .populate("company", "name code")
        .populate("reportingManager", "firstName lastName employeeId");

      if (!employee) {
        throw new Error("Employee not found");
      }

      // Return employee without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        data: employeeResponse,
      };
    } catch (error) {
      throw error;
    }
  }

  // Deactivate employee
  async deactivateEmployee(employeeId) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      employee.status = "inactive";
      employee.updatedAt = new Date();
      await employee.save();

      // Return employee without password
      const employeeResponse = employee.toObject();
      delete employeeResponse.password;

      return {
        success: true,
        message: "Employee deactivated successfully",
        data: employeeResponse,
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate employee ID
  generateEmployeeId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `EMP${year}${random}`;
  }

  // Get employee statistics
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
            managers: {
              $sum: { $cond: [{ $eq: ["$role", "manager"] }, 1, 0] },
            },
            employees: {
              $sum: { $cond: [{ $eq: ["$role", "employee"] }, 1, 0] },
            },
          },
        },
      ]);

      const departmentStats = await Employee.aggregate([
        {
          $match: {
            company: companyId,
            department: { $exists: true, $ne: "" },
          },
        },
        {
          $group: {
            _id: "$department",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      const statusStats = await Employee.aggregate([
        { $match: { company: companyId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const result = stats[0] || {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        managers: 0,
        employees: 0,
      };

      return {
        success: true,
        data: {
          ...result,
          departmentStats,
          statusStats,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Check if employee profile is complete
  checkProfileCompleteness(employee) {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "gender",
      "dateOfBirth",
      "employeeId",
      "department",
      "designation",
      "joiningDate",
    ];

    return requiredFields.every((field) => {
      const value = employee[field];
      return value !== undefined && value !== null && value !== "";
    });
  }
}

module.exports = new EmployeeService();
