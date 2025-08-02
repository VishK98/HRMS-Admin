const { verifyToken } = require('../utils/token.util');
const User = require('../models/user.model');
const Employee = require('../models/employee.model');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = verifyToken(token);
    
    // Try to find user first (for admin/super admin)
    let user = await User.findById(decoded.id).populate('company');
    
    if (!user) {
      // If not found in User model, try Employee model
      user = await Employee.findById(decoded.id).populate('company');
    }
    
    if (!user || (user.status && user.status !== 'active') || (user.isActive === false)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token or user not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

const requireSuperAdmin = authorize('super_admin');
const requireAdmin = authorize('admin', 'super_admin');
const requireEmployee = authorize('employee', 'manager', 'admin', 'super_admin');

module.exports = {
  authenticate,
  authorize,
  requireSuperAdmin,
  requireAdmin,
  requireEmployee
}; 