const Holiday = require("../models/holiday.model");

// Get all holidays for a company
const getHolidaysByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const holidays = await Holiday.find({ 
      companyId, 
      isActive: true 
    }).sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      data: { holidays },
      message: "Holidays retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch holidays",
      error: error.message,
    });
  }
};

// Create a new holiday
const createHoliday = async (req, res) => {
  try {
    const { name, date, description, type, companyId } = req.body;
    
    // Check if holiday with same name and date already exists for this company
    const existingHoliday = await Holiday.findOne({ 
      name, 
      date: new Date(date),
      companyId 
    });
    
    if (existingHoliday) {
      return res.status(400).json({
        success: false,
        message: "Holiday with this name and date already exists",
      });
    }
    
    const holiday = new Holiday({
      name,
      date: new Date(date),
      description,
      type: type || "company", // Default to company holiday as requested
      companyId,
    });
    
    await holiday.save();
    
    res.status(201).json({
      success: true,
      data: holiday,
      message: "Holiday created successfully",
    });
  } catch (error) {
    console.error("Error creating holiday:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create holiday",
      error: error.message,
    });
  }
};

// Update a holiday
const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Convert date string to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    
    const holiday = await Holiday.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: holiday,
      message: "Holiday updated successfully",
    });
  } catch (error) {
    console.error("Error updating holiday:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update holiday",
      error: error.message,
    });
  }
};

// Delete a holiday (soft delete)
const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    
    const holiday = await Holiday.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete holiday",
      error: error.message,
    });
  }
};

// Get a single holiday
const getHolidayById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const holiday = await Holiday.findById(id);
    
    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: holiday,
      message: "Holiday retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching holiday:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch holiday",
      error: error.message,
    });
  }
};

module.exports = {
  getHolidaysByCompany,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidayById,
}; 