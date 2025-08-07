const activityService = require("../services/activity.service");

class ActivityController {
  // Get activities for super admin (all activities across companies)
  async getSuperAdminActivities(req, res) {
    try {
      const { timeRange, type, limit, skip } = req.query;

      const filters = {
        timeRange: timeRange || "7d",
        type,
        limit: limit ? parseInt(limit) : 20,
        skip: skip ? parseInt(skip) : 0,
      };

      const activities = await activityService.getSuperAdminActivities(filters);

      res.status(200).json({
        success: true,
        data: {
          recentActivities: activities,
        },
      });
    } catch (error) {
      console.error("Error in getSuperAdminActivities:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch super admin activities",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get activities for admin (company-specific activities)
  async getAdminActivities(req, res) {
    try {
      const { timeRange, type, limit, skip } = req.query;
      const companyId =
        req.user.company?._id || req.user.companyId || req.user.company;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "Company ID not found in user context",
        });
      }

      const filters = {
        timeRange: timeRange || "7d",
        type,
        limit: limit ? parseInt(limit) : 20,
        skip: skip ? parseInt(skip) : 0,
      };

      const activities = await activityService.getAdminActivities(
        companyId,
        filters
      );

      res.status(200).json({
        success: true,
        data: {
          recentActivities: activities,
        },
      });
    } catch (error) {
      console.error("Error in getAdminActivities:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch admin activities",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get activity statistics
  async getActivityStats(req, res) {
    try {
      const { timeRange, type } = req.query;
      const companyId =
        req.user.role === "super_admin"
          ? req.query.companyId
          : req.user.company?._id || req.user.companyId || req.user.company;

      const filters = {
        timeRange: timeRange || "7d",
        type,
      };

      if (companyId && req.user.role !== "super_admin") {
        filters.companyId = companyId;
      }

      const stats = await activityService.getActivityStats(filters);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getActivityStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch activity statistics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Log an activity (for internal use)
  async logActivity(req, res) {
    try {
      const activityData = req.body;

      const activity = await activityService.logActivity(activityData);

      res.status(201).json({
        success: true,
        data: activity,
        message: "Activity logged successfully",
      });
    } catch (error) {
      console.error("Error in logActivity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to log activity",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new ActivityController();
