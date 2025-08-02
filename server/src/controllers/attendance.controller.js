const { validationResult } = require('express-validator');
const attendanceService = require('../services/attendance.service');

class AttendanceController {
  // Check in an employee
  async checkIn(req, res) {
    try {
      const { employeeId } = req.body;
      const { companyId } = req.user;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
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
      const { employeeId } = req.body;
      const { companyId } = req.user;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Employee ID is required'
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
          message: 'Start date and end date are required'
        });
      }

      const attendanceRecords = await attendanceService.getEmployeeAttendance(
        employeeId, 
        startDate, 
        endDate
      );
      
      res.status(200).json({
        success: true,
        data: attendanceRecords
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get company attendance for a date range
  async getCompanyAttendance(req, res) {
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

      const attendanceRecords = await attendanceService.getCompanyAttendance(
        companyId,
        startDate,
        endDate,
        filters
      );
      
      res.status(200).json({
        success: true,
        data: attendanceRecords
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get attendance summary
  async getAttendanceSummary(req, res) {
    try {
      const { companyId } = req.user;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const summary = await attendanceService.getAttendanceSummary(
        companyId,
        startDate,
        endDate
      );
      
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get today's attendance status for an employee
  async getTodaysAttendance(req, res) {
    try {
      const { employeeId } = req.params;
      const { companyId } = req.user;

      const attendance = await attendanceService.getTodaysAttendance(employeeId, companyId);
      
      res.status(200).json({
        success: true,
        data: attendance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update attendance record (admin function)
  async updateAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const updateData = req.body;

      const attendance = await attendanceService.updateAttendance(attendanceId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Attendance record updated successfully',
        data: attendance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
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

module.exports = new AttendanceController();
