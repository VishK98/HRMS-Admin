const Regularization = require('../models/regularization.model');
const Employee = require('../models/employee.model');

class RegularizationService {
  // Create a new regularization request
  async createRequest(employeeId, companyId, date, reason) {
    try {
      // Check if employee exists
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Check if a request already exists for this date
      const existingRequest = await Regularization.findOne({
        employee: employeeId,
        date: new Date(date),
        company: companyId
      });

      if (existingRequest) {
        throw new Error('A regularization request already exists for this date');
      }

      // Create new regularization request
      const regularization = new Regularization({
        employee: employeeId,
        date: new Date(date),
        reason,
        company: companyId
      });

      await regularization.save();
      return regularization;
    } catch (error) {
      throw error;
    }
  }

  // Get regularization requests for an employee
  async getEmployeeRequests(employeeId, startDate, endDate) {
    try {
      const query = {
        employee: employeeId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      const requests = await Regularization.find(query).sort({ createdAt: -1 });
      return requests;
    } catch (error) {
      throw error;
    }
  }

  // Get regularization requests for a company
  async getCompanyRequests(companyId, startDate, endDate, filters = {}) {
    try {
      const query = {
        company: companyId,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      // Apply filters
      if (filters.employeeId) {
        query.employee = filters.employeeId;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      const requests = await Regularization.find(query)
        .populate('employee', 'firstName lastName employeeId department designation')
        .populate('approvedBy', 'name email')
        .sort({ createdAt: -1 });

      return requests;
    } catch (error) {
      throw error;
    }
  }

  // Get regularization request by ID
  async getRequestById(requestId) {
    try {
      const request = await Regularization.findById(requestId)
        .populate('employee', 'firstName lastName employeeId department designation')
        .populate('approvedBy', 'name email');

      if (!request) {
        throw new Error('Regularization request not found');
      }

      return request;
    } catch (error) {
      throw error;
    }
  }

  // Update regularization request status (approve/reject)
  async updateRequestStatus(requestId, status, approvedBy) {
    try {
      const request = await Regularization.findByIdAndUpdate(
        requestId,
        {
          status,
          approvedBy,
          approvedAt: status === 'approved' || status === 'rejected' ? new Date() : null
        },
        { new: true, runValidators: true }
      ).populate('employee', 'firstName lastName employeeId department designation');

      if (!request) {
        throw new Error('Regularization request not found');
      }

      return request;
    } catch (error) {
      throw error;
    }
  }

  // Delete regularization request
  async deleteRequest(requestId) {
    try {
      const request = await Regularization.findByIdAndDelete(requestId);

      if (!request) {
        throw new Error('Regularization request not found');
      }

      return { message: 'Regularization request deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RegularizationService();
