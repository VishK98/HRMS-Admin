const { validationResult } = require("express-validator");
const attendanceService = require("../services/attendance.service");

class AttendanceController {
  // Check in an employee
  async checkIn(req, res) {
    try {
      const { employeeId, companyId: requestCompanyId } = req.body;
      let companyId = req.user.company?._id || req.user.companyId || req.user.company;

      // For super admin, allow specifying company ID in request body
      if (req.user.role === 'super_admin' && requestCompanyId) {
        companyId = requestCompanyId;
      }

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID is required. For super admin, please include companyId in request body.'
        });
      }

      // Validate that the employee belongs to the same company
      const Employee = require('../models/employee.model');
      const employee = await Employee.findOne({ 
        _id: employeeId, 
        company: companyId 
      });

      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Employee not found or does not belong to the specified company'
        });
      }

      const attendance = await attendanceService.checkIn(employeeId, companyId);
      
      res.status(201).json({
        success: true,
        message: 'Check-in successful',
        data: attendance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Check out an employee
  async checkOut(req, res) {
    try {
      const { employeeId, companyId: requestCompanyId } = req.body;
      let companyId = req.user.company?._id || req.user.companyId || req.user.company;

      // For super admin, allow specifying company ID in request body
      if (req.user.role === 'super_admin' && requestCompanyId) {
        companyId = requestCompanyId;
      }

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
        });
      }

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID is required. For super admin, please include companyId in request body.'
        });
      }

      // Validate that the employee belongs to the same company
      const Employee = require('../models/employee.model');
      const employee = await Employee.findOne({ 
        _id: employeeId, 
        company: companyId 
      });

      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'Employee not found or does not belong to the specified company'
        });
      }

      const attendance = await attendanceService.checkOut(employeeId, companyId);
      
      res.status(200).json({
        success: true,
        message: 'Check-out successful',
        data: attendance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get employee attendance for a date range
  async getEmployeeAttendance(req, res) {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      const attendanceRecords = await attendanceService.getEmployeeAttendance(
        employeeId,
        startDate,
        endDate
      );

      res.status(200).json({
        success: true,
        data: attendanceRecords,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get company attendance for a date range
  async getCompanyAttendance(req, res) {
    try {
      const companyId =
        req.user.company?._id || req.user.companyId || req.user.company;
      const { startDate, endDate } = req.query;
      const filters = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID not found in user context",
        });
      }

      const attendanceRecords = await attendanceService.getCompanyAttendance(
        companyId,
        startDate,
        endDate,
        filters
      );

      res.status(200).json({
        success: true,
        data: attendanceRecords,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get attendance summary
  async getAttendanceSummary(req, res) {
    try {
      const companyId =
        req.user.company?._id || req.user.companyId || req.user.company;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required",
        });
      }

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID not found in user context",
        });
      }

      const summary = await attendanceService.getAttendanceSummary(
        companyId,
        startDate,
        endDate
      );

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get today's attendance status for an employee
  async getTodaysAttendance(req, res) {
    try {
      const { employeeId } = req.params;
      const companyId =
        req.user.company?._id || req.user.companyId || req.user.company;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID not found in user context",
        });
      }

      const attendance = await attendanceService.getTodaysAttendance(
        employeeId,
        companyId
      );

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update attendance record (admin function)
  async updateAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const updateData = req.body;

      const attendance = await attendanceService.updateAttendance(
        attendanceId,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Attendance record updated successfully",
        data: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete attendance record (admin function)
  async deleteAttendance(req, res) {
    try {
      const { attendanceId } = req.params;

      const result = await attendanceService.deleteAttendance(attendanceId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AttendanceController();
