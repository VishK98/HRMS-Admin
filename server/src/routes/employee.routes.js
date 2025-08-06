const express = require("express");
const { body } = require("express-validator");
const employeeController = require("../controllers/employee.controller");
const {
  authenticate,
  requireAdmin,
} = require("../middlewares/auth.middleware");
const {
  uploadFields,
  uploadSingle,
  uploadDocumentFields,
  uploadEducationFields,
} = require("../../middleware/upload");

const router = express.Router();

// Validation middleware
const employeeRegistrationValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Please enter a valid date of birth"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("phone")
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Please enter a valid phone number"),
  body("companyName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const employeeLoginValidation = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const employeeProfileUpdateValidation = [
  body("department")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Department must be between 2 and 50 characters"),
  body("designation")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Designation must be between 2 and 50 characters"),
  body("reportingTo")
    .optional()
    .isMongoId()
    .withMessage("Please enter a valid reporting manager ID"),
  body("joiningDate")
    .optional()
    .isISO8601()
    .withMessage("Please enter a valid joining date"),
  body("salary.basic")
    .optional()
    .isNumeric()
    .withMessage("Basic salary must be a number"),
  body("salary.hra").optional().isNumeric().withMessage("HRA must be a number"),
  body("salary.da").optional().isNumeric().withMessage("DA must be a number"),
  body("salary.allowances")
    .optional()
    .isNumeric()
    .withMessage("Allowances must be a number"),
  body("bankDetails.accountNumber")
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Account number must be between 5 and 20 characters"),
  body("bankDetails.bankName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Bank name must be between 2 and 50 characters"),
  body("bankDetails.ifscCode")
    .optional()
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("IFSC code must be 11 characters"),
  body("bankDetails.branch")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Branch must be between 2 and 50 characters"),
  body("address.street")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Street address must be between 5 and 200 characters"),
  body("address.city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  body("address.state")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),
  body("address.zipCode")
    .optional()
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage("Zip code must be between 5 and 10 characters"),
  body("emergencyContact.name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Emergency contact name must be between 2 and 100 characters"),
  body("emergencyContact.relationship")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Relationship must be between 2 and 50 characters"),
  body("emergencyContact.phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Please enter a valid emergency contact phone number"),
  body("status")
    .optional()
    .isIn(["active", "inactive", "terminated", "resigned"])
    .withMessage("Status must be active, inactive, terminated, or resigned"),
];

// Public routes (no authentication required)
router.post(
  "/register",
  employeeRegistrationValidation,
  employeeController.registerEmployee
);
router.post(
  "/login",
  employeeLoginValidation,
  employeeController.loginEmployee
);

// Temporary route to create admin user (remove in production)
router.post("/create-admin", employeeController.createAdminUser);

// Protected routes (authentication required)
router.get("/profile", authenticate, employeeController.getEmployeeProfile);

// Debug route to check user role
router.get("/debug/role", authenticate, employeeController.checkUserRole);

// Admin routes (authentication and admin role required)
router.put(
  "/profile/:employeeId",
  authenticate,
  requireAdmin,
  employeeProfileUpdateValidation,
  employeeController.updateEmployeeProfile
);
router.get(
  "/company/:companyId",
  authenticate,
  requireAdmin,
  employeeController.getEmployeesByCompany
);
router.get(
  "/:employeeId",
  authenticate,
  requireAdmin,
  employeeController.getEmployeeById
);
router.put(
  "/:employeeId/deactivate",
  authenticate,
  requireAdmin,
  employeeController.deactivateEmployee
);
router.get(
  "/company/:companyId/stats",
  authenticate,
  requireAdmin,
  employeeController.getEmployeeStats
);

// Document upload routes
router.post(
  "/:employeeId/documents/upload",
  authenticate,
  requireAdmin,
  uploadDocumentFields,
  employeeController.uploadDocuments
);

router.post(
  "/:employeeId/education/upload",
  authenticate,
  requireAdmin,
  uploadEducationFields,
  employeeController.uploadEducationDocuments
);

router.post(
  "/:employeeId/documents/:documentType",
  authenticate,
  requireAdmin,
  uploadSingle,
  employeeController.uploadSingleDocument
);

router.delete(
  "/:employeeId/documents/:documentType",
  authenticate,
  requireAdmin,
  employeeController.deleteDocument
);

module.exports = router;
