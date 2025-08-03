const mongoose = require("mongoose");

const designationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    department: {
      type: String,
      trim: true,
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
designationSchema.index({ companyId: 1, isActive: 1 });
designationSchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("Designation", designationSchema);
