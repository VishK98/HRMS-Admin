const express = require("express");
const router = express.Router();
const {
  getDepartmentsByCompany,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentById,
  addSubCategory,
} = require("../controllers/department.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { authenticate } = authMiddleware;

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all departments for a company
router.get("/company/:companyId", getDepartmentsByCompany);

// Get a single department
router.get("/:id", getDepartmentById);

// Create a new department
router.post("/", createDepartment);

// Update a department
router.put("/:id", updateDepartment);

// Delete a department
router.delete("/:id", deleteDepartment);

// Add subcategory to department
router.post("/:id/subcategories", addSubCategory);

module.exports = router; 