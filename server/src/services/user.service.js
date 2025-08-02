const User = require('../models/user.model');
const Company = require('../models/company.model');
const { generateToken } = require('../utils/token.util');

class UserService {
  async login(email, password) {
    try {
      const user = await User.findOne({ email }).populate('company');
      
      if (!user || !user.isActive) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
        company: user.company?._id
      });
      
      return {
        user: user.toJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  async registerCompany(companyData, adminData) {
    try {
      // Create company first
      const company = new Company(companyData);
      await company.save();

      // Create admin user for the company
      const adminUser = new User({
        ...adminData,
        role: 'admin',
        company: company._id
      });
      await adminUser.save();

      return {
        company: company.toJSON(),
        admin: adminUser.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  async createSuperAdmin() {
    try {
      const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
      
      if (existingSuperAdmin) {
        return existingSuperAdmin;
      }

      const superAdmin = new User({
        name: 'Super Admin',
        email: 'admin@othtech.com',
        password: 'admin@123',
        role: 'super_admin',
        phone: '+91-9999999999'
      });

      await superAdmin.save();
      return superAdmin;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByCompany(companyId) {
    try {
      return await User.find({ company: companyId }).populate('company');
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId, 
        updateData, 
        { new: true, runValidators: true }
      ).populate('company');
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deactivateUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllCompanies() {
    try {
      return await Company.find({ isActive: true });
    } catch (error) {
      throw error;
    }
  }

  async getCompanyById(companyId) {
    try {
      return await Company.findById(companyId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService(); 