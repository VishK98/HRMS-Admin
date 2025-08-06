const express = require("express");
const systemController = require("../controllers/system.controller");
const { authenticate, requireSuperAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Super admin routes
router.get("/health", authenticate, requireSuperAdmin, systemController.getSystemHealth);
router.get("/logs", authenticate, requireSuperAdmin, systemController.getSystemLogs);
router.get("/performance", authenticate, requireSuperAdmin, systemController.getPerformanceMetrics);

module.exports = router; 