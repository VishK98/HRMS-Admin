const express = require('express');
const attendanceController = require('../controllers/attendance.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// Check in
router.post('/check-in', attendanceController.checkIn);

// Check out
router.post('/check-out', attendanceController.checkOut);

// Get employee attendance for a date range
router.get('/employee/:employeeId', attendanceController.getEmployeeAttendance);

// Get company attendance for a date range
router.get('/company', attendanceController.getCompanyAttendance);

// Get attendance summary
router.get('/summary', attendanceController.getAttendanceSummary);

// Get today's attendance status for an employee
router.get('/today/:employeeId', attendanceController.getTodaysAttendance);

// Update attendance record (admin only)
router.put('/:attendanceId', 
  authMiddleware.authorize(['admin']), 
  attendanceController.updateAttendance
);

// Delete attendance record (admin only)
router.delete('/:attendanceId', 
  authMiddleware.authorize(['admin']), 
  attendanceController.deleteAttendance
);

module.exports = router;
