const Attendance = require("../models/attendance.model");
const Employee = require("../models/employee.model");

class AttendanceService {
  // Check in an employee
  async checkIn(employeeId, companyId, location = null) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if employee already has an attendance record for today
      let attendance = await Attendance.findOne({
        employee: employeeId,
        date: today,
        company: companyId,
      });

      if (attendance && attendance.checkIn) {
        throw new Error("Employee already checked in today");
      }

      const checkInTime = new Date();

      if (!attendance) {
        // Create new attendance record
        attendance = new Attendance({
          employee: employeeId,
          date: today,
          checkIn: checkInTime,
          company: companyId,
          status: "present",
          checkInLocation: location,
        });
      } else {
        // Update existing record
        attendance.checkIn = checkInTime;
        if (location) {
          attendance.checkInLocation = location;
        }
      }

      await attendance.save();
      return attendance;
    } catch (error) {
      throw error;
    }
  }

  // Check out an employee
  async checkOut(employeeId, companyId, location = null) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find today's attendance record
      const attendance = await Attendance.findOne({
        employee: employeeId,
        date: today,
        company: companyId,
      });

      if (!attendance) {
        throw new Error("No check-in record found for today");
      }

      if (attendance.checkOut) {
        throw new Error("Employee already checked out today");
      }

      const checkOutTime = new Date();
      attendance.checkOut = checkOutTime;

      // Save check-out location if provided
      if (location) {
        attendance.checkOutLocation = location;
      }

      // Calculate working hours
      if (attendance.checkIn) {
        const workingHours =
          (checkOutTime - attendance.checkIn) / (1000 * 60 * 60); // in hours
        attendance.workingHours = parseFloat(workingHours.toFixed(2));

        // Calculate overtime (assuming 8 hours workday)
        const overtime = workingHours - 8;
        attendance.overtime =
          overtime > 0 ? parseFloat(overtime.toFixed(2)) : 0;
      }

      await attendance.save();
      return attendance;
    } catch (error) {
      throw error;
    }
  }

  // Get employee attendance for a specific date range
  async getEmployeeAttendance(employeeId, startDate, endDate) {
    try {
      const attendanceRecords = await Attendance.find({
        employee: employeeId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }).sort({ date: 1 });

      return attendanceRecords;
    } catch (error) {
      throw error;
    }
  }

  // Get company attendance for a date range
  async getCompanyAttendance(companyId, startDate, endDate, filters = {}) {
    try {
      const query = {
        company: companyId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };

      // Apply additional filters
      if (filters.employeeId) {
        query.employee = filters.employeeId;
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.department) {
        // This would require a join with employee data
        // For now, we'll filter after fetching
      }

      const attendanceRecords = await Attendance.find(query)
        .populate(
          "employee",
          "firstName lastName employeeId department designation"
        )
        .sort({ date: -1, employee: 1 });

      // Apply department filter if specified
      let filteredRecords = attendanceRecords;
      if (filters.department) {
        filteredRecords = attendanceRecords.filter(record => 
          record.employee.department && 
          record.employee.department.toLowerCase().includes(filters.department.toLowerCase())
        );
      }

      return filteredRecords;
    } catch (error) {
      throw error;
    }
  }

  // Get attendance summary for a specific period
  async getAttendanceSummary(companyId, startDate, endDate) {
    try {
      const summary = await Attendance.aggregate([
        {
          $match: {
            company: companyId,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get total working hours
      const totalHours = await Attendance.aggregate([
        {
          $match: {
            company: companyId,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalWorkingHours: { $sum: "$workingHours" },
            totalOvertime: { $sum: "$overtime" },
          },
        },
      ]);

      return {
        statusSummary: summary,
        totals: totalHours[0] || { totalWorkingHours: 0, totalOvertime: 0 },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get today's attendance status for an employee
  async getTodaysAttendance(employeeId, companyId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendance = await Attendance.findOne({
        employee: employeeId,
        date: today,
        company: companyId,
      });

      return attendance;
    } catch (error) {
      throw error;
    }
  }

  // Update attendance record (admin function)
  async updateAttendance(attendanceId, updateData) {
    try {
      const attendance = await Attendance.findByIdAndUpdate(
        attendanceId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!attendance) {
        throw new Error("Attendance record not found");
      }

      return attendance;
    } catch (error) {
      throw error;
    }
  }

  // Delete attendance record (admin function)
  async deleteAttendance(attendanceId) {
    try {
      const attendance = await Attendance.findByIdAndDelete(attendanceId);

      if (!attendance) {
        throw new Error("Attendance record not found");
      }

      return { message: "Attendance record deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AttendanceService();
