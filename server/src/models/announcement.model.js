const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["general", "important", "urgent", "info"],
      default: "general",
    },
    targetAudience: {
      type: String,
      enum: ["all", "department", "designation", "specific"],
      default: "all",
    },
    targetIds: [{
      type: String,
      trim: true,
    }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
announcementSchema.index({ companyId: 1, isActive: 1 });
announcementSchema.index({ startDate: 1, endDate: 1, companyId: 1 });
announcementSchema.index({ type: 1, companyId: 1 });
announcementSchema.index({ targetAudience: 1, companyId: 1 });

module.exports = mongoose.model("Announcement", announcementSchema); 