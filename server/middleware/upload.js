const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const ensureUploadsDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure storage with dynamic destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload path based on route and document type
    let uploadPath = "uploads/";

    if (req.route?.path?.includes("employees")) {
      uploadPath += "employees/";

      // Add employee ID to path if available
      if (req.params.employeeId) {
        uploadPath += req.params.employeeId + "/";
      }

      // Always store in documents folder for employee uploads
      uploadPath += "documents/";
    } else {
      uploadPath += "general/";
    }

    ensureUploadsDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(originalName));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PDF, DOC, DOCX, and image files are allowed."
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Specific upload configurations
const uploadSingle = upload.single("file");
const uploadMultiple = upload.array("files", 10); // Max 10 files

// Dynamic upload fields for documents
const uploadDocumentFields = upload.fields([
  { name: "aadhar", maxCount: 1 },
  { name: "pan", maxCount: 1 },
  { name: "passport", maxCount: 1 },
  { name: "drivingLicense", maxCount: 1 },
  { name: "voterId", maxCount: 1 },
  { name: "relievingLetter", maxCount: 1 },
  { name: "experienceLetter", maxCount: 1 },
  { name: "lastPayslip", maxCount: 1 },
  { name: "passportPhoto", maxCount: 1 },
  { name: "offerLetter", maxCount: 1 },
]);

// Dynamic upload fields for education documents
const uploadEducationFields = upload.fields([
  { name: "intermediate", maxCount: 1 },
  { name: "undergraduate", maxCount: 1 },
  { name: "postgraduate", maxCount: 1 },
  { name: "other", maxCount: 1 },
]);

// Generic upload fields for any field name
const uploadFields = upload.any();

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadDocumentFields,
  uploadEducationFields,
};
