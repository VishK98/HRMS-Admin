const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["public", "company", "optional"],
      default: "company",
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
holidaySchema.index({ companyId: 1, isActive: 1 });
holidaySchema.index({ date: 1, companyId: 1 });
holidaySchema.index({ type: 1, companyId: 1 });

module.exports = mongoose.model("Holiday", holidaySchema); 