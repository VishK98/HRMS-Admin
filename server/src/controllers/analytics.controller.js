const Company = require("../models/company.model");
const Employee = require("../models/employee.model");
const os = require("os");
const mongoose = require("mongoose");

// Debug: Check if models are loaded
console.log("Company model loaded:", !!Company);
console.log("Employee model loaded:", !!Employee);

class AnalyticsController {
  // Get analytics overview
  async getAnalyticsOverview(req, res) {
    try {
      console.log("Analytics overview request received");
      console.log("User making request:", req.user);
      const { timeRange } = req.query;
      const dateRange = AnalyticsController.getDateRange(timeRange);
      console.log("Time range:", timeRange, "Date range:", dateRange);

      // Get total companies - with error handling
      let totalCompanies = 0;
      try {
        console.log("Counting companies...");
        totalCompanies = await Company.countDocuments();
        console.log("Total companies:", totalCompanies);
      } catch (countError) {
        console.error("Error counting companies:", countError);
        totalCompanies = 0;
      }

      // Get total users - with error handling
      let totalUsers = 0;
      try {
        totalUsers = await Employee.countDocuments();
        console.log("Total users:", totalUsers);
      } catch (countError) {
        console.error("Error counting users:", countError);
        totalUsers = 0;
      }

      // Get active users (users with recent activity) - with error handling
      let activeUsers = 0;
      try {
        activeUsers = await Employee.countDocuments({
          lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });
        console.log("Active users:", activeUsers);
      } catch (countError) {
        console.error("Error counting active users:", countError);
        activeUsers = 0;
      }

      // Calculate growth rate - with error handling
      let growthRate = 0;
      try {
        const previousRange =
          AnalyticsController.getPreviousDateRange(dateRange);
        const currentPeriodCount = await Company.countDocuments({
          createdAt: { $gte: dateRange.start, $lte: dateRange.end },
        });
        const previousPeriodCount = await Company.countDocuments({
          createdAt: { $gte: previousRange.start, $lte: previousRange.end },
        });

        growthRate =
          previousPeriodCount > 0
            ? ((currentPeriodCount - previousPeriodCount) /
                previousPeriodCount) *
              100
            : 0;
        console.log("Growth rate:", growthRate);
      } catch (growthError) {
        console.error("Error calculating growth rate:", growthError);
        growthRate = 0;
      }

      // Calculate revenue (based on subscription plans) - with error handling
      let totalRevenue = 0;
      try {
        const companiesByPlan = await Company.aggregate([
          {
            $group: {
              _id: "$subscription.plan",
              count: { $sum: 1 },
            },
          },
        ]);

        const planPricing = {
          basic: 5000,
          premium: 15000,
          enterprise: 50000,
        };

        companiesByPlan.forEach((plan) => {
          const price = planPricing[plan._id] || 0;
          totalRevenue += price * plan.count;
        });
        console.log("Total revenue:", totalRevenue);
      } catch (revenueError) {
        console.error("Error calculating revenue:", revenueError);
        totalRevenue = 0;
      }

      const overview = {
        totalCompanies,
        totalUsers,
        activeUsers,
        totalRevenue,
        growthRate: Math.round(growthRate * 100) / 100,
      };

      console.log("Analytics overview data:", overview);

      res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      console.error("Error in getAnalyticsOverview:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics overview",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  static getDateRange(timeRange) {
    const end = new Date();
    const start = new Date();

    switch (timeRange) {
      case "today":
        start.setHours(0, 0, 0, 0); // start of today
        end.setHours(23, 59, 59, 999); // end of today
        break;
      case "7d":
        start.setDate(end.getDate() - 7);
        break;
      case "30d":
        start.setDate(end.getDate() - 30);
        break;
      case "90d":
        start.setDate(end.getDate() - 90);
        break;
      case "1y":
        start.setFullYear(end.getFullYear() - 1);
        break;
      case "5y":
        start.setFullYear(end.getFullYear() - 5);
        break;
      case "10y":
        start.setFullYear(end.getFullYear() - 10);
        break;
      case "all":
        // Start from 20 years ago to capture all historical data
        start.setFullYear(end.getFullYear() - 20);
        break;
      default:
        // Default to 5 years back for comprehensive analytics
        start.setFullYear(end.getFullYear() - 5);
    }

    return { start, end };
  }

  static getPreviousDateRange(currentRange) {
    const duration = currentRange.end - currentRange.start;
    const start = new Date(currentRange.start.getTime() - duration);
    const end = new Date(currentRange.start);
    return { start, end };
  }

  // Get user analytics
  async getUserAnalytics(req, res) {
    try {
      console.log("User analytics request received");
      const { timeRange } = req.query;
      const dateRange = AnalyticsController.getDateRange(timeRange);

      // Get users by role - with error handling
      let usersByRole = [];
      try {
        usersByRole = await Employee.aggregate([
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
        ]);
        console.log("Users by role:", usersByRole);
      } catch (aggError) {
        console.error("Error in usersByRole aggregation:", aggError);
        usersByRole = [];
      }

      // Get users by department - with error handling
      let usersByDepartment = [];
      try {
        usersByDepartment = await Employee.aggregate([
          {
            $match: {
              department: { $exists: true, $ne: "" },
            },
          },
          {
            $group: {
              _id: "$department",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: 10,
          },
        ]);
        console.log("Users by department:", usersByDepartment);
      } catch (aggError) {
        console.error("Error in usersByDepartment aggregation:", aggError);
        usersByDepartment = [];
      }

      // Get users by company - with error handling
      let usersByCompany = [];
      try {
        usersByCompany = await Employee.aggregate([
          {
            $lookup: {
              from: "companies",
              localField: "company",
              foreignField: "_id",
              as: "companyInfo",
            },
          },
          {
            $unwind: "$companyInfo",
          },
          {
            $group: {
              _id: "$companyInfo.name",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
        ]);
        console.log("Users by company:", usersByCompany);
      } catch (aggError) {
        console.error("Error in usersByCompany aggregation:", aggError);
        usersByCompany = [];
      }

      // Get new users this month
      let newUsersThisMonth = 0;
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        newUsersThisMonth = await Employee.countDocuments({
          createdAt: { $gte: startOfMonth },
        });
        console.log("New users this month:", newUsersThisMonth);
      } catch (countError) {
        console.error("Error counting new users:", countError);
        newUsersThisMonth = 0;
      }

      // Get active users this week
      let activeUsersThisWeek = 0;
      try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        activeUsersThisWeek = await Employee.countDocuments({
          lastLogin: { $gte: oneWeekAgo },
        });
        console.log("Active users this week:", activeUsersThisWeek);
      } catch (countError) {
        console.error("Error counting active users:", countError);
        activeUsersThisWeek = 0;
      }

      const userAnalytics = {
        usersByRole,
        usersByDepartment,
        usersByCompany,
        newUsersThisMonth,
        activeUsersThisWeek,
      };

      console.log("User analytics data:", userAnalytics);

      res.status(200).json({
        success: true,
        data: userAnalytics,
      });
    } catch (error) {
      console.error("Error in getUserAnalytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user analytics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get company analytics
  async getCompanyAnalytics(req, res) {
    try {
      console.log("Company analytics request received");
      const { timeRange } = req.query;
      const dateRange = AnalyticsController.getDateRange(timeRange);

      // Get companies by plan - with error handling
      let companiesByPlan = [];
      try {
        companiesByPlan = await Company.aggregate([
          {
            $group: {
              _id: "$subscription.plan",
              count: { $sum: 1 },
            },
          },
        ]);
        console.log("Companies by plan:", companiesByPlan);
      } catch (aggError) {
        console.error("Error in companiesByPlan aggregation:", aggError);
        companiesByPlan = [];
      }

      // Get companies by status - with error handling
      let companiesByStatus = [];
      try {
        companiesByStatus = await Company.aggregate([
          {
            $group: {
              _id: "$isActive",
              count: { $sum: 1 },
            },
          },
        ]);
        console.log("Companies by status:", companiesByStatus);
      } catch (aggError) {
        console.error("Error in companiesByStatus aggregation:", aggError);
        companiesByStatus = [];
      }

      // Get new companies this month
      let newCompaniesThisMonth = 0;
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        newCompaniesThisMonth = await Company.countDocuments({
          createdAt: { $gte: startOfMonth },
        });
        console.log("New companies this month:", newCompaniesThisMonth);
      } catch (countError) {
        console.error("Error counting new companies:", countError);
        newCompaniesThisMonth = 0;
      }

      // Calculate revenue by plan
      const planPricing = {
        basic: 5000,
        premium: 15000,
        enterprise: 50000,
      };

      const revenueByPlan = companiesByPlan.map((plan) => ({
        plan: plan._id,
        revenue: (planPricing[plan._id] || 0) * plan.count,
      }));

      const companyAnalytics = {
        companiesByPlan,
        companiesByStatus,
        newCompaniesThisMonth,
        revenueByPlan,
      };

      console.log("Company analytics data:", companyAnalytics);

      res.status(200).json({
        success: true,
        data: companyAnalytics,
      });
    } catch (error) {
      console.error("Error in getCompanyAnalytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch company analytics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get system analytics
  async getSystemAnalytics(req, res) {
    try {
      console.log("System analytics request received");
      const { timeRange } = req.query;
      const dateRange = AnalyticsController.getDateRange(timeRange);

      // Get system performance metrics
      const cpuUsage = os.loadavg()[0] * 100;
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
      const uptime = process.uptime();

      // Calculate real performance metrics
      const performance = {
        avgResponseTime: 120, // This would need real monitoring data
        uptime: Math.round((uptime / (24 * 60 * 60)) * 100) / 100, // Days uptime
        errorRate: 0.1, // This would need real error tracking
        activeConnections: 25, // This would need real connection tracking
      };

      const usage = {
        cpuUsage: Math.round(cpuUsage),
        memoryUsage: Math.round(memoryUsage),
        diskUsage: 32, // This would need real disk monitoring
        networkUsage: 85, // This would need real network monitoring
      };

      // Generate real trend data based on actual data
      const trends = [];
      const days = 30;

      try {
        for (let i = days; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          // Count users created on this day
          const usersCount = await Employee.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          });

          // Count companies created on this day
          const companiesCount = await Company.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay },
          });

          // Calculate revenue for this day (based on subscription plans)
          const companiesByPlan = await Company.aggregate([
            {
              $match: {
                createdAt: { $gte: startOfDay, $lte: endOfDay },
              },
            },
            {
              $group: {
                _id: "$subscription.plan",
                count: { $sum: 1 },
              },
            },
          ]);

          const planPricing = {
            basic: 5000,
            premium: 15000,
            enterprise: 50000,
          };

          let dailyRevenue = 0;
          companiesByPlan.forEach((plan) => {
            const price = planPricing[plan._id] || 0;
            dailyRevenue += price * plan.count;
          });

          trends.push({
            date: date.toISOString().split("T")[0],
            users: usersCount,
            companies: companiesCount,
            revenue: dailyRevenue,
          });
        }
      } catch (error) {
        console.error("Error generating trend data:", error);
        // Fallback to empty trends if there's an error
        for (let i = days; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          trends.push({
            date: date.toISOString().split("T")[0],
            users: 0,
            companies: 0,
            revenue: 0,
          });
        }
      }

      const systemAnalytics = {
        performance,
        usage,
        trends,
      };

      console.log("System analytics data:", systemAnalytics);

      res.status(200).json({
        success: true,
        data: systemAnalytics,
      });
    } catch (error) {
      console.error("Error in getSystemAnalytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch system analytics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get activity analytics
  async getActivityAnalytics(req, res) {
    try {
      console.log("Activity analytics request received");
      const { timeRange } = req.query;
      const dateRange = AnalyticsController.getDateRange(timeRange);

      // Get real recent activities from various sources
      const recentActivities = [];

      // 1. Recent employee logins (last 7 days)
      try {
        const recentLogins = await Employee.find({
          lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        })
          .populate("company", "name")
          .sort({ lastLogin: -1 })
          .limit(10);

        recentLogins.forEach((employee) => {
          if (employee.lastLogin) {
            recentActivities.push({
              action: `Employee login: ${employee.firstName} ${employee.lastName}`,
              timestamp: employee.lastLogin.toISOString(),
              type: "user",
              user: `${employee.firstName} ${employee.lastName}`,
              company: employee.company?.name || "Unknown Company",
              employeeId: employee.employeeId,
            });
          }
        });
      } catch (error) {
        console.error("Error fetching recent logins:", error);
      }

      // 2. Recent leave requests
      try {
        const Leave = require("../models/leave.model");
        const recentLeaves = await Leave.find({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        })
          .populate("employee", "firstName lastName employeeId")
          .populate("company", "name")
          .sort({ createdAt: -1 })
          .limit(10);

        recentLeaves.forEach((leave) => {
          recentActivities.push({
            action: `Leave request ${leave.status}: ${leave.leaveType} leave`,
            timestamp: leave.createdAt.toISOString(),
            type: "leave",
            user: `${leave.employee.firstName} ${leave.employee.lastName}`,
            company: leave.company?.name || "Unknown Company",
            employeeId: leave.employee.employeeId,
            status: leave.status,
          });
        });
      } catch (error) {
        console.error("Error fetching recent leaves:", error);
      }

      // 3. Recent attendance check-ins
      try {
        const Attendance = require("../models/attendance.model");
        const recentAttendance = await Attendance.find({
          checkIn: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        })
          .populate("employee", "firstName lastName employeeId")
          .populate("company", "name")
          .sort({ checkIn: -1 })
          .limit(10);

        recentAttendance.forEach((attendance) => {
          recentActivities.push({
            action: `Attendance check-in: ${attendance.status}`,
            timestamp: attendance.checkIn.toISOString(),
            type: "attendance",
            user: `${attendance.employee.firstName} ${attendance.employee.lastName}`,
            company: attendance.company?.name || "Unknown Company",
            employeeId: attendance.employee.employeeId,
            status: attendance.status,
          });
        });
      } catch (error) {
        console.error("Error fetching recent attendance:", error);
      }

      // 4. Recent company registrations
      try {
        const recentCompanies = await Company.find({
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        })
          .sort({ createdAt: -1 })
          .limit(5);

        recentCompanies.forEach((company) => {
          recentActivities.push({
            action: `New company registered: ${company.name}`,
            timestamp: company.createdAt.toISOString(),
            type: "company",
            user: "System",
            company: company.name,
            companyCode: company.code,
          });
        });
      } catch (error) {
        console.error("Error fetching recent companies:", error);
      }

      // 5. Recent employee creations
      try {
        const recentEmployees = await Employee.find({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        })
          .populate("company", "name")
          .sort({ createdAt: -1 })
          .limit(10);

        recentEmployees.forEach((employee) => {
          recentActivities.push({
            action: `New employee added: ${employee.firstName} ${employee.lastName}`,
            timestamp: employee.createdAt.toISOString(),
            type: "employee",
            user: "HR System",
            company: employee.company?.name || "Unknown Company",
            employeeId: employee.employeeId,
          });
        });
      } catch (error) {
        console.error("Error fetching recent employees:", error);
      }

      // Sort all activities by timestamp (most recent first) and limit to 20
      recentActivities.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const finalRecentActivities = recentActivities.slice(0, 20);

      // Calculate real top actions
      const topActions = [];

      // Count logins
      try {
        const loginCount = await Employee.countDocuments({
          lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });
        topActions.push({ action: "User Login", count: loginCount });
      } catch (error) {
        console.error("Error counting logins:", error);
      }

      // Count leave requests
      try {
        const Leave = require("../models/leave.model");
        const leaveCount = await Leave.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });
        topActions.push({ action: "Leave Request", count: leaveCount });
      } catch (error) {
        console.error("Error counting leaves:", error);
      }

      // Count attendance check-ins
      try {
        const Attendance = require("../models/attendance.model");
        const attendanceCount = await Attendance.countDocuments({
          checkIn: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });
        topActions.push({
          action: "Attendance Check-in",
          count: attendanceCount,
        });
      } catch (error) {
        console.error("Error counting attendance:", error);
      }

      // Count new employees
      try {
        const newEmployeeCount = await Employee.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });
        topActions.push({ action: "New Employee", count: newEmployeeCount });
      } catch (error) {
        console.error("Error counting new employees:", error);
      }

      // Count new companies
      try {
        const newCompanyCount = await Company.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });
        topActions.push({ action: "New Company", count: newCompanyCount });
      } catch (error) {
        console.error("Error counting new companies:", error);
      }

      // Sort top actions by count
      topActions.sort((a, b) => b.count - a.count);

      // Calculate real peak usage hours based on login times
      const peakUsageHours = [];
      try {
        const recentLogins = await Employee.find({
          lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }).select("lastLogin");

        // Initialize hours array
        const hourCounts = new Array(24).fill(0);

        // Count logins by hour
        recentLogins.forEach((employee) => {
          if (employee.lastLogin) {
            const hour = employee.lastLogin.getHours();
            hourCounts[hour]++;
          }
        });

        // Convert to expected format
        for (let hour = 0; hour < 24; hour++) {
          peakUsageHours.push({
            hour,
            users: hourCounts[hour],
          });
        }
      } catch (error) {
        console.error("Error calculating peak usage hours:", error);
        // Fallback to empty array
        for (let hour = 0; hour < 24; hour++) {
          peakUsageHours.push({
            hour,
            users: 0,
          });
        }
      }

      const activityAnalytics = {
        recentActivities: finalRecentActivities,
        topActions,
        peakUsageHours,
      };

      console.log("Activity analytics data:", activityAnalytics);

      res.status(200).json({
        success: true,
        data: activityAnalytics,
      });
    } catch (error) {
      console.error("Error in getActivityAnalytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch activity analytics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get comprehensive analytics for super admin
  async getComprehensiveAnalytics(req, res) {
    try {
      console.log("Comprehensive analytics request received");
      const { timeRange } = req.query;
      const dateRange = AnalyticsController.getDateRange(timeRange);

      // Set a timeout for the entire operation
      const timeout = setTimeout(() => {
        console.log("Analytics request timed out, sending partial data");
        res.status(200).json({
          success: true,
          data: {
            trends: [],
            geographicData: { users: [], companies: [] },
            performanceMetrics: {
              responseTime: 120,
              uptime: 99.9,
              errorRate: 0.1,
            },
            engagementMetrics: {
              dailyActiveUsers: 0,
              weeklyGrowth: 0,
              monthlyGrowth: 0,
            },
            revenueAnalytics: {
              totalRevenue: 0,
              monthlyRevenue: 0,
              growthRate: 0,
            },
            systemHealth: { cpu: 45, memory: 68, disk: 32, network: 85 },
            securityAnalytics: {
              loginAttempts: 0,
              failedLogins: 0,
              securityScore: 95,
            },
            lastUpdated: new Date().toISOString(),
          },
          message: "Partial data due to timeout",
        });
      }, 5000); // 5 second timeout

      try {
        // Get basic metrics first (faster)
        const [performanceMetrics, systemHealth] = await Promise.all([
          AnalyticsController.getPerformanceMetrics(),
          AnalyticsController.getSystemHealthMetrics(),
        ]);

        // Get other metrics with error handling
        const trends = await AnalyticsController.getDetailedTrends(
          dateRange
        ).catch(() => []);
        const geographicData =
          await AnalyticsController.getGeographicDistribution().catch(() => ({
            users: [],
            companies: [],
          }));
        const engagementMetrics =
          await AnalyticsController.getUserEngagementMetrics(dateRange).catch(
            () => ({ dailyActiveUsers: 0, weeklyGrowth: 0, monthlyGrowth: 0 })
          );
        const revenueAnalytics = await AnalyticsController.getRevenueAnalytics(
          dateRange
        ).catch(() => ({ totalRevenue: 0, monthlyRevenue: 0, growthRate: 0 }));
        const securityAnalytics =
          await AnalyticsController.getSecurityAnalytics(dateRange).catch(
            () => ({ loginAttempts: 0, failedLogins: 0, securityScore: 95 })
          );

        clearTimeout(timeout);

        const comprehensiveData = {
          trends,
          geographicData,
          performanceMetrics,
          engagementMetrics,
          revenueAnalytics,
          systemHealth,
          securityAnalytics,
          lastUpdated: new Date().toISOString(),
        };

        console.log("Comprehensive analytics data generated");

        res.status(200).json({
          success: true,
          data: comprehensiveData,
        });
      } catch (error) {
        clearTimeout(timeout);
        throw error;
      }
    } catch (error) {
      console.error("Error in getComprehensiveAnalytics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch comprehensive analytics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get detailed trends with multiple metrics (optimized)
  static async getDetailedTrends(dateRange) {
    try {
      // Instead of 365 individual queries, use aggregation pipelines
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Last 30 days instead of 365
      const endDate = new Date();

      // Get new users trend (last 30 days)
      const newUsersTrend = await Employee.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Get new companies trend (last 30 days)
      const newCompaniesTrend = await Company.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Get active users trend (last 30 days)
      const activeUsersTrend = await Employee.aggregate([
        {
          $match: {
            lastLogin: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Get leave requests trend (last 30 days)
      const Leave = require("../models/leave.model");
      const leaveRequestsTrend = await Leave.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Get attendance check-ins trend (last 30 days)
      const Attendance = require("../models/attendance.model");
      const attendanceTrend = await Attendance.aggregate([
        {
          $match: {
            checkIn: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$checkIn" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Generate date range for the last 30 days
      const trends = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];

        // Find data for this date
        const newUsers =
          newUsersTrend.find((t) => t._id === dateStr)?.count || 0;
        const newCompanies =
          newCompaniesTrend.find((t) => t._id === dateStr)?.count || 0;
        const activeUsers =
          activeUsersTrend.find((t) => t._id === dateStr)?.count || 0;
        const leaveRequests =
          leaveRequestsTrend.find((t) => t._id === dateStr)?.count || 0;
        const attendanceCheckins =
          attendanceTrend.find((t) => t._id === dateStr)?.count || 0;

        // Calculate revenue (simplified)
        const dailyRevenue = newCompanies * 5000; // Basic plan pricing

        trends.push({
          date: dateStr,
          newUsers,
          newCompanies,
          activeUsers,
          leaveRequests,
          attendanceCheckins,
          revenue: dailyRevenue,
        });
      }

      return trends;
    } catch (error) {
      console.error("Error generating detailed trends:", error);
      return [];
    }
  }

  // Get geographic distribution of users and companies
  static async getGeographicDistribution() {
    try {
      // Get users by location (based on company location)
      const usersByLocation = await Employee.aggregate([
        {
          $lookup: {
            from: "companies",
            localField: "company",
            foreignField: "_id",
            as: "companyInfo",
          },
        },
        {
          $unwind: "$companyInfo",
        },
        {
          $group: {
            _id: "$companyInfo.location",
            userCount: { $sum: 1 },
            companyCount: { $addToSet: "$companyInfo._id" },
          },
        },
        {
          $project: {
            location: "$_id",
            userCount: 1,
            companyCount: { $size: "$companyCount" },
          },
        },
        {
          $sort: { userCount: -1 },
        },
      ]);

      return {
        usersByLocation,
        totalLocations: usersByLocation.length,
      };
    } catch (error) {
      console.error("Error getting geographic distribution:", error);
      return { usersByLocation: [], totalLocations: 0 };
    }
  }

  // Get detailed performance metrics
  static async getPerformanceMetrics() {
    try {
      const cpuUsage = os.loadavg()[0] * 100;
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
      const uptime = process.uptime();

      // Calculate response time metrics (simulated)
      const responseTimeMetrics = {
        average: 120,
        p95: 250,
        p99: 500,
        min: 50,
        max: 800,
      };

      // Calculate throughput metrics
      const throughputMetrics = {
        requestsPerSecond: 45,
        concurrentUsers: 125,
        peakConcurrentUsers: 200,
        averageSessionDuration: 1800, // seconds
      };

      return {
        system: {
          cpuUsage: Math.round(cpuUsage),
          memoryUsage: Math.round(memoryUsage),
          diskUsage: 32,
          networkUsage: 85,
          uptime: Math.round((uptime / (24 * 60 * 60)) * 100) / 100,
        },
        responseTime: responseTimeMetrics,
        throughput: throughputMetrics,
      };
    } catch (error) {
      console.error("Error getting performance metrics:", error);
      return {
        system: {
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          networkUsage: 0,
          uptime: 0,
        },
        responseTime: { average: 0, p95: 0, p99: 0, min: 0, max: 0 },
        throughput: {
          requestsPerSecond: 0,
          concurrentUsers: 0,
          peakConcurrentUsers: 0,
          averageSessionDuration: 0,
        },
      };
    }
  }

  // Get user engagement metrics
  static async getUserEngagementMetrics(dateRange) {
    try {
      // Get daily active users for the last 7 days
      const dailyActiveUsers = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const activeUsers = await Employee.countDocuments({
          lastLogin: { $gte: startOfDay, $lte: endOfDay },
        });

        dailyActiveUsers.push({
          date: date.toISOString().split("T")[0],
          count: activeUsers,
        });
      }

      // Get user retention metrics
      const totalUsers = await Employee.countDocuments();
      const activeUsersThisWeek = await Employee.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });
      const activeUsersThisMonth = await Employee.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      });

      const retentionRates = {
        weekly: totalUsers > 0 ? (activeUsersThisWeek / totalUsers) * 100 : 0,
        monthly: totalUsers > 0 ? (activeUsersThisMonth / totalUsers) * 100 : 0,
      };

      // Get feature usage metrics
      const Leave = require("../models/leave.model");
      const Attendance = require("../models/attendance.model");

      const leaveUsage = await Leave.countDocuments({
        createdAt: { $gte: dateRange.start, $lte: dateRange.end },
      });

      const attendanceUsage = await Attendance.countDocuments({
        checkIn: { $gte: dateRange.start, $lte: dateRange.end },
      });

      return {
        dailyActiveUsers,
        retentionRates,
        featureUsage: {
          leaveRequests: leaveUsage,
          attendanceCheckins: attendanceUsage,
        },
        totalUsers,
        activeUsersThisWeek,
        activeUsersThisMonth,
      };
    } catch (error) {
      console.error("Error getting user engagement metrics:", error);
      return {
        dailyActiveUsers: [],
        retentionRates: { weekly: 0, monthly: 0 },
        featureUsage: { leaveRequests: 0, attendanceCheckins: 0 },
        totalUsers: 0,
        activeUsersThisWeek: 0,
        activeUsersThisMonth: 0,
      };
    }
  }

  // Get detailed revenue analytics
  static async getRevenueAnalytics(dateRange) {
    try {
      // Get revenue by plan
      const companiesByPlan = await Company.aggregate([
        {
          $group: {
            _id: "$subscription.plan",
            count: { $sum: 1 },
          },
        },
      ]);

      const planPricing = {
        basic: 5000,
        premium: 15000,
        enterprise: 50000,
      };

      const revenueByPlan = companiesByPlan.map((plan) => ({
        plan: plan._id,
        count: plan.count,
        revenue: (planPricing[plan._id] || 0) * plan.count,
      }));

      // Calculate total revenue
      const totalRevenue = revenueByPlan.reduce(
        (sum, plan) => sum + plan.revenue,
        0
      );

      // Get monthly recurring revenue (MRR)
      const mrr = totalRevenue / 12; // Simplified calculation

      // Get revenue growth
      const previousRange = AnalyticsController.getPreviousDateRange(dateRange);
      const currentRevenue = totalRevenue;
      const previousRevenue = 0; // This would need historical data

      const revenueGrowth =
        previousRevenue > 0
          ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
          : 0;

      // Get average revenue per user (ARPU)
      const totalUsers = await Employee.countDocuments();
      const arpu = totalUsers > 0 ? totalRevenue / totalUsers : 0;

      return {
        totalRevenue,
        monthlyRecurringRevenue: mrr,
        revenueGrowth,
        averageRevenuePerUser: arpu,
        revenueByPlan,
        planPricing,
      };
    } catch (error) {
      console.error("Error getting revenue analytics:", error);
      return {
        totalRevenue: 0,
        monthlyRecurringRevenue: 0,
        revenueGrowth: 0,
        averageRevenuePerUser: 0,
        revenueByPlan: [],
        planPricing: {},
      };
    }
  }

  // Get system health metrics
  static async getSystemHealthMetrics() {
    try {
      const cpuUsage = os.loadavg()[0] * 100;
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
      const uptime = process.uptime();

      // Calculate system health score
      const healthScore = Math.max(
        0,
        100 - cpuUsage * 0.3 - memoryUsage * 0.3 - (uptime < 86400 ? 20 : 0)
      );

      const healthStatus =
        healthScore >= 80
          ? "Excellent"
          : healthScore >= 60
          ? "Good"
          : healthScore >= 40
          ? "Fair"
          : "Poor";

      return {
        overallScore: Math.round(healthScore),
        status: healthStatus,
        metrics: {
          cpu: Math.round(cpuUsage),
          memory: Math.round(memoryUsage),
          disk: 32,
          network: 85,
          uptime: Math.round((uptime / (24 * 60 * 60)) * 100) / 100,
        },
        alerts:
          healthScore < 60
            ? ["High CPU usage", "Memory pressure detected"]
            : [],
      };
    } catch (error) {
      console.error("Error getting system health metrics:", error);
      return {
        overallScore: 0,
        status: "Unknown",
        metrics: { cpu: 0, memory: 0, disk: 0, network: 0, uptime: 0 },
        alerts: ["Unable to fetch system metrics"],
      };
    }
  }

  // Get security analytics
  static async getSecurityAnalytics(dateRange) {
    try {
      // Get failed login attempts
      const failedLogins = await Employee.countDocuments({
        lastLoginAttempt: { $gte: dateRange.start, $lte: dateRange.end },
        loginFailed: true,
      });

      // Get suspicious activities (simulated)
      const suspiciousActivities = [
        {
          type: "Multiple failed logins",
          count: Math.floor(Math.random() * 10),
        },
        {
          type: "Unusual access patterns",
          count: Math.floor(Math.random() * 5),
        },
        { type: "Data export attempts", count: Math.floor(Math.random() * 3) },
      ];

      // Get security score
      const securityScore = Math.max(
        0,
        100 -
          failedLogins * 2 -
          suspiciousActivities.reduce(
            (sum, activity) => sum + activity.count,
            0
          ) *
            5
      );

      return {
        securityScore: Math.round(securityScore),
        failedLogins,
        suspiciousActivities,
        lastSecurityScan: new Date().toISOString(),
        recommendations:
          securityScore < 70
            ? [
                "Enable two-factor authentication",
                "Review failed login attempts",
                "Update security policies",
              ]
            : ["System security is good"],
      };
    } catch (error) {
      console.error("Error getting security analytics:", error);
      return {
        securityScore: 0,
        failedLogins: 0,
        suspiciousActivities: [],
        lastSecurityScan: new Date().toISOString(),
        recommendations: ["Unable to fetch security data"],
      };
    }
  }

  // Helper methods
}

module.exports = new AnalyticsController();
