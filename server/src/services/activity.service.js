const Activity = require("../models/activity.model");

class ActivityService {
  // Log an activity
  async logActivity(activityData) {
    try {
      return await Activity.logActivity(activityData);
    } catch (error) {
      console.error("Error in activity service - logActivity:", error);
      throw error;
    }
  }

  // Get activities for super admin (all activities across companies)
  async getSuperAdminActivities(filters = {}) {
    try {
      const { timeRange = "7d", type, limit = 20, skip = 0 } = filters;

      // Calculate date range
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

      const queryFilters = {
        startDate,
        endDate: now,
        limit,
        skip,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (type) queryFilters.type = type;

      const activities = await Activity.getActivities(queryFilters);

      // Transform activities to match expected format
      const transformedActivities = activities.map((activity) => ({
        action: activity.action,
        time: activity.createdAt.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: activity.type,
        user: activity.userId
          ? `${activity.userId.firstName} ${activity.userId.lastName}`
          : activity.employeeId
          ? `${activity.employeeId.firstName} ${activity.employeeId.lastName}`
          : "System",
        company: activity.companyId ? activity.companyId.name : "System",
        employeeId: activity.employeeId ? activity.employeeId.employeeId : null,
        status: activity.status,
        severity: activity.severity,
      }));

      return transformedActivities;
    } catch (error) {
      console.error(
        "Error in activity service - getSuperAdminActivities:",
        error
      );
      throw error;
    }
  }

  // Get activities for admin (company-specific activities)
  async getAdminActivities(companyId, filters = {}) {
    try {
      const { timeRange = "7d", type, limit = 20, skip = 0 } = filters;

      // Calculate date range
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

      const queryFilters = {
        companyId,
        startDate,
        endDate: now,
        limit,
        skip,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (type) queryFilters.type = type;

      const activities = await Activity.getActivities(queryFilters);

      // Transform activities to match expected format
      const transformedActivities = activities.map((activity) => ({
        action: activity.action,
        time: activity.createdAt.toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: activity.type,
        user: activity.userId
          ? `${activity.userId.firstName} ${activity.userId.lastName}`
          : activity.employeeId
          ? `${activity.employeeId.firstName} ${activity.employeeId.lastName}`
          : "System",
        employeeId: activity.employeeId ? activity.employeeId.employeeId : null,
        status: activity.status,
        severity: activity.severity,
      }));

      return transformedActivities;
    } catch (error) {
      console.error("Error in activity service - getAdminActivities:", error);
      throw error;
    }
  }

  // Get activity statistics
  async getActivityStats(filters = {}) {
    try {
      return await Activity.getActivityStats(filters);
    } catch (error) {
      console.error("Error in activity service - getActivityStats:", error);
      throw error;
    }
  }

  // Log employee-related activities
  async logEmployeeActivity(
    action,
    employeeId,
    companyId,
    userId = null,
    metadata = {}
  ) {
    try {
      return await this.logActivity({
        action,
        type: "employee",
        employeeId,
        companyId,
        userId,
        metadata,
      });
    } catch (error) {
      console.error("Error logging employee activity:", error);
      throw error;
    }
  }

  // Log attendance-related activities
  async logAttendanceActivity(
    action,
    employeeId,
    companyId,
    userId = null,
    metadata = {}
  ) {
    try {
      return await this.logActivity({
        action,
        type: "attendance",
        employeeId,
        companyId,
        userId,
        metadata,
      });
    } catch (error) {
      console.error("Error logging attendance activity:", error);
      throw error;
    }
  }

  // Log leave-related activities
  async logLeaveActivity(
    action,
    employeeId,
    companyId,
    userId = null,
    metadata = {}
  ) {
    try {
      return await this.logActivity({
        action,
        type: "leave",
        employeeId,
        companyId,
        userId,
        metadata,
      });
    } catch (error) {
      console.error("Error logging leave activity:", error);
      throw error;
    }
  }

  // Log company-related activities
  async logCompanyActivity(action, companyId, userId = null, metadata = {}) {
    try {
      return await this.logActivity({
        action,
        type: "company",
        companyId,
        userId,
        metadata,
      });
    } catch (error) {
      console.error("Error logging company activity:", error);
      throw error;
    }
  }

  // Log system activities
  async logSystemActivity(action, metadata = {}) {
    try {
      return await this.logActivity({
        action,
        type: "system",
        metadata,
      });
    } catch (error) {
      console.error("Error logging system activity:", error);
      throw error;
    }
  }

  // Log user activities
  async logUserActivity(action, userId, companyId = null, metadata = {}) {
    try {
      return await this.logActivity({
        action,
        type: "user",
        userId,
        companyId,
        metadata,
      });
    } catch (error) {
      console.error("Error logging user activity:", error);
      throw error;
    }
  }
}

module.exports = new ActivityService();
