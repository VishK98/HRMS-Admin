const express = require('express');
const router = express.Router();
const regularizationController = require('../controllers/regularization.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const createRequestValidation = [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('reason').notEmpty().withMessage('Reason is required')
];

// Create a new regularization request
router.post(
  '/requests',
  authenticate,
  authorize('admin'),
  createRequestValidation,
  regularizationController.createRequest
);

// Get regularization requests for an employee
router.get(
  '/requests/employee/:employeeId',
  authenticate,
  authorize('admin'),
  regularizationController.getEmployeeRequests
);

// Get regularization requests for a company
router.get(
  '/requests/company',
  authenticate,
  authorize('admin'),
  regularizationController.getCompanyRequests
);

// Get regularization request by ID
router.get(
  '/requests/:requestId',
  authenticate,
  authorize('admin'),
  regularizationController.getRequestById
);

// Update regularization request status (approve/reject)
router.put(
  '/requests/:requestId/status',
  authenticate,
  authorize('admin'),
  regularizationController.updateRequestStatus
);

// Delete regularization request
router.delete(
  '/requests/:requestId',
  authenticate,
  authorize('admin'),
  regularizationController.deleteRequest
);

module.exports = router;
