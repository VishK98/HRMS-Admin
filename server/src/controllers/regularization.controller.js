const { validationResult } = require('express-validator');
const regularizationService = require('../services/regularization.service');

class RegularizationController {
  // Create a new regularization request
  async createRequest(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { employeeId, date, reason } = req.body;
      const { companyId } = req.user;

      const regularization = await regularizationService.createRequest(
        employeeId,
        companyId,
        date,
        reason
      );
      
      res.status(201).json({
        success: true,
        message: 'Regularization request created successfully',
        data: regularization
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get regularization requests for an employee
  async getEmployeeRequests(req, res) {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const requests = await regularizationService.getEmployeeRequests(
        employeeId,
        startDate,
        endDate
      );
      
      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get regularization requests for a company
  async getCompanyRequests(req, res) {
    try {
      const { companyId } = req.user;
      const { startDate, endDate } = req.query;
      const filters = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const requests = await regularizationService.getCompanyRequests(
        companyId,
        startDate,
        endDate,
        filters
      );
      
      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get regularization request by ID
  async getRequestById(req, res) {
    try {
      const { requestId } = req.params;

      const request = await regularizationService.getRequestById(requestId);
      
      res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update regularization request status (approve/reject)
  async updateRequestStatus(req, res) {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      const { _id: approvedBy } = req.user;

      // Validate status
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either approved or rejected'
        });
      }

      const request = await regularizationService.updateRequestStatus(
        requestId,
        status,
        approvedBy
      );
      
      res.status(200).json({
        success: true,
        message: `Regularization request ${status} successfully`,
        data: request
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete regularization request
  async deleteRequest(req, res) {
    try {
      const { requestId } = req.params;

      const result = await regularizationService.deleteRequest(requestId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new RegularizationController();
