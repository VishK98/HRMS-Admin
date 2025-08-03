const Announcement = require("../models/announcement.model");

// Get all announcements for a company
const getAnnouncementsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const announcements = await Announcement.find({
      companyId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { announcements },
      message: "Announcements retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};

// Create a new announcement
const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      type,
      targetAudience,
      targetIds,
      startDate,
      endDate,
      companyId,
    } = req.body;

    // Check if announcement with same title already exists for this company
    const existingAnnouncement = await Announcement.findOne({
      title,
      companyId,
    });

    if (existingAnnouncement) {
      return res.status(400).json({
        success: false,
        message: "Announcement with this title already exists",
      });
    }

    const announcement = new Announcement({
      title,
      content,
      type: type || "general",
      targetAudience: targetAudience || "all",
      targetIds: targetIds || [],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      companyId,
    });

    await announcement.save();

    res.status(201).json({
      success: true,
      data: announcement,
      message: "Announcement created successfully",
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: error.message,
    });
  }
};

// Update an announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert date strings to Date objects if provided
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const announcement = await Announcement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
      message: "Announcement updated successfully",
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update announcement",
      error: error.message,
    });
  }
};

// Delete an announcement (soft delete)
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};

// Get a single announcement
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
      message: "Announcement retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcement",
      error: error.message,
    });
  }
};

module.exports = {
  getAnnouncementsByCompany,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
};
