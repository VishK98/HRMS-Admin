const express = require("express");
const companyController = require("../controllers/company.controller");
const { authenticate, requireSuperAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// Super admin routes
router.get("/stats", authenticate, requireSuperAdmin, companyController.getCompanyStats);
router.get("/all", authenticate, requireSuperAdmin, companyController.getAllCompanies);
router.put("/:companyId/status", authenticate, requireSuperAdmin, companyController.updateCompanyStatus);

module.exports = router; 