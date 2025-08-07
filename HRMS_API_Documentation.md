# HRMS Admin API Documentation

Complete API documentation for HRMS Admin system with all 67 endpoints.

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require Bearer token authentication:
```
Authorization: Bearer <token>
```

## API Endpoints

### 1. Authentication & User Management (8 APIs)

#### 1.1 Login
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Description:** User login
- **Body:**
```json
{
  "email": "admin@othtech.com",
  "password": "admin@123"
}
```

#### 1.2 Get Profile
- **Method:** `GET`
- **URL:** `/api/auth/profile`
- **Description:** Get user profile (authenticated)

#### 1.3 Update Profile
- **Method:** `PUT`
- **URL:** `/api/auth/profile`
- **Description:** Update user profile
- **Body:**
```json
{
  "name": "Updated Admin Name",
  "phone": "9876543210"
}
```

#### 1.4 Register Company
- **Method:** `POST`
- **URL:** `/api/auth/register-company`
- **Description:** Register new company with admin
- **Body:**
```json
{
  "companyName": "Test Company",
  "companyCode": "TC001",
  "companyEmail": "info@testcompany.com",
  "companyPhone": "9876543210",
  "companyAddress": {
    "street": "123 Test Street",
    "city": "Test City",
    "state": "Test State",
    "zipCode": "123456"
  },
  "adminName": "Test Admin",
  "adminEmail": "admin@testcompany.com",
  "adminPassword": "admin123",
  "adminPhone": "9876543210"
}
```

#### 1.5 Get All Companies
- **Method:** `GET`
- **URL:** `/api/auth/companies`
- **Description:** Get all companies (super admin only)

#### 1.6 Get Company by ID
- **Method:** `GET`
- **URL:** `/api/auth/companies/:companyId`
- **Description:** Get company by ID (super admin only)

#### 1.7 Get Users by Company
- **Method:** `GET`
- **URL:** `/api/auth/companies/:companyId/users`
- **Description:** Get users by company (super admin only)

#### 1.8 Initialize Super Admin
- **Method:** `POST`
- **URL:** `/api/auth/init-super-admin`
- **Description:** Initialize super admin (public route)
- **Body:**
```json
{
  "name": "Super Admin",
  "email": "admin@othtech.com",
  "password": "admin@123"
}
```

### 2. Employee Management (18 APIs)

#### 2.1 Employee Registration
- **Method:** `POST`
- **URL:** `/api/employees/register`
- **Description:** Employee registration
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "email": "john.doe@company.com",
  "phone": "9876543210",
  "companyName": "Test Company",
  "password": "password123"
}
```

#### 2.2 Employee Login
- **Method:** `POST`
- **URL:** `/api/employees/login`
- **Description:** Employee login
- **Body:**
```json
{
  "email": "john.doe@company.com",
  "password": "password123"
}
```

#### 2.3 Create Admin User
- **Method:** `POST`
- **URL:** `/api/employees/create-admin`
- **Description:** Create admin user
- **Body:**
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "admin123",
  "role": "admin"
}
```

#### 2.4 Get Employee Profile
- **Method:** `GET`
- **URL:** `/api/employees/profile`
- **Description:** Get employee profile (authenticated)

#### 2.5 Check User Role
- **Method:** `GET`
- **URL:** `/api/employees/debug/role`
- **Description:** Check user role (debug)

#### 2.6 Update Employee Profile
- **Method:** `PUT`
- **URL:** `/api/employees/profile/:employeeId`
- **Description:** Update employee profile (admin only)
- **Body:**
```json
{
  "department": "IT",
  "designation": "Software Engineer",
  "joiningDate": "2023-01-01",
  "salary": {
    "basic": 50000,
    "hra": 20000,
    "da": 15000,
    "allowances": 10000
  },
  "bankDetails": {
    "accountNumber": "1234567890",
    "bankName": "Test Bank",
    "ifscCode": "TEST0001234",
    "branch": "Test Branch"
  },
  "address": {
    "street": "123 Employee Street",
    "city": "Employee City",
    "state": "Employee State",
    "zipCode": "123456"
  },
  "emergencyContact": {
    "name": "Emergency Contact",
    "relationship": "Spouse",
    "phone": "9876543210"
  },
  "status": "active"
}
```

#### 2.7 Get Employees by Company
- **Method:** `GET`
- **URL:** `/api/employees/company/:companyId`
- **Description:** Get employees by company (admin only)

#### 2.8 Get Employee by ID
- **Method:** `GET`
- **URL:** `/api/employees/:employeeId`
- **Description:** Get employee by ID (admin only)

#### 2.9 Deactivate Employee
- **Method:** `PUT`
- **URL:** `/api/employees/:employeeId/deactivate`
- **Description:** Deactivate employee (admin only)

#### 2.10 Get Employee Stats
- **Method:** `GET`
- **URL:** `/api/employees/company/:companyId/stats`
- **Description:** Get employee stats (admin only)

#### 2.11 Upload Documents
- **Method:** `POST`
- **URL:** `/api/employees/:employeeId/documents/upload`
- **Description:** Upload employee documents (admin only)
- **Body:** FormData with files (aadhar, pan, passportPhoto)

#### 2.12 Upload Education Documents
- **Method:** `POST`
- **URL:** `/api/employees/:employeeId/education/upload`
- **Description:** Upload education documents (admin only)
- **Body:** FormData with files (intermediate, undergraduate, postgraduate)

#### 2.13 Upload Single Document
- **Method:** `POST`
- **URL:** `/api/employees/:employeeId/documents/:documentType`
- **Description:** Upload single document (admin only)
- **Body:** FormData with file

#### 2.14 Delete Document
- **Method:** `DELETE`
- **URL:** `/api/employees/:employeeId/documents/:documentType`
- **Description:** Delete document (admin only)

### 3. Attendance Management (8 APIs)

#### 3.1 Check In
- **Method:** `POST`
- **URL:** `/api/attendance/check-in`
- **Description:** Employee check in
- **Body:**
```json
{
  "employeeId": "employeeId",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "deviceInfo": "Mobile App"
}
```

#### 3.2 Check Out
- **Method:** `POST`
- **URL:** `/api/attendance/check-out`
- **Description:** Employee check out
- **Body:**
```json
{
  "employeeId": "employeeId",
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "deviceInfo": "Mobile App"
}
```

#### 3.3 Get Employee Attendance
- **Method:** `GET`
- **URL:** `/api/attendance/employee/:employeeId`
- **Description:** Get employee attendance for date range
- **Query:** `startDate=2024-01-01&endDate=2024-01-31`

#### 3.4 Get Company Attendance
- **Method:** `GET`
- **URL:** `/api/attendance/company`
- **Description:** Get company attendance for date range
- **Query:** `startDate=2024-01-01&endDate=2024-01-31`

#### 3.5 Get Attendance Summary
- **Method:** `GET`
- **URL:** `/api/attendance/summary`
- **Description:** Get attendance summary
- **Query:** `date=2024-01-15`

#### 3.6 Get Today's Attendance
- **Method:** `GET`
- **URL:** `/api/attendance/today/:employeeId`
- **Description:** Get today's attendance status for employee

#### 3.7 Update Attendance
- **Method:** `PUT`
- **URL:** `/api/attendance/:attendanceId`
- **Description:** Update attendance record (admin only)
- **Body:**
```json
{
  "checkInTime": "2024-01-15T09:00:00Z",
  "checkOutTime": "2024-01-15T18:00:00Z",
  "status": "present"
}
```

#### 3.8 Delete Attendance
- **Method:** `DELETE`
- **URL:** `/api/attendance/:attendanceId`
- **Description:** Delete attendance record (admin only)

### 4. Leave Management (8 APIs)

#### 4.1 Create Leave Request
- **Method:** `POST`
- **URL:** `/api/leave/requests`
- **Description:** Create leave request
- **Body:**
```json
{
  "employeeId": "employeeId",
  "leaveType": "sick",
  "startDate": "2024-01-20",
  "endDate": "2024-01-22",
  "reason": "Not feeling well",
  "days": 3
}
```

#### 4.2 Get All Leave Requests
- **Method:** `GET`
- **URL:** `/api/leave/requests`
- **Description:** Get all leave requests with filtering
- **Query:** `status=pending&page=1&limit=10`

#### 4.3 Get Leave Request by ID
- **Method:** `GET`
- **URL:** `/api/leave/requests/:leaveId`
- **Description:** Get leave request by ID

#### 4.4 Update Leave Status
- **Method:** `PUT`
- **URL:** `/api/leave/requests/:leaveId/status`
- **Description:** Update leave request status
- **Body:**
```json
{
  "status": "approved",
  "comments": "Approved"
}
```

#### 4.5 Update Manager Action
- **Method:** `PUT`
- **URL:** `/api/leave/requests/:leaveId/manager-action`
- **Description:** Update manager action on leave request
- **Body:**
```json
{
  "managerAction": "approved",
  "managerComments": "Approved by manager"
}
```

#### 4.6 Update Leave Request
- **Method:** `PUT`
- **URL:** `/api/leave/requests/:leaveId`
- **Description:** Update leave request
- **Body:**
```json
{
  "startDate": "2024-01-21",
  "endDate": "2024-01-23",
  "reason": "Updated reason",
  "days": 3
}
```

#### 4.7 Delete Leave Request
- **Method:** `DELETE`
- **URL:** `/api/leave/requests/:leaveId`
- **Description:** Delete leave request

#### 4.8 Get Employee Leave Requests
- **Method:** `GET`
- **URL:** `/api/leave/requests/employee/:employeeId`
- **Description:** Get employee leave requests

#### 4.9 Get Leave Summary
- **Method:** `GET`
- **URL:** `/api/leave/summary`
- **Description:** Get leave summary
- **Query:** `year=2024`

### 5. Regularization Management (6 APIs)

#### 5.1 Create Regularization Request
- **Method:** `POST`
- **URL:** `/api/regularization/requests`
- **Description:** Create regularization request (admin only)
- **Body:**
```json
{
  "employeeId": "employeeId",
  "date": "2024-01-15",
  "reason": "Late due to traffic",
  "requestedTime": "09:30"
}
```

#### 5.2 Get Employee Regularization Requests
- **Method:** `GET`
- **URL:** `/api/regularization/requests/employee/:employeeId`
- **Description:** Get regularization requests for employee (admin only)

#### 5.3 Get Company Regularization Requests
- **Method:** `GET`
- **URL:** `/api/regularization/requests/company`
- **Description:** Get regularization requests for company (admin only)
- **Query:** `status=pending`

#### 5.4 Get Regularization Request by ID
- **Method:** `GET`
- **URL:** `/api/regularization/requests/:requestId`
- **Description:** Get regularization request by ID (admin only)

#### 5.5 Update Regularization Status
- **Method:** `PUT`
- **URL:** `/api/regularization/requests/:requestId/status`
- **Description:** Update regularization request status (admin only)
- **Body:**
```json
{
  "status": "approved",
  "comments": "Approved"
}
```

#### 5.6 Delete Regularization Request
- **Method:** `DELETE`
- **URL:** `/api/regularization/requests/:requestId`
- **Description:** Delete regularization request (admin only)

### 6. Analytics (6 APIs)

#### 6.1 Get Analytics Overview
- **Method:** `GET`
- **URL:** `/api/analytics/overview`
- **Description:** Get analytics overview (admin only)

#### 6.2 Get User Analytics
- **Method:** `GET`
- **URL:** `/api/analytics/users`
- **Description:** Get user analytics (admin only)

#### 6.3 Get Company Analytics
- **Method:** `GET`
- **URL:** `/api/analytics/companies`
- **Description:** Get company analytics (admin only)

#### 6.4 Get System Analytics
- **Method:** `GET`
- **URL:** `/api/analytics/system`
- **Description:** Get system analytics (admin only)

#### 6.5 Get Activity Analytics
- **Method:** `GET`
- **URL:** `/api/analytics/activities`
- **Description:** Get activity analytics (admin only)

#### 6.6 Get Comprehensive Analytics
- **Method:** `GET`
- **URL:** `/api/analytics/comprehensive`
- **Description:** Get comprehensive analytics (admin only)

### 7. Department Management (6 APIs)

#### 7.1 Get Departments by Company
- **Method:** `GET`
- **URL:** `/api/departments/company/:companyId`
- **Description:** Get departments by company

#### 7.2 Get Department by ID
- **Method:** `GET`
- **URL:** `/api/departments/:id`
- **Description:** Get department by ID

#### 7.3 Create Department
- **Method:** `POST`
- **URL:** `/api/departments`
- **Description:** Create department
- **Body:**
```json
{
  "name": "IT Department",
  "description": "Information Technology Department",
  "companyId": "companyId",
  "head": "John Doe",
  "isActive": true
}
```

#### 7.4 Update Department
- **Method:** `PUT`
- **URL:** `/api/departments/:id`
- **Description:** Update department
- **Body:**
```json
{
  "name": "Updated IT Department",
  "description": "Updated Information Technology Department",
  "head": "Jane Smith",
  "isActive": true
}
```

#### 7.5 Delete Department
- **Method:** `DELETE`
- **URL:** `/api/departments/:id`
- **Description:** Delete department

#### 7.6 Add Subcategory to Department
- **Method:** `POST`
- **URL:** `/api/departments/:id/subcategories`
- **Description:** Add subcategory to department
- **Body:**
```json
{
  "name": "Software Development",
  "description": "Software Development Team"
}
```

### 8. Designation Management (5 APIs)

#### 8.1 Get Designations by Company
- **Method:** `GET`
- **URL:** `/api/designations/company/:companyId`
- **Description:** Get designations by company

#### 8.2 Get Designation by ID
- **Method:** `GET`
- **URL:** `/api/designations/:id`
- **Description:** Get designation by ID

#### 8.3 Create Designation
- **Method:** `POST`
- **URL:** `/api/designations`
- **Description:** Create designation
- **Body:**
```json
{
  "name": "Software Engineer",
  "description": "Software Engineer Role",
  "companyId": "companyId",
  "level": "Mid",
  "isActive": true
}
```

#### 8.4 Update Designation
- **Method:** `PUT`
- **URL:** `/api/designations/:id`
- **Description:** Update designation
- **Body:**
```json
{
  "name": "Senior Software Engineer",
  "description": "Senior Software Engineer Role",
  "level": "Senior",
  "isActive": true
}
```

#### 8.5 Delete Designation
- **Method:** `DELETE`
- **URL:** `/api/designations/:id`
- **Description:** Delete designation

### 9. Holiday Management (5 APIs)

#### 9.1 Get Holidays by Company
- **Method:** `GET`
- **URL:** `/api/holidays/company/:companyId`
- **Description:** Get holidays by company

#### 9.2 Get Holiday by ID
- **Method:** `GET`
- **URL:** `/api/holidays/:id`
- **Description:** Get holiday by ID

#### 9.3 Create Holiday
- **Method:** `POST`
- **URL:** `/api/holidays`
- **Description:** Create holiday
- **Body:**
```json
{
  "name": "Republic Day",
  "date": "2024-01-26",
  "description": "Republic Day Holiday",
  "companyId": "companyId",
  "isActive": true
}
```

#### 9.4 Update Holiday
- **Method:** `PUT`
- **URL:** `/api/holidays/:id`
- **Description:** Update holiday
- **Body:**
```json
{
  "name": "Updated Republic Day",
  "date": "2024-01-26",
  "description": "Updated Republic Day Holiday",
  "isActive": true
}
```

#### 9.5 Delete Holiday
- **Method:** `DELETE`
- **URL:** `/api/holidays/:id`
- **Description:** Delete holiday

### 10. Announcement Management (5 APIs)

#### 10.1 Get Announcements by Company
- **Method:** `GET`
- **URL:** `/api/announcements/company/:companyId`
- **Description:** Get announcements by company

#### 10.2 Get Announcement by ID
- **Method:** `GET`
- **URL:** `/api/announcements/:id`
- **Description:** Get announcement by ID

#### 10.3 Create Announcement
- **Method:** `POST`
- **URL:** `/api/announcements`
- **Description:** Create announcement
- **Body:**
```json
{
  "title": "Important Announcement",
  "content": "This is an important announcement for all employees.",
  "companyId": "companyId",
  "priority": "high",
  "isActive": true
}
```

#### 10.4 Update Announcement
- **Method:** `PUT`
- **URL:** `/api/announcements/:id`
- **Description:** Update announcement
- **Body:**
```json
{
  "title": "Updated Important Announcement",
  "content": "This is an updated important announcement for all employees.",
  "priority": "medium",
  "isActive": true
}
```

#### 10.5 Delete Announcement
- **Method:** `DELETE`
- **URL:** `/api/announcements/:id`
- **Description:** Delete announcement

### 11. Company Management (3 APIs)

#### 11.1 Get Company Stats
- **Method:** `GET`
- **URL:** `/api/companies/stats`
- **Description:** Get company stats (super admin only)

#### 11.2 Get All Companies
- **Method:** `GET`
- **URL:** `/api/companies/all`
- **Description:** Get all companies (super admin only)

#### 11.3 Update Company Status
- **Method:** `PUT`
- **URL:** `/api/companies/:companyId/status`
- **Description:** Update company status (super admin only)
- **Body:**
```json
{
  "isActive": false
}
```

### 12. System Management (3 APIs)

#### 12.1 Get System Health
- **Method:** `GET`
- **URL:** `/api/system/health`
- **Description:** Get system health (super admin only)

#### 12.2 Get System Logs
- **Method:** `GET`
- **URL:** `/api/system/logs`
- **Description:** Get system logs (super admin only)

#### 12.3 Get Performance Metrics
- **Method:** `GET`
- **URL:** `/api/system/performance`
- **Description:** Get performance metrics (super admin only)

### 13. Additional Routes (2 APIs)

#### 13.1 Health Check
- **Method:** `GET`
- **URL:** `/health`
- **Description:** Server health check

#### 13.2 Serve Uploaded Files
- **Method:** `GET`
- **URL:** `/uploads/employees/:employeeId/:folder/:filename`
- **Description:** Serve uploaded employee files

## Summary

**Total APIs: 67**

- Authentication & User Management: 8 APIs
- Employee Management: 18 APIs
- Attendance Management: 8 APIs
- Leave Management: 8 APIs
- Regularization Management: 6 APIs
- Analytics: 6 APIs
- Department Management: 6 APIs
- Designation Management: 5 APIs
- Holiday Management: 5 APIs
- Announcement Management: 5 APIs
- Company Management: 3 APIs
- System Management: 3 APIs
- Additional Routes: 2 APIs

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Authentication

Most endpoints require authentication. After login, use the returned token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

## File Upload

For file upload endpoints, use `multipart/form-data` content type and include the files in the request body.
