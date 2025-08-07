const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "company",
        "employee",
        "attendance",
        "leave",
        "system",
        "security",
        "user",
        "task",
      ],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for system activities
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: false, // Optional for non-employee activities
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false, // Optional for system-wide activities
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["success", "error", "warning", "info"],
      default: "success",
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
activitySchema.index({ createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ companyId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ employeeId: 1, createdAt: -1 });

// Static method to log activity
activitySchema.statics.logActivity = async function (activityData) {
  try {
    const activity = new this(activityData);
    await activity.save();
    return activity;
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

// Static method to get activities with filters
activitySchema.statics.getActivities = async function (filters = {}) {
  try {
    const {
      companyId,
      userId,
      employeeId,
      type,
      startDate,
      endDate,
      limit = 20,
      skip = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const query = {};

    // Apply filters
    if (companyId) query.companyId = companyId;
    if (userId) query.userId = userId;
    if (employeeId) query.employeeId = employeeId;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const activities = await this.find(query)
      .populate("userId", "firstName lastName email")
      .populate("employeeId", "firstName lastName employeeId")
      .populate("companyId", "name code")
      .sort(sort)
      .limit(limit)
      .skip(skip);

    return activities;
  } catch (error) {
    console.error("Error getting activities:", error);
    throw error;
  }
};

// Static method to get activity statistics
activitySchema.statics.getActivityStats = async function (filters = {}) {
  try {
    const { companyId, startDate, endDate, type } = filters;

    const matchStage = {};

    if (companyId) matchStage.companyId = companyId;
    if (type) matchStage.type = type;

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const stats = await this.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          lastActivity: { $max: "$createdAt" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return stats;
  } catch (error) {
    console.error("Error getting activity stats:", error);
    throw error;
  }
};

module.exports = mongoose.model("Activity", activitySchema);
