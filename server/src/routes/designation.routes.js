const express = require("express");
const router = express.Router();
const {
  getDesignationsByCompany,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  getDesignationById,
} = require("../controllers/designation.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { authenticate } = authMiddleware;

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all designations for a company
router.get("/company/:companyId", getDesignationsByCompany);

// Get a single designation
router.get("/:id", getDesignationById);

// Create a new designation
router.post("/", createDesignation);

// Update a designation
router.put("/:id", updateDesignation);

// Delete a designation
router.delete("/:id", deleteDesignation);

module.exports = router; 