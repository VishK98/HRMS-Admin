const express = require("express");
const router = express.Router();
const {
  getHolidaysByCompany,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidayById,
} = require("../controllers/holiday.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { authenticate } = authMiddleware;

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all holidays for a company
router.get("/company/:companyId", getHolidaysByCompany);

// Get a single holiday
router.get("/:id", getHolidayById);

// Create a new holiday
router.post("/", createHoliday);

// Update a holiday
router.put("/:id", updateHoliday);

// Delete a holiday
router.delete("/:id", deleteHoliday);

module.exports = router; 