const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
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
    manager: {
      type: String,
      trim: true,
    },
    subCategories: [
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
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
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
departmentSchema.index({ companyId: 1, isActive: 1 });
departmentSchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("Department", departmentSchema);
