const { validationResult } = require('express-validator');
const employeeService = require('../services/employee.service');

class EmployeeController {
  // Employee self-registration
  async registerEmployee(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const result = await employeeService.registerEmployee(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
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
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await employeeService.loginEmployee(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
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
        message: error.message
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
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { employeeId } = req.params;
      const result = await employeeService.updateEmployeeProfile(employeeId, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all employees by company (admin function)
  async getEmployeesByCompany(req, res) {
    try {
      const { companyId } = req.params;
      const filters = req.query;
      const result = await employeeService.getEmployeesByCompany(companyId, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get employee by ID (admin function)
  async getEmployeeById(req, res) {
    try {
      const { employeeId } = req.params;
      const result = await employeeService.getEmployeeById(employeeId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Deactivate employee (admin function)
  async deactivateEmployee(req, res) {
    try {
      const { employeeId } = req.params;
      const result = await employeeService.deactivateEmployee(employeeId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get employee statistics (admin function)
  async getEmployeeStats(req, res) {
    try {
      const { companyId } = req.params;
      const result = await employeeService.getEmployeeStats(companyId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new EmployeeController(); 