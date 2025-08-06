const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const User = require("../models/user.model");
const Employee = require("../models/employee.model");

class UserController {
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await userService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  async registerCompany(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const {
        companyName,
        companyCode,
        companyEmail,
        companyPhone,
        companyAddress,
        companyWebsite,
        companyIndustry,
        adminName,
        adminEmail,
        adminPassword,
        adminPhone
      } = req.body;

      const companyData = {
        name: companyName,
        code: companyCode,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
        website: companyWebsite,
        industry: companyIndustry
      };

      const adminData = {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone
      };

      const result = await userService.registerCompany(companyData, adminData);

      res.status(201).json({
        success: true,
        message: 'Company and admin registered successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Company registration failed'
      });
    }
  }

  async getProfile(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: req.user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get profile'
      });
    }
  }

  async getAllCompanies(req, res) {
    try {
      const companies = await userService.getAllCompanies();
      
      res.status(200).json({
        success: true,
        data: companies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch companies'
      });
    }
  }

  async getCompanyById(req, res) {
    try {
      const { companyId } = req.params;
      const company = await userService.getCompanyById(companyId);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch company'
      });
    }
  }

  async getUsersByCompany(req, res) {
    try {
      const { companyId } = req.params;
      const users = await userService.getUsersByCompany(companyId);
      
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const updateData = req.body;
      const updatedUser = await userService.updateUser(req.user._id, updateData);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'Profile update failed'
      });
    }
  }

  // Get user statistics for super admin
  async getUserStats(req, res) {
    try {
      // Get total users across all companies
      const totalUsers = await Employee.countDocuments();
      
      // Get active users
      const activeUsers = await Employee.countDocuments({ status: "active" });
      
      // Get inactive users
      const inactiveUsers = await Employee.countDocuments({ status: "inactive" });
      
      // Get users by role
      const usersByRole = await Employee.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get users by department
      const usersByDepartment = await Employee.aggregate([
        {
          $match: {
            department: { $exists: true, $ne: "" },
          },
        },
        {
          $group: {
            _id: "$department",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      // Get recent users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentUsers = await Employee.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });

      // Get users by company
      const usersByCompany = await Employee.aggregate([
        {
          $lookup: {
            from: "companies",
            localField: "company",
            foreignField: "_id",
            as: "companyInfo",
          },
        },
        {
          $unwind: "$companyInfo",
        },
        {
          $group: {
            _id: "$companyInfo.name",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      const stats = {
        totalUsers,
        activeUsers,
        inactiveUsers,
        recentUsers,
        usersByRole,
        usersByDepartment,
        usersByCompany,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getUserStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user statistics",
      });
    }
  }

  // Get all users (for super admin)
  async getAllUsers(req, res) {
    try {
      const users = await Employee.find()
        .select('firstName lastName email status role department company createdAt')
        .populate('company', 'name code')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }

  // Initialize super admin user
  async initSuperAdmin(req, res) {
    try {
      const superAdmin = await userService.createSuperAdmin();
      
      res.status(200).json({
        success: true,
        message: 'Super admin initialized successfully',
        data: {
          email: superAdmin.email,
          role: superAdmin.role
        }
      });
    } catch (error) {
      console.error("Error in initSuperAdmin:", error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to initialize super admin'
      });
    }
  }
}

module.exports = new UserController(); 