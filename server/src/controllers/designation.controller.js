const Designation = require("../models/designation.model");

// Get all designations for a company
const getDesignationsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const designations = await Designation.find({
      companyId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { designations },
      message: "Designations retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching designations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch designations",
      error: error.message,
    });
  }
};

// Create a new designation
const createDesignation = async (req, res) => {
  try {
    console.log("createDesignation called with body:", req.body);
    const { name, description, level, department, companyId } = req.body;

    console.log("Extracted data:", {
      name,
      description,
      level,
      department,
      companyId,
    });

    // Check if designation with same name already exists for this company
    const existingDesignation = await Designation.findOne({
      name,
      companyId,
    });

    console.log("Existing designation check:", existingDesignation);

    if (existingDesignation) {
      console.log("Designation already exists");
      return res.status(400).json({
        success: false,
        message: "Designation with this name already exists",
      });
    }

    const designation = new Designation({
      name,
      description,
      level,
      department,
      companyId,
    });

    console.log("Saving designation:", designation);
    await designation.save();

    console.log("Designation saved successfully:", designation);

    res.status(201).json({
      success: true,
      data: designation,
      message: "Designation created successfully",
    });
  } catch (error) {
    console.error("Error creating designation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create designation",
      error: error.message,
    });
  }
};

// Update a designation
const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const designation = await Designation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: designation,
      message: "Designation updated successfully",
    });
  } catch (error) {
    console.error("Error updating designation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update designation",
      error: error.message,
    });
  }
};

// Delete a designation (soft delete)
const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Designation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting designation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete designation",
      error: error.message,
    });
  }
};

// Get a single designation
const getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;

    const designation = await Designation.findById(id);

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: designation,
      message: "Designation retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching designation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch designation",
      error: error.message,
    });
  }
};

module.exports = {
  getDesignationsByCompany,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  getDesignationById,
};
