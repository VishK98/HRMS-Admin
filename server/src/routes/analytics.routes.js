const express = require("express");
const analyticsController = require("../controllers/analytics.controller");
const {
  authenticate,
  requireAdmin,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Admin analytics routes (both super_admin and admin can access)
router.get(
  "/overview",
  authenticate,
  requireAdmin,
  analyticsController.getAnalyticsOverview
);
router.get(
  "/users",
  authenticate,
  requireAdmin,
  analyticsController.getUserAnalytics
);
router.get(
  "/companies",
  authenticate,
  requireAdmin,
  analyticsController.getCompanyAnalytics
);
router.get(
  "/system",
  authenticate,
  requireAdmin,
  analyticsController.getSystemAnalytics
);
router.get(
  "/activities",
  authenticate,
  requireAdmin,
  analyticsController.getActivityAnalytics
);

module.exports = router;
