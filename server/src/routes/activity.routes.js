const express = require("express");
const activityController = require("../controllers/activity.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware.authenticate);

// Get activities for super admin (all activities across companies)
router.get(
  "/super-admin",
  authMiddleware.requireSuperAdmin,
  activityController.getSuperAdminActivities
);

// Get activities for admin (company-specific activities)
router.get(
  "/admin",
  authMiddleware.requireEmployee,
  activityController.getAdminActivities
);

// Get activity statistics
router.get("/stats", activityController.getActivityStats);

// Log an activity (for internal use)
router.post("/log", activityController.logActivity);

module.exports = router;
