const Company = require("../models/company.model");
const Employee = require("../models/employee.model");
const activityService = require("../services/activity.service");

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

      // Calculate total revenue based on subscription plans
      const revenueByPlan = {
        basic: 999,
        premium: 1999,
        enterprise: 4999,
      };

      const companiesWithRevenue = await Company.aggregate([
        {
          $group: {
            _id: "$subscription.plan",
            count: { $sum: 1 },
          },
        },
      ]);

      let totalRevenue = 0;
      companiesWithRevenue.forEach((plan) => {
        const planRevenue = revenueByPlan[plan._id] || 0;
        totalRevenue += planRevenue * plan.count;
      });

      // Calculate average employees per company
      const totalEmployees = await Employee.countDocuments();
      const averageEmployees =
        totalCompanies > 0 ? totalEmployees / totalCompanies : 0;

      const stats = {
        totalCompanies,
        activeCompanies,
        totalRevenue,
        averageEmployees,
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
        .select(
          "name code email phone address website industry isActive subscription createdAt updatedAt"
        )
        .sort({ createdAt: -1 });

      // Calculate actual employee count for each company
      const companiesWithEmployeeCount = await Promise.all(
        companies.map(async (company) => {
          console.log(
            `Checking employees for company: ${company.name} (${company._id})`
          );
          const employeeCount = await Employee.countDocuments({
            company: company._id,
          });
          console.log(`Found ${employeeCount} employees for ${company.name}`);
          return {
            ...company.toObject(),
            employeeCount,
          };
        })
      );

      res.status(200).json({
        success: true,
        data: companiesWithEmployeeCount,
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

  // Debug method to check employee-company relationships
  async debugEmployeeCompanyRelations(req, res) {
    try {
      const companies = await Company.find().select("_id name code");
      const employees = await Employee.find().select(
        "_id firstName lastName company"
      );

      console.log("Companies:", companies);
      console.log("Employees:", employees);

      res.status(200).json({
        success: true,
        data: {
          companies,
          employees,
        },
      });
    } catch (error) {
      console.error("Error in debugEmployeeCompanyRelations:", error);
      res.status(500).json({
        success: false,
        message: "Failed to debug employee-company relations",
      });
    }
  }
}

module.exports = new CompanyController();
