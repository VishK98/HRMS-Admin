const Leave = require("../models/leave.model");
const Employee = require("../models/employee.model");
const mongoose = require("mongoose");

class LeaveService {
  // Create a new leave request
  async createLeaveRequest(leaveData) {
    try {
      // Validate that employee belongs to the company
      const employee = await Employee.findById(leaveData.employeeId);
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Check for overlapping leave requests
      const startDate = new Date(leaveData.startDate);
      const endDate = new Date(leaveData.endDate);

      // Find existing leave requests for the same employee that overlap with the new request
      const overlappingLeaves = await Leave.find({
        employee: leaveData.employeeId,
        company: leaveData.companyId,
        status: { $nin: ['cancelled', 'rejected'] }, // Exclude cancelled and rejected leaves
        $or: [
          // Case 1: New leave starts during an existing leave
          {
            startDate: { $lte: startDate },
            endDate: { $gte: startDate }
          },
          // Case 2: New leave ends during an existing leave
          {
            startDate: { $lte: endDate },
            endDate: { $gte: endDate }
          },
          // Case 3: New leave completely contains an existing leave
          {
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
          },
          // Case 4: New leave is completely contained within an existing leave
          {
            startDate: { $lte: startDate },
            endDate: { $gte: endDate }
          }
        ]
      });

      if (overlappingLeaves.length > 0) {
        const existingLeave = overlappingLeaves[0];
        throw new Error(`Leave request already exists for ${employee.firstName} ${employee.lastName} from ${new Date(existingLeave.startDate).toLocaleDateString()} to ${new Date(existingLeave.endDate).toLocaleDateString()}. Cannot create overlapping leave requests.`);
      }

      // Calculate days if not provided
      if (!leaveData.days) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        leaveData.days = daysDiff;
      }

      // Handle half day logic
      if (leaveData.leaveType === "halfday") {
        if (!leaveData.halfDayType || !["first", "second"].includes(leaveData.halfDayType)) {
          throw new Error("Half day type must be 'first' or 'second' for half day leaves");
        }
        leaveData.days = 0.5;
      }

      const leave = new Leave({
        employee: leaveData.employeeId,
        company: leaveData.companyId,
        leaveType: leaveData.leaveType,
        halfDayType: leaveData.halfDayType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        days: leaveData.days,
        reason: leaveData.reason,
      });

      const savedLeave = await leave.save();
      return await savedLeave.populate([
        { path: "employee", select: "firstName lastName employeeId department designation" },
        { path: "approvedBy", select: "name email" },
      ]);
    } catch (error) {
      throw error;
    }
  }

  // Get all leave requests with filtering
  async getLeaveRequests(filters = {}) {
    try {
      const query = {};

      if (filters.companyId) {
        query.company = mongoose.Types.ObjectId.isValid(filters.companyId)
          ? new mongoose.Types.ObjectId(filters.companyId)
          : filters.companyId;
      }

      if (filters.employeeId) {
        query.employee = mongoose.Types.ObjectId.isValid(filters.employeeId)
          ? new mongoose.Types.ObjectId(filters.employeeId)
          : filters.employeeId;
      }

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.leaveType) {
        query.leaveType = filters.leaveType;
      }

      if (filters.startDate && filters.endDate) {
        query.$or = [
          {
            startDate: {
              $gte: new Date(filters.startDate),
              $lte: new Date(filters.endDate),
            },
          },
          {
            endDate: {
              $gte: new Date(filters.startDate),
              $lte: new Date(filters.endDate),
            },
          },
        ];
      }

      const leaves = await Leave.find(query)
        .populate([
          { path: "employee", select: "firstName lastName employeeId department designation" },
          { path: "approvedBy", select: "name email" },
        ])
        .sort({ submittedDate: -1 });

      return leaves;
    } catch (error) {
      throw error;
    }
  }

  // Get leave request by ID
  async getLeaveRequestById(leaveId) {
    try {
      const leave = await Leave.findById(leaveId).populate([
        { path: "employee", select: "firstName lastName employeeId department designation" },
        { path: "approvedBy", select: "name email" },
      ]);
      return leave;
    } catch (error) {
      throw error;
    }
  }

  // Update leave request status
  async updateLeaveStatus(leaveId, statusData, approvedBy) {
    try {
      const updateData = {
        status: statusData.status,
        comments: statusData.comments,
      };

      if (statusData.status === "approved" || statusData.status === "rejected") {
        updateData.approvedBy = approvedBy;
        updateData.approvedDate = new Date();
      }

      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        updateData,
        { new: true }
      ).populate([
        { path: "employee", select: "firstName lastName employeeId department designation" },
        { path: "approvedBy", select: "name email" },
      ]);

      return leave;
    } catch (error) {
      throw error;
    }
  }

  // Update manager action on leave request
  async updateManagerAction(leaveId, managerData, managerId) {
    try {
      const { action, comment } = managerData;
      
      const updateData = {
        managerAction: action,
        managerComment: comment,
        managerActionDate: new Date(),
        reportingManager: managerId,
      };

      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        updateData,
        { new: true }
      ).populate([
        { path: "employee", select: "firstName lastName employeeId department designation" },
        { path: "reportingManager", select: "firstName lastName employeeId department designation" },
      ]);

      if (!leave) {
        throw new Error('Leave request not found');
      }

      return leave;
    } catch (error) {
      throw error;
    }
  }

  // Update leave request
  async updateLeaveRequest(leaveId, updateData) {
    try {
      // Only allow updates for pending requests
      const existingLeave = await Leave.findById(leaveId);
      if (!existingLeave) {
        throw new Error("Leave request not found");
      }

      if (existingLeave.status !== "pending") {
        throw new Error("Can only update pending leave requests");
      }

      // Check for overlapping leave requests if dates are being updated
      if (updateData.startDate || updateData.endDate) {
        const startDate = new Date(updateData.startDate || existingLeave.startDate);
        const endDate = new Date(updateData.endDate || existingLeave.endDate);

        // Find existing leave requests for the same employee that overlap with the updated request
        const overlappingLeaves = await Leave.find({
          employee: existingLeave.employee,
          company: existingLeave.company,
          _id: { $ne: leaveId }, // Exclude the current leave request being updated
          status: { $nin: ['cancelled', 'rejected'] }, // Exclude cancelled and rejected leaves
          $or: [
            // Case 1: Updated leave starts during an existing leave
            {
              startDate: { $lte: startDate },
              endDate: { $gte: startDate }
            },
            // Case 2: Updated leave ends during an existing leave
            {
              startDate: { $lte: endDate },
              endDate: { $gte: endDate }
            },
            // Case 3: Updated leave completely contains an existing leave
            {
              startDate: { $gte: startDate },
              endDate: { $lte: endDate }
            },
            // Case 4: Updated leave is completely contained within an existing leave
            {
              startDate: { $lte: startDate },
              endDate: { $gte: endDate }
            }
          ]
        });

        if (overlappingLeaves.length > 0) {
          const overlappingLeave = overlappingLeaves[0];
          throw new Error(`Leave request already exists for the same employee from ${new Date(overlappingLeave.startDate).toLocaleDateString()} to ${new Date(overlappingLeave.endDate).toLocaleDateString()}. Cannot create overlapping leave requests.`);
        }
      }

      // Handle half day logic
      if (updateData.leaveType === "halfday") {
        if (!updateData.halfDayType || !["first", "second"].includes(updateData.halfDayType)) {
          throw new Error("Half day type must be 'first' or 'second' for half day leaves");
        }
        updateData.days = 0.5;
      }

      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        updateData,
        { new: true }
      ).populate([
        { path: "employee", select: "firstName lastName employeeId department designation" },
        { path: "approvedBy", select: "name email" },
      ]);

      return leave;
    } catch (error) {
      throw error;
    }
  }

  // Delete leave request
  async deleteLeaveRequest(leaveId) {
    try {
      const leave = await Leave.findByIdAndDelete(leaveId);
      return leave;
    } catch (error) {
      throw error;
    }
  }

  // Get leave summary for company
  async getLeaveSummary(companyId, startDate, endDate) {
    try {
      const query = { company: companyId };

      if (startDate && endDate) {
        query.$or = [
          {
            startDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
          {
            endDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        ];
      }

      const leaves = await Leave.find(query);

      const summary = {
        totalRequests: leaves.length,
        pendingRequests: leaves.filter(l => l.status === "pending").length,
        approvedRequests: leaves.filter(l => l.status === "approved").length,
        rejectedRequests: leaves.filter(l => l.status === "rejected").length,
        cancelledRequests: leaves.filter(l => l.status === "cancelled").length,
        totalDays: leaves.reduce((sum, l) => sum + l.days, 0),
        leaveTypeBreakdown: {
          paid: leaves.filter(l => l.leaveType === "paid").length,
          casual: leaves.filter(l => l.leaveType === "casual").length,
          short: leaves.filter(l => l.leaveType === "short").length,
          sick: leaves.filter(l => l.leaveType === "sick").length,
          halfday: leaves.filter(l => l.leaveType === "halfday").length,
        },
      };

      summary.avgDays = summary.totalRequests > 0 ? (summary.totalDays / summary.totalRequests).toFixed(1) : 0;

      return summary;
    } catch (error) {
      throw error;
    }
  }

  // Get employee leave requests
  async getEmployeeLeaveRequests(employeeId, startDate, endDate) {
    try {
      const query = { employee: employeeId };

      if (startDate && endDate) {
        query.$or = [
          {
            startDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
          {
            endDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        ];
      }

      const leaves = await Leave.find(query)
        .populate([
          { path: "employee", select: "firstName lastName employeeId department designation" },
          { path: "approvedBy", select: "name email" },
        ])
        .sort({ submittedDate: -1 });

      return leaves;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LeaveService(); 