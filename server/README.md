# HRMS Admin Server

A Node.js Express server with MongoDB for the HRMS Admin application.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Management**: Super admin and company admin roles
- **Company Management**: Register and manage companies
- **Security**: Password hashing, JWT tokens, input validation
- **Database**: MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   - Copy `env.example` to `.env`
   - Update the MongoDB URI and other configuration:
   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/othtech-hrms
   MONGO_DB=othtech-hrms
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)

### Company Management (Super Admin Only)
- `POST /api/auth/register-company` - Register new company with admin
- `GET /api/auth/companies` - Get all companies
- `GET /api/auth/companies/:companyId` - Get company by ID
- `GET /api/auth/companies/:companyId/users` - Get users by company

## Database Models

### User Model
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: 'super_admin' or 'admin'
- `company`: Reference to company (for admin users)
- `phone`: Phone number
- `isActive`: Account status
- `lastLogin`: Last login timestamp

### Company Model
- `name`: Company name
- `code`: Unique company code
- `email`: Company email
- `phone`: Company phone
- `address`: Full address object
- `website`: Company website
- `industry`: Industry type
- `employeeCount`: Number of employees
- `isActive`: Company status
- `subscription`: Subscription details

## Default Super Admin

The server automatically creates a super admin account on startup:
- **Email**: admin@othtech.com
- **Password**: admin@123

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS configuration
- Helmet security headers
- Role-based access control

## Development

The server runs on `http://localhost:5000` by default.

### Health Check
- `GET /health` - Server health status

### API Base URL
- `http://localhost:5000/api`

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## Success Responses

Successful API calls return:
```json
{
  "success": true,
  "message": "Success message",
  "data": {} // Response data
}
``` 