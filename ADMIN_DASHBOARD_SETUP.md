# Admin Dashboard Setup Guide

## 🎯 Overview

The Admin Dashboard has been enhanced with dynamic data, real-time updates, and comprehensive analytics. This guide will help you set up and test the admin dashboard functionality.

## 🚀 Quick Setup

### 1. Start the Server

```bash
cd server
npm install
npm run dev
```

### 2. Seed Test Data

```bash
cd server
npm run seed:admin
```

This will create:
- A test company ("Test Company")
- 5 test employees with different departments
- Today's attendance records (4 present, 1 absent, 1 late)
- 3 leave requests (2 pending, 1 approved)

### 3. Start the Client

```bash
cd client
npm install
npm run dev
```

## 📊 Admin Dashboard Features

### Real-time Data
- **Employee Statistics**: Total employees, active employees, attendance rate
- **Attendance Overview**: Present, absent, late counts with visual progress bars
- **Leave Management**: Pending approvals with approve/reject functionality
- **Activity Feed**: Recent activities from employees and system

### API Endpoints Created

#### Admin Dashboard Routes (`/api/admin`)
- `GET /admin/employees/company/:companyId` - Get employees by company
- `GET /admin/attendance/summary` - Get attendance summary
- `GET /admin/leave/requests` - Get leave requests with filtering
- `GET /admin/analytics/activities` - Get recent activities
- `GET /admin/company/stats` - Get company statistics

### Reusable Components

#### UI Components
- `StatCard` - Statistics display with trends and loading states
- `ActivityItem` - Individual activity items with type-specific styling
- `ApprovalItem` - Leave approval items with action buttons
- `AttendanceOverview` - Comprehensive attendance statistics
- `DashboardLayout` - Reusable layout structure
- `ActivityFeed` - Complete activity feed with empty states
- `ApprovalList` - Approval management with action handlers
- `MetricChart` - Advanced metric display with trend indicators

## 🔧 Configuration

### Environment Variables

Make sure your `.env` file in the server directory contains:

```env
MONGODB_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### Authentication

The admin dashboard requires admin-level authentication. Make sure you're logged in as an admin user to access the dashboard.

## 📈 Dashboard Metrics

### Statistics Cards
1. **Total Employees** - Shows current employee count with monthly growth
2. **Present Today** - Real-time attendance with percentage
3. **Pending Leaves** - Leave requests awaiting approval
4. **Monthly Payroll** - Estimated monthly payroll calculation

### Attendance Overview
- Visual progress bar showing attendance rate
- Color-coded metrics (green for present, red for absent, yellow for late)
- Real-time updates

### Recent Activities
- Employee logins
- Leave request submissions
- Attendance check-ins
- System activities

## 🎨 UI Enhancements

### Consistent Design
- Matches SuperAdminDashboard styling
- Responsive design for all screen sizes
- Loading states with skeleton animations
- Error handling with retry mechanisms

### Interactive Elements
- Hover effects on cards
- Smooth transitions
- Color-coded badges for different activity types
- Action buttons for leave approvals

## 🧪 Testing

### Test Data Structure

After running the seed script, you'll have:

```
Test Company
├── John Doe (Engineering) - Present today
├── Jane Smith (Marketing) - Present today  
├── Mike Johnson (Sales) - Late today
├── Sarah Wilson (HR) - Present today
└── David Brown (Engineering) - Absent today
```

### Leave Requests
- John Doe: Sick leave (2 days) - Pending
- Jane Smith: Vacation (5 days) - Pending
- Mike Johnson: Personal (1 day) - Approved

## 🔄 Real-time Updates

The dashboard includes:
- Manual refresh button with loading animation
- Auto-refresh functionality
- Real-time clock display
- Dynamic greeting based on time of day

## 🛠️ Troubleshooting

### Common Issues

1. **"Failed to load dashboard data"**
   - Check if MongoDB is running
   - Verify server is started on port 5000
   - Ensure you're logged in as admin

2. **No data showing**
   - Run the seed script: `npm run seed:admin`
   - Check browser console for API errors
   - Verify authentication token

3. **API errors**
   - Check server logs for detailed error messages
   - Verify all required environment variables are set
   - Ensure database connection is working

### Debug Mode

Enable debug logging by adding to server `.env`:
```env
DEBUG=true
NODE_ENV=development
```

## 📝 API Documentation

### Authentication Required
All admin dashboard endpoints require:
- Valid JWT token in Authorization header
- Admin role permissions

### Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## 🚀 Next Steps

1. **Customize Data**: Modify the seed script to add your company's data
2. **Add Features**: Extend the dashboard with additional metrics
3. **Real-time Updates**: Implement WebSocket connections for live updates
4. **Export Functionality**: Add PDF/Excel export for reports
5. **Advanced Analytics**: Add charts and graphs for better visualization

## 📞 Support

If you encounter any issues:
1. Check the server logs for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running and accessible
4. Check browser console for client-side errors

---

**Happy Dashboarding! 🎉**
