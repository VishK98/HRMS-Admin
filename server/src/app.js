const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();
const fs = require("fs"); // Added for file system operations

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const regularizationRoutes = require("./routes/regularization.routes");
const leaveRoutes = require("./routes/leave.routes");
const designationRoutes = require("./routes/designation.routes");
const departmentRoutes = require("./routes/department.routes");
const holidayRoutes = require("./routes/holiday.routes");
const announcementRoutes = require("./routes/announcement.routes");
const companyRoutes = require("./routes/company.routes");
const systemRoutes = require("./routes/system.routes");
const analyticsRoutes = require("./routes/analytics.routes");

// Debug: Log route loading
console.log("Loading routes...");
console.log("User routes loaded:", !!userRoutes);
console.log("Employee routes loaded:", !!employeeRoutes);
console.log("Leave routes loaded:", !!leaveRoutes);
console.log("Designation routes loaded:", !!designationRoutes);
console.log("Department routes loaded:", !!departmentRoutes);
console.log("Holiday routes loaded:", !!holidayRoutes);
console.log("Announcement routes loaded:", !!announcementRoutes);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080",
          ],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files (uploaded documents)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Specific route to serve employee documents and education files
app.get("/uploads/employees/:employeeId/:folder/:filename", (req, res) => {
  const { employeeId, folder, filename } = req.params;
  const filePath = path.join(
    __dirname,
    "../uploads/employees",
    employeeId,
    folder,
    filename
  );

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      success: false,
      message: "File not found",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HRMS API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/regularization", regularizationRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/system", systemRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
