const { verifyToken } = require("../utils/token.util");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = verifyToken(token);
    console.log("Token decoded:", decoded);

    // Try to find user first (for admin/super admin)
    let user = await User.findById(decoded.id).populate("company");
    console.log("User found in User model:", user ? "Yes" : "No");

    if (!user) {
      // If not found in User model, try Employee model
      user = await Employee.findById(decoded.id).populate("company");
      console.log("User found in Employee model:", user ? "Yes" : "No");
    }

    if (
      !user ||
      (user.status && user.status !== "active") ||
      user.isActive === false
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or user not found.",
      });
    }

    console.log("Authenticated user:", {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
    });

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    console.log("Checking authorization for roles:", roles);
    console.log("User role:", req.user.role);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    console.log("Authorization successful");
    next();
  };
};

// Middleware to require super admin role
const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  console.log("Checking super admin access. User role:", req.user.role);

  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Super admin access required",
    });
  }

  console.log("Super admin access granted");
  next();
};

const requireAdmin = authorize("admin", "super_admin");
const requireEmployee = authorize(
  "employee",
  "manager",
  "admin",
  "super_admin"
);

module.exports = {
  authenticate,
  authorize,
  requireSuperAdmin,
  requireAdmin,
  requireEmployee,
};
