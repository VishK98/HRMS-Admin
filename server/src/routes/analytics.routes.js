const express = require("express");
const analyticsController = require("../controllers/analytics.controller");
const {
  authenticate,
  requireAdmin,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Bind controller methods to preserve 'this' context
const boundController = {
  getAnalyticsOverview: analyticsController.getAnalyticsOverview.bind(analyticsController),
  getUserAnalytics: analyticsController.getUserAnalytics.bind(analyticsController),
  getCompanyAnalytics: analyticsController.getCompanyAnalytics.bind(analyticsController),
  getSystemAnalytics: analyticsController.getSystemAnalytics.bind(analyticsController),
  getActivityAnalytics: analyticsController.getActivityAnalytics.bind(analyticsController),
  getComprehensiveAnalytics: analyticsController.getComprehensiveAnalytics.bind(analyticsController),
};

// Admin analytics routes (both super_admin and admin can access)
router.get(
  "/overview",
  authenticate,
  requireAdmin,
  boundController.getAnalyticsOverview
);
router.get(
  "/users",
  authenticate,
  requireAdmin,
  boundController.getUserAnalytics
);
router.get(
  "/companies",
  authenticate,
  requireAdmin,
  boundController.getCompanyAnalytics
);
router.get(
  "/system",
  authenticate,
  requireAdmin,
  boundController.getSystemAnalytics
);
router.get(
  "/activities",
  authenticate,
  requireAdmin,
  boundController.getActivityAnalytics
);
router.get(
  "/comprehensive",
  authenticate,
  requireAdmin,
  boundController.getComprehensiveAnalytics
);

module.exports = router;
