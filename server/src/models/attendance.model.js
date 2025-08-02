const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half_day"],
      default: "present",
    },
    workingHours: {
      type: Number, // in hours
      default: 0,
    },
    overtime: {
      type: Number, // in hours
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
attendanceSchema.index({ employee: 1, date: 1 });
attendanceSchema.index({ company: 1, date: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
