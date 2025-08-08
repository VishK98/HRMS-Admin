const express = require("express");
const router = express.Router();
const {
  authenticate,
  requireAdmin,
} = require("../middlewares/auth.middleware");
const Employee = require("../models/employee.model");
const Attendance = require("../models/attendance.model");
const Leave = require("../models/leave.model");
const Company = require("../models/company.model");

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(requireAdmin);

// Get employees by company for admin dashboard
router.get("/employees/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 10, status, department, designation } = req.query;

    // Build filter object
    const filter = { company: companyId };
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (designation) filter.designation = designation;

    const employees = await Employee.find(filter)
      .select(
        "firstName lastName employeeId email phone department designation status joiningDate"
      )
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Employee.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
});

// Get attendance summary for admin dashboard
router.get("/attendance/summary", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const companyId =
      req.user.company?._id || req.user.companyId || req.user.company;

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

    // Get attendance data for the date range
    const attendanceData = await Attendance.aggregate([
      {
        $match: {
          company: companyId,
          checkIn: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$checkIn" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Process the data
    const summary = {
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      totalEmployees: 0,
      attendanceRate: 0,
    };

    // Get total employees for the company
    const totalEmployees = await Employee.countDocuments({
      company: companyId,
      status: "active",
    });
    summary.totalEmployees = totalEmployees;

    // Calculate attendance counts
    attendanceData.forEach((item) => {
      if (item._id.status === "present") {
        summary.presentCount += item.count;
      } else if (item._id.status === "absent") {
        summary.absentCount += item.count;
      } else if (item._id.status === "late") {
        summary.lateCount += item.count;
      }
    });

    // Calculate attendance rate
    if (totalEmployees > 0) {
      summary.attendanceRate = (summary.presentCount / totalEmployees) * 100;
    }

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance summary",
    });
  }
});

// Get leave requests for admin dashboard
router.get("/leave/requests", async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const companyId =
      req.user.company?._id || req.user.companyId || req.user.company;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID not found in user context",
      });
    }

    // Build filter object
    const filter = { company: companyId };
    if (status) filter.status = status;

    const leaveRequests = await Leave.find(filter)
      .populate("employee", "firstName lastName employeeId")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Leave.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: leaveRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave requests",
    });
  }
});

// Get activity analytics for admin dashboard
router.get("/analytics/activities", async (req, res) => {
  try {
    const { timeRange = "7d" } = req.query;
    const companyId =
      req.user.company?._id || req.user.companyId || req.user.company;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID not found in user context",
      });
    }

    // Calculate date range based on timeRange
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const recentActivities = [];

    // 1. Recent employee registrations for this company
    try {
      const recentEmployees = await Employee.find({
        company: companyId,
        createdAt: { $gte: startDate },
      })
        .populate("company", "name code")
        .sort({ createdAt: -1 })
        .limit(5);

      recentEmployees.forEach((employee) => {
        recentActivities.push({
          action: `New employee registered: ${employee.firstName} ${employee.lastName}`,
          timestamp: employee.createdAt.toISOString(),
          type: "employee",
          user: "HR System",
          company: employee.company?.name || "Unknown Company",
          employeeId: employee.employeeId,
          companyCode: employee.company?.code,
        });
      });
    } catch (error) {
      console.error("Error fetching recent employees:", error);
    }

    // 2. Recent employee logins for this company
    try {
      const recentLogins = await Employee.find({
        company: companyId,
        lastLogin: { $gte: startDate },
      })
        .populate("company", "name code")
        .sort({ lastLogin: -1 })
        .limit(5);

      recentLogins.forEach((employee) => {
        if (employee.lastLogin) {
          recentActivities.push({
            action: `Employee login: ${employee.firstName} ${employee.lastName}`,
            timestamp: employee.lastLogin.toISOString(),
            type: "user",
            user: `${employee.firstName} ${employee.lastName}`,
            company: employee.company?.name || "Unknown Company",
            employeeId: employee.employeeId,
            companyCode: employee.company?.code,
          });
        }
      });
    } catch (error) {
      console.error("Error fetching recent logins:", error);
    }

    // 3. Recent leave requests for this company
    try {
      const recentLeaves = await Leave.find({
        company: companyId,
        createdAt: { $gte: startDate },
      })
        .populate("employee", "firstName lastName employeeId")
        .populate("company", "name code")
        .sort({ createdAt: -1 })
        .limit(5);

      recentLeaves.forEach((leave) => {
        const action =
          leave.status === "pending"
            ? `${leave.employee.firstName} ${leave.employee.lastName} applied for ${leave.leaveType} leave`
            : `${leave.employee.firstName} ${leave.employee.lastName}'s ${leave.leaveType} leave was ${leave.status}`;

        recentActivities.push({
          action,
          timestamp: leave.createdAt.toISOString(),
          type: "leave",
          user: `${leave.employee.firstName} ${leave.employee.lastName}`,
          company: leave.company?.name || "Unknown Company",
          employeeId: leave.employee.employeeId,
          companyCode: leave.company?.code,
          status: leave.status,
        });
      });
    } catch (error) {
      console.error("Error fetching recent leaves:", error);
    }

    // 4. Recent attendance check-ins for this company
    try {
      const recentAttendance = await Attendance.find({
        company: companyId,
        checkIn: { $gte: startDate },
      })
        .populate("employee", "firstName lastName employeeId")
        .populate("company", "name code")
        .sort({ checkIn: -1 })
        .limit(5);

      recentAttendance.forEach((attendance) => {
        const action =
          attendance.status === "present"
            ? `${attendance.employee.firstName} ${attendance.employee.lastName} checked in`
            : `${attendance.employee.firstName} ${attendance.employee.lastName} checked in (${attendance.status})`;

        recentActivities.push({
          action,
          timestamp: attendance.checkIn.toISOString(),
          type: "attendance",
          user: `${attendance.employee.firstName} ${attendance.employee.lastName}`,
          company: attendance.company?.name || "Unknown Company",
          employeeId: attendance.employee.employeeId,
          companyCode: attendance.company?.code,
          status: attendance.status,
        });
      });
    } catch (error) {
      console.error("Error fetching recent attendance:", error);
    }

    // 5. Recent employee profile updates for this company
    try {
      const recentProfileUpdates = await Employee.find({
        company: companyId,
        updatedAt: { $gte: startDate },
        updatedAt: { $ne: "$createdAt" }, // Exclude initial creation
      })
        .populate("company", "name code")
        .sort({ updatedAt: -1 })
        .limit(3);

      recentProfileUpdates.forEach((employee) => {
        if (
          employee.updatedAt &&
          employee.updatedAt.getTime() !== employee.createdAt.getTime()
        ) {
          recentActivities.push({
            action: `Employee profile updated: ${employee.firstName} ${employee.lastName}`,
            timestamp: employee.updatedAt.toISOString(),
            type: "employee",
            user: "HR System",
            company: employee.company?.name || "Unknown Company",
            employeeId: employee.employeeId,
            companyCode: employee.company?.code,
          });
        }
      });
    } catch (error) {
      console.error("Error fetching recent profile updates:", error);
    }

    // 6. Recent document uploads for this company (if available)
    try {
      const employeesWithDocuments = await Employee.find({
        company: companyId,
        "documents.aadhar": { $exists: true, $ne: null },
        updatedAt: { $gte: startDate },
      })
        .populate("company", "name code")
        .sort({ updatedAt: -1 })
        .limit(3);

      employeesWithDocuments.forEach((employee) => {
        recentActivities.push({
          action: `Documents uploaded for: ${employee.firstName} ${employee.lastName}`,
          timestamp: employee.updatedAt.toISOString(),
          type: "document",
          user: "HR System",
          company: employee.company?.name || "Unknown Company",
          employeeId: employee.employeeId,
          companyCode: employee.company?.code,
        });
      });
    } catch (error) {
      console.error("Error fetching recent document uploads:", error);
    }

    // Sort all activities by timestamp (most recent first)
    recentActivities.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Get activity statistics for this company
    const activityStats = {
      newEmployees: await Employee.countDocuments({
        company: companyId,
        createdAt: { $gte: startDate },
      }),
      employeeLogins: await Employee.countDocuments({
        company: companyId,
        lastLogin: { $gte: startDate },
      }),
      leaveRequests: await Leave.countDocuments({
        company: companyId,
        createdAt: { $gte: startDate },
      }),
      attendanceCheckins: await Attendance.countDocuments({
        company: companyId,
        checkIn: { $gte: startDate },
      }),
    };

    res.status(200).json({
      success: true,
      data: {
        recentActivities: recentActivities.slice(0, 15),
        activityStats,
        timeRange,
        companyId,
      },
    });
  } catch (error) {
    console.error("Error fetching activity analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity analytics",
    });
  }
});

// Get company statistics for admin dashboard
router.get("/company/stats", async (req, res) => {
  try {
    const companyId =
      req.user.company?._id || req.user.companyId || req.user.company;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID not found in user context",
      });
    }

    // Get employee statistics
    const totalEmployees = await Employee.countDocuments({
      company: companyId,
      status: "active",
    });

    const activeEmployees = await Employee.countDocuments({
      company: companyId,
      status: "active",
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.countDocuments({
      company: companyId,
      checkIn: { $gte: today, $lt: tomorrow },
      status: "present",
    });

    // Get pending leave requests
    const pendingLeaves = await Leave.countDocuments({
      company: companyId,
      status: "pending",
    });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        todayAttendance,
        pendingLeaves,
        attendanceRate:
          totalEmployees > 0 ? (todayAttendance / totalEmployees) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching company stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company statistics",
    });
  }
});

// Get today's leave status for admin dashboard
router.get("/leave/status/today", async (req, res) => {
  try {
    const companyId =
      req.user.company?._id || req.user.companyId || req.user.company;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID not found in user context",
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get total employees
    const totalEmployees = await Employee.countDocuments({
      company: companyId,
      status: "active",
    });

    // Get leave status counts for today
    const onLeaveCount = await Leave.countDocuments({
      company: companyId,
      startDate: { $gte: today, $lt: tomorrow },
      status: "approved",
      leaveType: { $nin: ["half_day", "short_leave"] },
    });

    const halfDayCount = await Leave.countDocuments({
      company: companyId,
      startDate: { $gte: today, $lt: tomorrow },
      status: "approved",
      leaveType: "half_day",
    });

    const shortLeaveCount = await Leave.countDocuments({
      company: companyId,
      startDate: { $gte: today, $lt: tomorrow },
      status: "approved",
      leaveType: "short_leave",
    });

    const totalLeaveCount = onLeaveCount + halfDayCount + shortLeaveCount;
    const leaveRate =
      totalEmployees > 0 ? (totalLeaveCount / totalEmployees) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        onLeaveCount,
        halfDayCount,
        shortLeaveCount,
        totalLeaveCount,
        leaveRate,
      },
    });
  } catch (error) {
    console.error("Error fetching leave status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leave status",
    });
  }
});

module.exports = router;
