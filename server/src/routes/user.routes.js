const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authenticate, requireSuperAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Validation middleware
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const companyRegistrationValidation = [
  body('companyName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('companyCode')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Company code must be between 3 and 20 characters'),
  body('companyEmail')
    .isEmail()
    .withMessage('Please enter a valid company email'),
  body('companyPhone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Please enter a valid phone number'),
  body('companyAddress.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  body('companyAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('companyAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('companyAddress.zipCode')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('Zip code must be between 5 and 10 characters'),
  body('adminName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Admin name must be between 2 and 100 characters'),
  body('adminEmail')
    .isEmail()
    .withMessage('Please enter a valid admin email'),
  body('adminPassword')
    .isLength({ min: 6 })
    .withMessage('Admin password must be at least 6 characters long'),
  body('adminPhone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Please enter a valid admin phone number')
];

const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Please enter a valid phone number')
];

// Public routes
router.post('/login', loginValidation, userController.login);

// Protected routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, profileUpdateValidation, userController.updateProfile);

// Super admin only routes
router.post('/register-company', 
  authenticate, 
  requireSuperAdmin, 
  companyRegistrationValidation, 
  userController.registerCompany
);
router.get('/companies', authenticate, requireSuperAdmin, userController.getAllCompanies);
router.get('/companies/:companyId', authenticate, requireSuperAdmin, userController.getCompanyById);
router.get('/companies/:companyId/users', authenticate, requireSuperAdmin, userController.getUsersByCompany);

module.exports = router; 