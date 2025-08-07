# Admin Dashboard Troubleshooting Guide

## 🚨 Current Issue: "Route not found" Error

### Problem Analysis
The error shows that the admin dashboard routes are returning "Route not found" (404 error). This indicates that the routes are not being properly registered or there's an authentication issue.

### 🔧 Step-by-Step Fix

#### 1. **Verify Server is Running**
```bash
cd server
npm run dev
```
Check that the server starts without errors and shows:
```
Loading routes...
Admin Dashboard routes loaded: true
```

#### 2. **Test Admin Routes**
```bash
cd server
npm run test:admin
```
This will test if the admin routes are accessible and properly protected.

#### 3. **Check Authentication**
The admin dashboard requires:
- Valid JWT token in Authorization header
- Admin role permissions
- User must have a companyId

#### 4. **Verify User Data**
Make sure your user object has:
```javascript
{
  id: "user_id",
  companyId: "company_id", // or company: { _id: "company_id" }
  role: "admin"
}
```

#### 5. **Seed Test Data**
```bash
cd server
npm run seed:admin
```
This creates:
- Test company with ID
- 5 test employees
- Attendance records
- Leave requests

#### 6. **Check Browser Console**
Look for these specific errors:
- `No company ID found for user`
- `Company ID is required for getEmployeesByCompany`
- `Route not found`

### 🔍 Debug Steps

#### Step 1: Check Server Logs
```bash
# In server terminal, look for:
console.log("Admin Dashboard routes loaded:", !!adminDashboardRoutes);
```

#### Step 2: Test Individual Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test admin routes (should return 401 without auth)
curl http://localhost:5000/api/admin/test
```

#### Step 3: Check Authentication Token
In browser console:
```javascript
// Check if token exists
localStorage.getItem('hrms_token')

// Check user data
// Look at the user object in React DevTools
```

### 🛠️ Common Fixes

#### Fix 1: Missing Company ID
If you see "No company ID found for user":
```javascript
// In AdminDashboard.tsx, add this check:
const companyId = user?.companyId || user?.company?._id;
if (!companyId) {
  console.error("No company ID found for user:", user);
  setError("User company information not found");
  return;
}
```

#### Fix 2: Authentication Issues
If you see 401 errors:
1. Make sure you're logged in as admin
2. Check if the JWT token is valid
3. Verify the user has admin role

#### Fix 3: Route Registration Issues
If routes are not found:
1. Check that `admin-dashboard.routes.js` exists
2. Verify it's imported in `app.js`
3. Ensure it's registered with `app.use("/api/admin", adminDashboardRoutes)`

### 📊 Expected Data Structure

After seeding, you should have:
```javascript
// Company
{
  _id: "company_id",
  name: "Test Company",
  isActive: true
}

// Employees
[
  {
    _id: "employee_id_1",
    firstName: "John",
    lastName: "Doe",
    company: "company_id",
    status: "active"
  }
  // ... 4 more employees
]

// Attendance Records
[
  {
    employee: "employee_id_1",
    company: "company_id",
    checkIn: "2025-08-07T09:00:00Z",
    status: "present"
  }
  // ... more records
]
```

### 🎯 Quick Test Commands

#### Test Server Health
```bash
curl http://localhost:5000/health
```

#### Test Admin Routes (without auth)
```bash
curl http://localhost:5000/api/admin/test
# Should return 401 Unauthorized
```

#### Test with Valid Token
```bash
# Get token from browser localStorage
TOKEN="your_jwt_token_here"
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/admin/test
```

### 🔄 Complete Reset Process

If nothing works, try this complete reset:

1. **Stop all servers**
2. **Clear database** (if using local MongoDB):
   ```bash
   mongo
   use hrms
   db.dropDatabase()
   exit
   ```
3. **Restart server**:
   ```bash
   cd server
   npm run dev
   ```
4. **Seed fresh data**:
   ```bash
   npm run seed:admin
   ```
5. **Restart client**:
   ```bash
   cd client
   npm run dev
   ```
6. **Login as admin user**
7. **Access admin dashboard**

### 📝 Debug Checklist

- [ ] Server is running on port 5000
- [ ] MongoDB is connected
- [ ] Admin routes are loaded (check server logs)
- [ ] User is logged in with admin role
- [ ] User has companyId
- [ ] JWT token is valid
- [ ] Test data is seeded
- [ ] No CORS issues
- [ ] Network requests are reaching server

### 🆘 Still Having Issues?

If the problem persists:

1. **Check server logs** for detailed error messages
2. **Verify MongoDB connection** in server logs
3. **Test individual API endpoints** using Postman or curl
4. **Check browser network tab** for failed requests
5. **Verify environment variables** are set correctly

### 📞 Support Information

When reporting issues, include:
- Server logs
- Browser console errors
- Network tab requests
- User authentication status
- Database connection status

---

**Remember**: The admin dashboard requires proper authentication and company data to function correctly. Make sure all prerequisites are met before testing.
