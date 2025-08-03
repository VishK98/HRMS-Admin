const express = require("express");
const router = express.Router();
const {
  getAnnouncementsByCompany,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
} = require("../controllers/announcement.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { authenticate } = authMiddleware;

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all announcements for a company
router.get("/company/:companyId", getAnnouncementsByCompany);

// Get a single announcement
router.get("/:id", getAnnouncementById);

// Create a new announcement
router.post("/", createAnnouncement);

// Update an announcement
router.put("/:id", updateAnnouncement);

// Delete an announcement
router.delete("/:id", deleteAnnouncement);

module.exports = router;
