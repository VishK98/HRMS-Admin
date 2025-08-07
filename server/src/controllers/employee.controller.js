const { validationResult } = require("express-validator");
const employeeService = require("../services/employee.service");
const activityService = require("../services/activity.service");
const fs = require("fs");
const path = require("path");

class EmployeeController {
  // Employee self-registration
  async registerEmployee(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const result = await employeeService.registerEmployee(req.body);
      
      // Log activity for employee registration
      if (result.success && result.data) {
        await activityService.logEmployeeActivity(
          `New employee registered: ${result.data.firstName} ${result.data.lastName}`,
          result.data._id,
          result.data.company,
          req.user?.id,
          { employeeId: result.data.employeeId }
        );
      }
      
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Employee login
  async loginEmployee(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      const result = await employeeService.loginEmployee(email, password);
      
      // Log activity for employee login
      if (result.success && result.data) {
        await activityService.logUserActivity(
          `Employee logged in: ${result.data.firstName} ${result.data.lastName}`,
          result.data._id,
          result.data.company,
          { email: email }
        );
      }
      
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get employee profile
  async getEmployeeProfile(req, res) {
    try {
      const result = await employeeService.getEmployeeProfile(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update employee profile (admin function)
  async updateEmployeeProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { employeeId } = req.params;
      const result = await employeeService.updateEmployeeProfile(
        employeeId,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all employees by company (admin function)
  async getEmployeesByCompany(req, res) {
    try {
      const { companyId } = req.params;
      const filters = req.query;
      const result = await employeeService.getEmployeesByCompany(
        companyId,
        filters
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get employee by ID
  async getEmployeeById(req, res) {
    try {
      const { employeeId } = req.params;
      const result = await employeeService.getEmployeeById(employeeId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Deactivate employee
  async deactivateEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const result = await employeeService.deactivateEmployee(employeeId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get employee stats
  async getEmployeeStats(req, res) {
    try {
      const { companyId } = req.params;
      const result = await employeeService.getEmployeeStats(companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Upload multiple documents
  async uploadDocuments(req, res) {
    try {
      const { employeeId } = req.params;
      const uploadedFiles = req.files;

      if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const documentUrls = {};

      // Process each uploaded file
      for (const [fieldName, files] of Object.entries(uploadedFiles)) {
        if (files && files.length > 0) {
          const file = files[0];
          const fileUrl = `/uploads/employees/${employeeId}/documents/${file.filename}`;
          documentUrls[fieldName] = fileUrl;
        }
      }

      // Update employee with document URLs
      const result = await employeeService.updateEmployeeDocuments(
        employeeId,
        documentUrls
      );

      res.status(200).json({
        success: true,
        message: "Documents uploaded successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Upload education documents
  async uploadEducationDocuments(req, res) {
    try {
      const { employeeId } = req.params;
      const uploadedFiles = req.files;

      if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const educationUrls = {};

      // Process each uploaded file
      for (const [fieldName, files] of Object.entries(uploadedFiles)) {
        if (files && files.length > 0) {
          const file = files[0];
          const fileUrl = `/uploads/employees/${employeeId}/education/${file.filename}`;
          educationUrls[fieldName] = fileUrl;
        }
      }

      // Update employee with education document URLs
      const result = await employeeService.updateEmployeeEducation(
        employeeId,
        educationUrls
      );

      res.status(200).json({
        success: true,
        message: "Education documents uploaded successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Upload single document
  async uploadSingleDocument(req, res) {
    try {
      const { employeeId, documentType } = req.params;
      const uploadedFile = req.file;

      if (!uploadedFile) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // All documents stored in documents folder
      const filePath = `/uploads/employees/${employeeId}/documents/${uploadedFile.filename}`;

      // Update employee with document URL - all documents stored in documents field
      const updateData = {
        documents: { [documentType]: filePath },
      };

      const result = await employeeService.updateEmployeeProfile(
        employeeId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete document
  async deleteDocument(req, res) {
    try {
      const { employeeId, documentType } = req.params;

      // Get current employee data
      const employee = await employeeService.getEmployeeById(employeeId);

      let filePath;
      if (
        [
          "intermediate",
          "undergraduate",
          "postgraduate",
        ].includes(documentType)
      ) {
        filePath = employee.education?.[documentType];
      } else {
        filePath = employee.documents?.[documentType];
      }

      // Delete file from filesystem if it exists
      if (filePath) {
        const fullPath = path.join(__dirname, "../../..", filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      // Update employee to remove document URL
      const updateData = {};
      if (
        [
          "intermediate",
          "undergraduate",
          "postgraduate",
        ].includes(documentType)
      ) {
        updateData.education = { [documentType]: null };
      } else {
        updateData.documents = { [documentType]: null };
      }

      const result = await employeeService.updateEmployeeProfile(
        employeeId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Document deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Debug endpoint to check user role and permissions
  async checkUserRole(req, res) {
    try {
      const user = req.user;
      res.status(200).json({
        success: true,
        message: "User role check",
        data: {
          userId: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
          company: user.company,
          permissions: {
            canUploadDocuments: ["admin", "super_admin"].includes(user.role),
            canUpdateEmployees: ["admin", "super_admin"].includes(user.role),
            canViewAllEmployees: ["admin", "super_admin"].includes(user.role),
          },
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Temporary function to create admin user (remove in production)
  async createAdminUser(req, res) {
    try {
      const adminData = {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        phone: "+919876543210",
        gender: "male",
        dateOfBirth: "1990-01-01",
        employeeId: "ADMIN001",
        department: "IT",
        designation: "System Administrator",
        role: "admin",
        status: "active",
        joiningDate: "2024-01-01",
        password: "password123",
        companyName: "Example Corp",
      };

      const result = await employeeService.registerEmployee(adminData);
      res.status(201).json({
        success: true,
        message: "Admin user created successfully",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new EmployeeController();
