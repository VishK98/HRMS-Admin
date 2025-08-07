const leaveService = require("../services/leave.service");
const activityService = require("../services/activity.service");
const Employee = require("../models/employee.model");

class LeaveController {
  // Create leave request
  async createLeaveRequest(req, res) {
    try {
      const { employeeId, leaveType, halfDayType, startDate, endDate, reason, days } = req.body;

      // Get company ID from user
      let companyId;
      if (req.user.role === "super_admin") {
        companyId = req.body.companyId;
        if (!companyId) {
          return res.status(400).json({
            success: false,
            message: "Company ID is required for super admin",
          });
        }
      } else {
        companyId = req.user.company?._id || req.user.companyId || req.user.company;
      }

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID is required",
        });
      }

      // Validate required fields
      if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
        return res.status(400).json({
          success: false,
          message: "Employee ID, leave type, start date, end date, and reason are required",
        });
      }

      // Validate leave type
      const validLeaveTypes = ["paid", "casual", "short", "sick", "halfday"];
      if (!validLeaveTypes.includes(leaveType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid leave type. Must be one of: paid, casual, short, sick, halfday",
        });
      }

      // Validate half day type for half day leaves
      if (leaveType === "halfday") {
        if (!halfDayType || !["first", "second"].includes(halfDayType)) {
          return res.status(400).json({
            success: false,
            message: "Half day type must be 'first' or 'second' for half day leaves",
          });
        }
      }

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }

      // Check if employee belongs to company
      const employee = await Employee.findById(employeeId);
      if (!employee || employee.company.toString() !== companyId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Employee not found or does not belong to this company",
        });
      }

      const leaveData = {
        employeeId,
        companyId,
        leaveType,
        halfDayType,
        startDate,
        endDate,
        reason,
        days,
      };

      const leave = await leaveService.createLeaveRequest(leaveData);

      // Log activity for leave request creation
      if (leave) {
        const employee = await Employee.findById(employeeId);
        if (employee) {
          await activityService.logLeaveActivity(
            `Leave request created: ${employee.firstName} ${employee.lastName} - ${leaveType} leave`,
            employeeId,
            companyId,
            req.user?.id,
            { 
              leaveType,
              startDate,
              endDate,
              days,
              status: leave.status
            }
          );
        }
      }

      res.status(201).json({
        success: true,
        message: "Leave request created successfully",
        data: leave,
      });
    } catch (error) {
      console.error("Error creating leave request:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to create leave request",
      });
    }
  }

  // Get all leave requests with filtering
  async getLeaveRequests(req, res) {
    try {
      const { status, leaveType, startDate, endDate, employeeId } = req.query;

      // Get company ID from user
      let companyId;
      if (req.user.role === "super_admin") {
        companyId = req.query.companyId;
        // For super admin, if no company ID is provided, get all leave requests
        if (!companyId) {
          const filters = {
            status,
            leaveType,
            startDate,
            endDate,
            employeeId,
          };

          // Clean filters - remove undefined values
          Object.keys(filters).forEach(key => {
            if (filters[key] === undefined || filters[key] === null || filters[key] === "") {
              delete filters[key];
            }
          });

          const leaves = await leaveService.getAllLeaveRequests(filters);

          res.status(200).json({
            success: true,
            message: "All leave requests retrieved successfully",
            data: leaves,
          });
          return;
        }
      } else {
        companyId = req.user.company?._id || req.user.companyId || req.user.company;
      }

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID is required",
        });
      }

      const filters = {
        companyId,
        status,
        leaveType,
        startDate,
        endDate,
        employeeId,
      };

      // Clean filters - remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key] === undefined || filters[key] === null || filters[key] === "") {
          delete filters[key];
        }
      });

      const leaves = await leaveService.getLeaveRequests(filters);

      res.status(200).json({
        success: true,
        message: "Leave requests retrieved successfully",
        data: leaves,
      });
    } catch (error) {
      console.error("Error getting leave requests:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get leave requests",
      });
    }
  }

  // Get leave request by ID
  async getLeaveRequestById(req, res) {
    try {
      const { leaveId } = req.params;

      const leave = await leaveService.getLeaveRequestById(leaveId);

      if (!leave) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Leave request retrieved successfully",
        data: leave,
      });
    } catch (error) {
      console.error("Error getting leave request:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get leave request",
      });
    }
  }

  // Update leave request status (approve/reject/cancel)
  async updateLeaveStatus(req, res) {
    try {
      const { leaveId } = req.params;
      const { status, comments } = req.body;

      if (!status || !["approved", "rejected", "cancelled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be 'approved', 'rejected', or 'cancelled'",
        });
      }

      const statusData = { status, comments };

      const leave = await leaveService.updateLeaveStatus(leaveId, statusData, req.user._id);

      if (!leave) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }

      // Log activity for leave status update
      if (leave.employee) {
        await activityService.logLeaveActivity(
          `Leave request ${status}: ${leave.employee.firstName} ${leave.employee.lastName} - ${leave.leaveType} leave`,
          leave.employee._id,
          leave.company,
          req.user._id,
          { 
            leaveType: leave.leaveType,
            status,
            comments,
            updatedBy: req.user._id
          }
        );
      }

      res.status(200).json({
        success: true,
        message: `Leave request ${status} successfully`,
        data: leave,
      });
    } catch (error) {
      console.error("Error updating leave status:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update leave status",
      });
    }
  }

  // Update manager action on leave request
  async updateManagerAction(req, res) {
    try {
      const { leaveId } = req.params;
      const { action, comment } = req.body;

      if (!action || !["pending", "approved", "rejected"].includes(action)) {
        return res.status(400).json({
          success: false,
          message: "Action must be 'pending', 'approved', or 'rejected'",
        });
      }

      const leave = await leaveService.updateManagerAction(leaveId, { action, comment }, req.user._id);

      if (!leave) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: `Manager action updated to ${action} successfully`,
        data: leave,
      });
    } catch (error) {
      console.error("Error updating manager action:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update manager action",
      });
    }
  }

  // Update leave request
  async updateLeaveRequest(req, res) {
    try {
      const { leaveId } = req.params;
      const updateData = req.body;

      const leave = await leaveService.updateLeaveRequest(leaveId, updateData);

      if (!leave) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Leave request updated successfully",
        data: leave,
      });
    } catch (error) {
      console.error("Error updating leave request:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to update leave request",
      });
    }
  }

  // Delete leave request
  async deleteLeaveRequest(req, res) {
    try {
      const { leaveId } = req.params;

      const leave = await leaveService.deleteLeaveRequest(leaveId);

      if (!leave) {
        return res.status(404).json({
          success: false,
          message: "Leave request not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Leave request deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting leave request:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete leave request",
      });
    }
  }

  // Get employee leave requests
  async getEmployeeLeaveRequests(req, res) {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query;

      const leaves = await leaveService.getEmployeeLeaveRequests(employeeId, startDate, endDate);

      res.status(200).json({
        success: true,
        message: "Employee leave requests retrieved successfully",
        data: leaves,
      });
    } catch (error) {
      console.error("Error getting employee leave requests:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get employee leave requests",
      });
    }
  }

  // Get leave summary
  async getLeaveSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;

      // Get company ID from user
      let companyId;
      if (req.user.role === "super_admin") {
        companyId = req.query.companyId;
        if (!companyId) {
          return res.status(400).json({
            success: false,
            message: "Company ID is required for super admin",
          });
        }
      } else {
        companyId = req.user.company?._id || req.user.companyId || req.user.company;
      }

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID is required",
        });
      }

      const summary = await leaveService.getLeaveSummary(companyId, startDate, endDate);

      res.status(200).json({
        success: true,
        message: "Leave summary retrieved successfully",
        data: summary,
      });
    } catch (error) {
      console.error("Error getting leave summary:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get leave summary",
      });
    }
  }
}

module.exports = new LeaveController(); 