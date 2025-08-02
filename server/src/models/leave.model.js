const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["paid", "casual", "short", "sick", "halfday"],
      required: true,
    },
    halfDayType: {
      type: String,
      enum: ["first", "second", null],
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 0.5,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
              approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          approvedDate: {
            type: Date,
          },
          comments: {
            type: String,
            trim: true,
          },
          // Manager approval fields
          reportingManager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
          },
          managerAction: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
          },
          managerActionDate: {
            type: Date,
          },
          managerComment: {
            type: String,
            trim: true,
          },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
leaveSchema.index({ company: 1, employee: 1, startDate: 1, endDate: 1 });
leaveSchema.index({ company: 1, status: 1 });
leaveSchema.index({ employee: 1, status: 1 });

module.exports = mongoose.model("Leave", leaveSchema); 