const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Apply authentication middleware to all routes
router.use(authenticate);

// Create leave request
router.post("/requests", leaveController.createLeaveRequest);

// Get all leave requests with filtering
router.get("/requests", leaveController.getLeaveRequests);

// Get leave request by ID
router.get("/requests/:leaveId", leaveController.getLeaveRequestById);

// Update leave request status (approve/reject/cancel)
router.put("/requests/:leaveId/status", leaveController.updateLeaveStatus);

// Update manager action on leave request
router.put("/requests/:leaveId/manager-action", leaveController.updateManagerAction);

// Update leave request
router.put("/requests/:leaveId", leaveController.updateLeaveRequest);

// Delete leave request
router.delete("/requests/:leaveId", leaveController.deleteLeaveRequest);

// Get employee leave requests
router.get("/requests/employee/:employeeId", leaveController.getEmployeeLeaveRequests);

// Get leave summary
router.get("/summary", leaveController.getLeaveSummary);

module.exports = router; 