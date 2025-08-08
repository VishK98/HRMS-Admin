# HRMS API Documentation - Complete Collection

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require Bearer token authentication:
```
Authorization: Bearer <your_token>
```

---

## 🔐 Authentication & User Management

### Public Endpoints

#### 1. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### 2. Initialize Super Admin (First-time setup)
```http
POST /auth/init-super-admin
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "superadmin@hrms.com",
  "password": "superadmin123"
}
```

### Protected Endpoints

#### 3. Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

#### 4. Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210"
}
```

### Super Admin Only Endpoints

#### 5. Register Company
```http
POST /auth/register-company
Authorization: Bearer <super_admin_token>
Content-Type: application/json

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
  "adminName": "Admin User",
  "adminEmail": "admin@testcompany.com",
  "adminPassword": "password123",
  "adminPhone": "9876543210"
}
```

#### 6. Get All Companies
```http
GET /auth/companies
Authorization: Bearer <super_admin_token>
```

#### 7. Get Company by ID
```http
GET /auth/companies/:companyId
Authorization: Bearer <super_admin_token>
```

#### 8. Get Users by Company
```http
GET /auth/companies/:companyId/users
Authorization: Bearer <super_admin_token>
```

#### 9. Get User Stats
```http
GET /auth/stats
Authorization: Bearer <super_admin_token>
```

#### 10. Get All Users
```http
GET /auth/all
Authorization: Bearer <super_admin_token>
```

---

## 👥 Employee Management

### Public Endpoints

#### 11. Register Employee
```http
POST /employees/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "email": "john.doe@company.com",
  "phone": "9876543210",
  "companyId": "company_id_here",
  "password": "password123"
}
```

#### 12. Employee Login
```http
POST /employees/login
Content-Type: application/json

{
  "email": "john.doe@company.com",
  "password": "password123"
}
```

### Protected Endpoints

#### 13. Get Employee Profile
```http
GET /employees/profile
Authorization: Bearer <token>
```

### Admin Only Endpoints

#### 14. Get Employees by Company
```http
GET /employees/company/:companyId
Authorization: Bearer <admin_token>
```

#### 15. Get Employee by ID
```http
GET /employees/:employeeId
Authorization: Bearer <admin_token>
```

#### 16. Update Employee Profile
```http
PUT /employees/profile/:employeeId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "department": "IT",
  "designation": "Software Engineer",
  "joiningDate": "2024-01-01",
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
    "branch": "Main Branch"
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

#### 17. Deactivate Employee
```http
PUT /employees/:employeeId/deactivate
Authorization: Bearer <admin_token>
```

#### 18. Get Employee Stats
```http
GET /employees/company/:companyId/stats
Authorization: Bearer <admin_token>
```

#### 19. Upload Employee Documents
```http
POST /employees/:employeeId/documents/upload
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- aadhar: [file]
- pan: [file]
- passportPhoto: [file]
```

#### 20. Upload Education Documents
```http
POST /employees/:employeeId/education/upload
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- intermediate: [file]
- undergraduate: [file]
- postgraduate: [file]
```

#### 21. Upload Single Document
```http
POST /employees/:employeeId/documents/:documentType
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- document: [file]
```

#### 22. Delete Document
```http
DELETE /employees/:employeeId/documents/:documentType
Authorization: Bearer <admin_token>
```

---

## ⏰ Attendance Management

### Protected Endpoints

#### 23. Check In
```http
POST /attendance/check-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": "employee_id_here",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "Office Location"
  }
}
```

#### 24. Check Out
```http
POST /attendance/check-out
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": "employee_id_here",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "Office Location"
  }
}
```

#### 25. Get Employee Attendance
```http
GET /attendance/employee/:employeeId?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### 26. Get Company Attendance
```http
GET /attendance/company?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### 27. Get Attendance Summary
```http
GET /attendance/summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

#### 28. Get Today's Attendance
```http
GET /attendance/today/:employeeId
Authorization: Bearer <token>
```

### Admin Only Endpoints

#### 29. Update Attendance
```http
PUT /attendance/:attendanceId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "checkIn": "2024-01-01T09:00:00.000Z",
  "checkOut": "2024-01-01T18:00:00.000Z",
  "status": "present"
}
```

#### 30. Delete Attendance
```http
DELETE /attendance/:attendanceId
Authorization: Bearer <admin_token>
```

---

## 🏖️ Leave Management

### Protected Endpoints

#### 31. Create Leave Request
```http
POST /leave/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": "employee_id_here",
  "leaveType": "annual",
  "startDate": "2024-01-15",
  "endDate": "2024-01-17",
  "reason": "Personal leave",
  "days": 3
}
```

#### 32. Get Leave Requests
```http
GET /leave/requests?status=pending&limit=10
Authorization: Bearer <token>
```

#### 33. Get Leave Request by ID
```http
GET /leave/requests/:leaveId
Authorization: Bearer <token>
```

#### 34. Update Leave Status
```http
PUT /leave/requests/:leaveId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "comments": "Approved by manager"
}
```

#### 35. Update Manager Action
```http
PUT /leave/requests/:leaveId/manager-action
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "approved",
  "comment": "Approved by manager"
}
```

#### 36. Update Leave Request
```http
PUT /leave/requests/:leaveId
Authorization: Bearer <token>
Content-Type: application/json

{
  "startDate": "2024-01-20",
  "endDate": "2024-01-22",
  "reason": "Updated reason",
  "days": 3
}
```

#### 37. Delete Leave Request
```http
DELETE /leave/requests/:leaveId
Authorization: Bearer <token>
```

#### 38. Get Employee Leave Requests
```http
GET /leave/requests/employee/:employeeId?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### 39. Get Leave Summary
```http
GET /leave/summary?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

---

## 📝 Regularization Management

### Admin Only Endpoints

#### 40. Create Regularization Request
```http
POST /regularization/requests
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "employeeId": "employee_id_here",
  "date": "2024-01-15",
  "reason": "Late arrival due to traffic"
}
```

#### 41. Get Employee Regularization Requests
```http
GET /regularization/requests/employee/:employeeId
Authorization: Bearer <admin_token>
```

#### 42. Get Company Regularization Requests
```http
GET /regularization/requests/company
Authorization: Bearer <admin_token>
```

#### 43. Get Regularization Request by ID
```http
GET /regularization/requests/:requestId
Authorization: Bearer <admin_token>
```

#### 44. Update Regularization Status
```http
PUT /regularization/requests/:requestId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "approved",
  "comments": "Approved by manager"
}
```

#### 45. Delete Regularization Request
```http
DELETE /regularization/requests/:requestId
Authorization: Bearer <admin_token>
```

---

## 🏢 Company Management

### Super Admin Only Endpoints

#### 46. Get Company Stats
```http
GET /companies/stats
Authorization: Bearer <super_admin_token>
```

#### 47. Get All Companies
```http
GET /companies/all
Authorization: Bearer <super_admin_token>
```

#### 48. Update Company Status
```http
PUT /companies/:companyId/status
Authorization: Bearer <super_admin_token>
Content-Type: application/json

{
  "isActive": true
}
```

#### 49. Debug Employee Company Relations
```http
GET /companies/debug/employee-relations
Authorization: Bearer <super_admin_token>
```

---

## 📊 Analytics

### Admin & Super Admin Endpoints

#### 50. Get Analytics Overview
```http
GET /analytics/overview?timeRange=7d
Authorization: Bearer <token>
```

#### 51. Get User Analytics
```http
GET /analytics/users?timeRange=7d
Authorization: Bearer <token>
```

#### 52. Get Company Analytics
```http
GET /analytics/companies?timeRange=7d
Authorization: Bearer <token>
```

#### 53. Get System Analytics
```http
GET /analytics/system?timeRange=7d
Authorization: Bearer <token>
```

#### 54. Get Activity Analytics
```http
GET /analytics/activities?timeRange=7d
Authorization: Bearer <token>
```

#### 55. Get Comprehensive Analytics
```http
GET /analytics/comprehensive?timeRange=7d
Authorization: Bearer <token>
```

---

## 🏗️ Department Management

### Protected Endpoints

#### 56. Get Departments by Company
```http
GET /departments/company/:companyId
Authorization: Bearer <token>
```

#### 57. Get Department by ID
```http
GET /departments/:id
Authorization: Bearer <token>
```

#### 58. Create Department
```http
POST /departments
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "IT Department",
  "description": "Information Technology Department",
  "companyId": "company_id_here"
}
```

#### 59. Update Department
```http
PUT /departments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated IT Department",
  "description": "Updated description"
}
```

#### 60. Delete Department
```http
DELETE /departments/:id
Authorization: Bearer <token>
```

#### 61. Add Subcategory to Department
```http
POST /departments/:id/subcategories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Software Development",
  "description": "Software development team"
}
```

---

## 👔 Designation Management

### Protected Endpoints

#### 62. Get Designations by Company
```http
GET /designations/company/:companyId
Authorization: Bearer <token>
```

#### 63. Get Designation by ID
```http
GET /designations/:id
Authorization: Bearer <token>
```

#### 64. Create Designation
```http
POST /designations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Software Engineer",
  "description": "Software development role",
  "companyId": "company_id_here"
}
```

#### 65. Update Designation
```http
PUT /designations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Senior Software Engineer",
  "description": "Updated description"
}
```

#### 66. Delete Designation
```http
DELETE /designations/:id
Authorization: Bearer <token>
```

---

## 🎉 Holiday Management

### Protected Endpoints

#### 67. Get Holidays by Company
```http
GET /holidays/company/:companyId
Authorization: Bearer <token>
```

#### 68. Get Holiday by ID
```http
GET /holidays/:id
Authorization: Bearer <token>
```

#### 69. Create Holiday
```http
POST /holidays
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Republic Day",
  "date": "2024-01-26",
  "description": "National holiday",
  "companyId": "company_id_here"
}
```

#### 70. Update Holiday
```http
PUT /holidays/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Republic Day",
  "date": "2024-01-26",
  "description": "Updated description"
}
```

#### 71. Delete Holiday
```http
DELETE /holidays/:id
Authorization: Bearer <token>
```

---

## 📢 Announcement Management

### Protected Endpoints

#### 72. Get Announcements by Company
```http
GET /announcements/company/:companyId
Authorization: Bearer <token>
```

#### 73. Get Announcement by ID
```http
GET /announcements/:id
Authorization: Bearer <token>
```

#### 74. Create Announcement
```http
POST /announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Important Announcement",
  "content": "This is an important announcement for all employees",
  "companyId": "company_id_here",
  "priority": "high"
}
```

#### 75. Update Announcement
```http
PUT /announcements/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Announcement",
  "content": "Updated content",
  "priority": "medium"
}
```

#### 76. Delete Announcement
```http
DELETE /announcements/:id
Authorization: Bearer <token>
```

---

## 🖥️ System Management

### Super Admin Only Endpoints

#### 77. Get System Health
```http
GET /system/health
Authorization: Bearer <super_admin_token>
```

#### 78. Get System Logs
```http
GET /system/logs
Authorization: Bearer <super_admin_token>
```

#### 79. Get Performance Metrics
```http
GET /system/performance
Authorization: Bearer <super_admin_token>
```

---

## 📈 Activity Management

### Protected Endpoints

#### 80. Get Super Admin Activities
```http
GET /activities/super-admin?timeRange=7d
Authorization: Bearer <super_admin_token>
```

#### 81. Get Admin Activities
```http
GET /activities/admin?timeRange=7d
Authorization: Bearer <admin_token>
```

#### 82. Get Activity Stats
```http
GET /activities/stats?timeRange=7d
Authorization: Bearer <token>
```

#### 83. Log Activity (Internal)
```http
POST /activities/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "User logged in",
  "userId": "user_id_here",
  "companyId": "company_id_here",
  "type": "login"
}
```

---

## 🎛️ Admin Dashboard

### Admin Only Endpoints

#### 84. Get Employees by Company (Admin Dashboard)
```http
GET /admin/employees/company/:companyId?page=1&limit=10&status=active
Authorization: Bearer <admin_token>
```

#### 85. Get Attendance Summary (Admin Dashboard)
```http
GET /admin/attendance/summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>
```

#### 86. Get Leave Requests (Admin Dashboard)
```http
GET /admin/leave/requests?status=pending&limit=5
Authorization: Bearer <admin_token>
```

#### 87. Get Activity Analytics (Admin Dashboard)
```http
GET /admin/analytics/activities?timeRange=7d
Authorization: Bearer <admin_token>
```

#### 88. Get Company Stats (Admin Dashboard)
```http
GET /admin/company/stats
Authorization: Bearer <admin_token>
```

#### 89. Get Leave Status Today (Admin Dashboard)
```http
GET /admin/leave/status/today
Authorization: Bearer <admin_token>
```

---

## 🔧 Health Check

### Public Endpoint

#### 90. Health Check
```http
GET /health
```

---

## Summary

This documentation covers **90 API endpoints** across all sections of the HRMS system:

- **Authentication & User Management**: 10 endpoints
- **Employee Management**: 12 endpoints
- **Attendance Management**: 8 endpoints
- **Leave Management**: 9 endpoints
- **Regularization Management**: 6 endpoints
- **Company Management**: 4 endpoints
- **Analytics**: 6 endpoints
- **Department Management**: 6 endpoints
- **Designation Management**: 5 endpoints
- **Holiday Management**: 5 endpoints
- **Announcement Management**: 5 endpoints
- **System Management**: 3 endpoints
- **Activity Management**: 4 endpoints
- **Admin Dashboard**: 6 endpoints
- **Health Check**: 1 endpoint

All endpoints are properly categorized by access level (Public, Protected, Admin Only, Super Admin Only) and include proper authentication requirements.
