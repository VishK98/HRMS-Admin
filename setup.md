# HRMS Admin Setup Guide

This guide will help you set up the complete HRMS Admin application with both client and server components.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## Quick Setup

### 1. Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your MongoDB credentials
# Update MONGO_URI, JWT_SECRET, etc.

# Start the server
npm run dev
```

### 2. Client Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start the client
npm run dev
```

## Environment Configuration

### Server (.env)
```env
MONGO_URI=mongodb+srv://visheshkumar41:SQBerNc12VOlAsWC@cluster0.d41dp.mongodb.net/othtech-hrms?retryWrites=true&w=majority&appName=Cluster0
MONGO_DB=othtech-hrms
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=HRMS Admin
```

## Default Credentials

### Super Admin
- **Email**: admin@othtech.com
- **Password**: admin@123

## Features

### Server Features
- ✅ JWT Authentication
- ✅ Role-based access control (Super Admin, Admin)
- ✅ Company registration and management
- ✅ User management
- ✅ Password hashing with bcrypt
- ✅ Input validation
- ✅ CORS configuration
- ✅ Security headers

### Client Features
- ✅ Modern React with TypeScript
- ✅ Beautiful UI with shadcn/ui
- ✅ Responsive design
- ✅ Real-time API integration
- ✅ Company registration form
- ✅ Companies list view
- ✅ Dashboard with statistics

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Company Management (Super Admin Only)
- `POST /api/auth/register-company` - Register new company
- `GET /api/auth/companies` - Get all companies
- `GET /api/auth/companies/:companyId` - Get company by ID
- `GET /api/auth/companies/:companyId/users` - Get users by company

## Database Models

### User Model
- name, email, password, role, company, phone, isActive, lastLogin

### Company Model
- name, code, email, phone, address, website, industry, employeeCount, isActive, subscription

## Development

### Server
- Runs on: http://localhost:5000
- Health check: http://localhost:5000/health
- API base: http://localhost:5000/api

### Client
- Runs on: http://localhost:5173 (Vite default)
- Connects to server API automatically

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URI in server/.env
   - Ensure network access is enabled for your IP

2. **CORS Error**
   - Server is configured to allow localhost:3000 and localhost:5173
   - Check client environment variables

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in server/.env
   - Check token expiration (24 hours default)

4. **Port Conflicts**
   - Server runs on port 5000 by default
   - Client runs on port 5173 by default
   - Change ports in respective .env files if needed

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting for production
- Add proper error logging
- Consider using environment-specific configurations

## Next Steps

1. Add more features like employee management
2. Implement file upload for company logos
3. Add email notifications
4. Create admin dashboard for company admins
5. Add reporting and analytics
6. Implement subscription management 