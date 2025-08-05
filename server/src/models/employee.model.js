const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema(
  {
    // Basic registration fields (filled by employee)
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },

    // Admin-filled fields (updated later by admin)
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    department: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    reportingTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    joiningDate: {
      type: Date,
    },
    salary: {
      basic: {
        type: Number,
        min: [0, "Basic salary cannot be negative"],
      },
      hra: {
        type: Number,
        min: [0, "HRA cannot be negative"],
      },
      da: {
        type: Number,
        min: [0, "DA cannot be negative"],
      },
      allowances: {
        type: Number,
        min: [0, "Allowances cannot be negative"],
      },
    },
    bankDetails: {
      accountNumber: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
      },
      branch: {
        type: String,
        trim: true,
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: "India",
      },
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    documents: {
      aadhar: {
        type: String,
        trim: true,
      },
      pan: {
        type: String,
        trim: true,
      },
      passport: {
        type: String,
        trim: true,
      },
      drivingLicense: {
        type: String,
        trim: true,
      },
      voterId: {
        type: String,
        trim: true,
      },
      relievingLetter: {
        type: String,
        trim: true,
      },
      experienceLetter: {
        type: String,
        trim: true,
      },
      lastPayslip: {
        type: String,
        trim: true,
      },
      passportPhoto: {
        type: String,
        trim: true,
      },
      offerLetter: {
        type: String,
        trim: true,
      },
    },
    education: {
      highestQualification: {
        type: String,
        trim: true,
      },
      institution: {
        type: String,
        trim: true,
      },
      yearOfCompletion: {
        type: String,
        trim: true,
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    skills: {
      technical: {
        type: String,
        trim: true,
      },
      soft: {
        type: String,
        trim: true,
      },
      languages: {
        type: String,
        trim: true,
      },
    },
    performance: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      lastReview: {
        type: Date,
      },
      achievements: {
        type: String,
        trim: true,
      },
      goals: {
        type: String,
        trim: true,
      },
      reviewDate: {
        type: Date,
      },
    },
    leaveBalance: {
      paid: {
        type: Number,
        default: 0,
        min: 0,
      },
      casual: {
        type: Number,
        default: 0,
        min: 0,
      },
      sick: {
        type: Number,
        default: 0,
        min: 0,
      },
      short: {
        type: Number,
        default: 0,
        min: 0,
      },
      compensatory: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    team: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },

    // System fields
    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      default: "employee",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "terminated", "resigned"],
      default: "active",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
employeeSchema.index({ email: 1 });
employeeSchema.index({ company: 1 });
employeeSchema.index({ employeeId: 1 });

// Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
employeeSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate employee ID
employeeSchema.methods.generateEmployeeId = function () {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `EMP${year}${random}`;
};

// Virtual for full name
employeeSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
employeeSchema.set("toJSON", { virtuals: true });
employeeSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Employee", employeeSchema);
