const Company = require("../models/company.model");
const Employee = require("../models/employee.model");

class CompanyController {
  // Get company statistics for super admin
  async getCompanyStats(req, res) {
    try {
      // Get total companies
      const totalCompanies = await Company.countDocuments();
      
      // Get active companies
      const activeCompanies = await Company.countDocuments({ isActive: true });
      
      // Get companies by status
      const companiesByStatus = await Company.aggregate([
        {
          $group: {
            _id: "$isActive",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get recent companies (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentCompanies = await Company.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });

      // Get companies by plan type
      const companiesByPlan = await Company.aggregate([
        {
          $group: {
            _id: "$subscription.plan",
            count: { $sum: 1 },
          },
        },
      ]);

      const stats = {
        totalCompanies,
        activeCompanies,
        inactiveCompanies: totalCompanies - activeCompanies,
        recentCompanies,
        companiesByStatus,
        companiesByPlan,
      };

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getCompanyStats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch company statistics",
      });
    }
  }

  // Get all companies (for super admin)
  async getAllCompanies(req, res) {
    try {
      const companies = await Company.find()
        .select('name code isActive subscription.plan createdAt')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: companies,
      });
    } catch (error) {
      console.error("Error in getAllCompanies:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch companies",
      });
    }
  }

  // Update company status
  async updateCompanyStatus(req, res) {
    try {
      const { companyId } = req.params;
      const { isActive } = req.body;

      const company = await Company.findByIdAndUpdate(
        companyId,
        { isActive },
        { new: true }
      );

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Company status updated successfully",
        data: company,
      });
    } catch (error) {
      console.error("Error in updateCompanyStatus:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update company status",
      });
    }
  }
}

module.exports = new CompanyController(); 