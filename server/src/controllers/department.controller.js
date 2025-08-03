const Department = require("../models/department.model");

// Get all departments for a company
const getDepartmentsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const departments = await Department.find({ 
      companyId, 
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: { departments },
      message: "Departments retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

// Create a new department
const createDepartment = async (req, res) => {
  try {
    const { name, description, manager, subCategories, companyId } = req.body;
    
    // Check if department with same name already exists for this company
    const existingDepartment = await Department.findOne({ 
      name, 
      companyId 
    });
    
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department with this name already exists",
      });
    }
    
    const department = new Department({
      name,
      description,
      manager,
      subCategories: subCategories || [],
      companyId,
    });
    
    await department.save();
    
    res.status(201).json({
      success: true,
      data: department,
      message: "Department created successfully",
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create department",
      error: error.message,
    });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const department = await Department.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: department,
      message: "Department updated successfully",
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update department",
      error: error.message,
    });
  }
};

// Delete a department (soft delete)
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const department = await Department.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete department",
      error: error.message,
    });
  }
};

// Get a single department
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const department = await Department.findById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: department,
      message: "Department retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch department",
      error: error.message,
    });
  }
};

// Add subcategory to department
const addSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const department = await Department.findById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    
    // Check if subcategory with same name already exists
    const existingSubCategory = department.subCategories.find(
      sub => sub.name === name
    );
    
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory with this name already exists",
      });
    }
    
    department.subCategories.push({
      name,
      description,
      isActive: true,
    });
    
    await department.save();
    
    res.status(200).json({
      success: true,
      data: department,
      message: "Subcategory added successfully",
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add subcategory",
      error: error.message,
    });
  }
};

module.exports = {
  getDepartmentsByCompany,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentById,
  addSubCategory,
}; 