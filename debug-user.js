const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms');

const Employee = require('./src/models/employee.model');

async function checkUser() {
  try {
    console.log('Checking for user: contact@purplewave.in');
    
    const user = await Employee.findOne({ email: 'contact@purplewave.in' });
    
    if (user) {
      console.log('User found:', {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        company: user.company
      });
      
      // Test password comparison
      const isPasswordValid = await user.comparePassword('Admin@123');
      console.log('Password valid:', isPasswordValid);
      
    } else {
      console.log('User not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUser();
