const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// @route   GET /api/employees
// @desc    Get all employees with optional filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      department, 
      status, 
      role, 
      search, 
      page = 1, 
      limit = 10,
      managerId 
    } = req.query;

    const query = {};

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by manager
    if (managerId) {
      query['reportingManager._id'] = managerId;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const employees = await Employee.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      department,
      designation,
      role,
      status,
      joiningDate,
      dateOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      emergencyContact,
      salary,
      bankDetails,
      address,
      documents,
      education,
      workExperience,
      skills,
      team,
      performance,
      leaveBalance,
      reportingManager
    } = req.body;

    // Check if employee with email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    // Check if employee ID already exists
    const existingEmployeeId = await Employee.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      employeeId,
      department,
      designation,
      role,
      status,
      joiningDate,
      dateOfBirth,
      gender,
      maritalStatus,
      bloodGroup,
      emergencyContact,
      salary,
      bankDetails,
      address,
      documents,
      education,
      workExperience,
      skills,
      team,
      performance,
      leaveBalance,
      reportingManager,
      isProfileComplete: false
    });

    const employee = await newEmployee.save();
    res.json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email: req.body.email });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Employee with this email already exists' });
      }
    }

    // Check if employee ID is being changed and if it already exists
    if (req.body.employeeId && req.body.employeeId !== employee.employeeId) {
      const existingEmployeeId = await Employee.findOne({ employeeId: req.body.employeeId });
      if (existingEmployeeId) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee has team members
    const teamMembers = await Employee.find({ 'reportingManager._id': req.params.id });
    if (teamMembers.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete employee with team members. Please reassign team members first.' 
      });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/employees/:id/reporting-manager
// @desc    Update employee's reporting manager
// @access  Private
router.put('/:id/reporting-manager', auth, async (req, res) => {
  try {
    const { managerId } = req.body;
    
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let reportingManager = null;
    if (managerId) {
      const manager = await Employee.findById(managerId);
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }
      
      // Prevent circular reference
      if (managerId === req.params.id) {
        return res.status(400).json({ message: 'Employee cannot report to themselves' });
      }

      reportingManager = {
        _id: manager._id,
        firstName: manager.firstName,
        lastName: manager.lastName,
        employeeId: manager.employeeId
      };
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { 
        reportingManager,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating reporting manager:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/:id/team-members
// @desc    Get team members for an employee
// @access  Private
router.get('/:id/team-members', auth, async (req, res) => {
  try {
    const teamMembers = await Employee.find({ 'reportingManager._id': req.params.id })
      .select('-password')
      .sort({ firstName: 1, lastName: 1 });

    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/managers/list
// @desc    Get list of all managers
// @access  Private
router.get('/managers/list', auth, async (req, res) => {
  try {
    const managers = await Employee.find({ 
      role: { $in: ['manager', 'admin'] },
      status: 'active'
    })
    .select('_id firstName lastName employeeId designation department')
    .sort({ firstName: 1, lastName: 1 });

    res.json(managers);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/employees/:id/leave-balance
// @desc    Update employee's leave balance
// @access  Private
router.put('/:id/leave-balance', auth, async (req, res) => {
  try {
    const { leaveBalance } = req.body;
    
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { 
        leaveBalance,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating leave balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/employees/:id/salary
// @desc    Update employee's salary
// @access  Private
router.put('/:id/salary', auth, async (req, res) => {
  try {
    const { salary } = req.body;
    
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { 
        salary,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating salary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/employees/:id/upload-document
// @desc    Upload employee document
// @access  Private
router.post('/:id/upload-document', auth, upload.single('document'), async (req, res) => {
  try {
    const { documentType } = req.body;
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const documentInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: Date.now()
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        [`documents.${documentType}`]: documentInfo,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/employees/stats/overview
// @desc    Get employee statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'active' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'inactive' });
    const managers = await Employee.countDocuments({ role: { $in: ['manager', 'admin'] } });
    const employees = await Employee.countDocuments({ role: 'employee' });

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const statusStats = await Employee.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      managers,
      employees,
      departmentStats,
      statusStats
    });
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 