# Analytics Updates - Real Data Integration

## Summary
Updated the analytics system to provide real data for both super admin and admin dashboards, focusing on company registrations for super admin and employee activities for admin users.

## Changes Made

### 1. Super Admin Dashboard Analytics (`server/src/controllers/analytics.controller.js`)

**Focus: Company Registrations and System-Wide Activities**

#### Real Activities Tracked:
- **New Company Registrations**: Shows when new companies register
- **Employee Registrations**: Across all companies
- **System-Wide Login Activities**: All employee logins
- **Leave Requests**: Across all companies
- **Attendance Check-ins**: Across all companies

#### Top Actions for Super Admin:
- New Company Registration
- New Employee Registration  
- User Login
- Leave Request
- Attendance Check-in

#### Key Features:
- Shows company codes and names
- Tracks activity across all companies
- Provides system-wide statistics
- Includes company status (Active/Inactive)

### 2. Admin Dashboard Analytics (`server/src/routes/admin-dashboard.routes.js`)

**Focus: Company-Specific Employee Activities**

#### Real Activities Tracked:
- **New Employee Registrations**: For the specific company
- **Employee Logins**: Company-specific login activities
- **Leave Requests**: Company-specific leave applications
- **Attendance Check-ins**: Company-specific attendance
- **Employee Profile Updates**: When profiles are modified
- **Document Uploads**: When documents are uploaded

#### Activity Statistics:
- New Employees count
- Employee Logins count
- Leave Requests count
- Attendance Check-ins count

#### Key Features:
- Company-specific data only
- Detailed employee information
- Activity timestamps
- Employee IDs and names

## API Endpoints

### Super Admin Analytics
```
GET /api/analytics/activities?timeRange=7d
```
**Response includes:**
- Recent company registrations
- System-wide employee activities
- Top actions across all companies
- Peak usage hours (system-wide)

### Admin Analytics
```
GET /api/admin/analytics/activities?timeRange=7d
```
**Response includes:**
- Company-specific employee activities
- Activity statistics for the company
- Recent employee registrations
- Company-specific login activities

## Data Structure

### Activity Object Structure:
```json
{
  "action": "New employee registered: John Doe",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "type": "employee",
  "user": "HR System",
  "company": "Purplewave Infocom Limited",
  "employeeId": "EMP2024001",
  "companyCode": "PWPL2007",
  "status": "active"
}
```

### Activity Types:
- `company`: Company registration activities
- `employee`: Employee registration and updates
- `user`: Login activities
- `leave`: Leave request activities
- `attendance`: Attendance check-in activities
- `document`: Document upload activities

## Time Ranges Supported:
- `1d`: Last 24 hours
- `7d`: Last 7 days (default)
- `30d`: Last 30 days

## Key Improvements

1. **Real Data Integration**: All analytics now use actual database data
2. **Role-Based Filtering**: Different data for super admin vs admin
3. **Company-Specific Views**: Admin users see only their company data
4. **Comprehensive Tracking**: Multiple activity types tracked
5. **Detailed Information**: Includes employee IDs, company codes, timestamps
6. **Error Handling**: Robust error handling for all database queries
7. **Performance Optimized**: Efficient queries with proper indexing

## Usage Examples

### Super Admin Dashboard:
- View all new company registrations
- Monitor system-wide employee activities
- Track growth across all companies
- Analyze system usage patterns

### Admin Dashboard:
- Monitor employee registrations for their company
- Track employee login activities
- View leave request patterns
- Monitor attendance trends
- Track document uploads

## Benefits

1. **Accurate Insights**: Real data provides accurate business insights
2. **Role-Based Access**: Appropriate data for each user role
3. **Performance**: Optimized queries for better performance
4. **Scalability**: Can handle large amounts of data efficiently
5. **Maintainability**: Clean, well-structured code
6. **Extensibility**: Easy to add new activity types
