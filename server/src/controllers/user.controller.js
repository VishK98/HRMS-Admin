const { validationResult } = require('express-validator');
const userService = require('../services/user.service');

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
}

module.exports = new UserController(); 