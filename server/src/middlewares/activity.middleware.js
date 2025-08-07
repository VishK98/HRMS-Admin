const activityService = require("../services/activity.service");

class ActivityMiddleware {
  // Middleware to log activities for common actions
  static logActivity(action, type = "system") {
    return async (req, res, next) => {
      const originalSend = res.send;
      
      res.send = function(data) {
        // Log activity after successful response
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseData = JSON.parse(data);
            if (responseData.success) {
              // Extract relevant data for activity logging
              const companyId = req.user?.company?._id || req.user?.companyId || req.user?.company;
              const userId = req.user?._id;
              const employeeId = req.body?.employeeId || req.params?.employeeId;
              
              // Log the activity
              activityService.logActivity({
                action,
                type,
                userId,
                employeeId,
                companyId,
                metadata: {
                  method: req.method,
                  path: req.path,
                  ipAddress: req.ip,
                  userAgent: req.get('User-Agent')
                }
              }).catch(err => {
                console.error("Error logging activity:", err);
              });
            }
          } catch (error) {
            console.error("Error parsing response data for activity logging:", error);
          }
        }
        
        originalSend.call(this, data);
      };
      
      next();
    };
  }

  // Middleware to log employee-specific activities
  static logEmployeeActivity(action) {
    return async (req, res, next) => {
      const originalSend = res.send;
      
      res.send = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseData = JSON.parse(data);
            if (responseData.success && responseData.data) {
              const companyId = req.user?.company?._id || req.user?.companyId || req.user?.company;
              const userId = req.user?._id;
              const employeeId = responseData.data._id || req.body?.employeeId || req.params?.employeeId;
              
              if (employeeId) {
                activityService.logEmployeeActivity(
                  action,
                  employeeId,
                  companyId,
                  userId,
                  { 
                    method: req.method,
                    path: req.path 
                  }
                ).catch(err => {
                  console.error("Error logging employee activity:", err);
                });
              }
            }
          } catch (error) {
            console.error("Error parsing response data for employee activity logging:", error);
          }
        }
        
        originalSend.call(this, data);
      };
      
      next();
    };
  }

  // Middleware to log attendance activities
  static logAttendanceActivity(action) {
    return async (req, res, next) => {
      const originalSend = res.send;
      
      res.send = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseData = JSON.parse(data);
            if (responseData.success && responseData.data) {
              const companyId = req.user?.company?._id || req.user?.companyId || req.user?.company;
              const userId = req.user?._id;
              const employeeId = req.body?.employeeId || req.params?.employeeId;
              
              if (employeeId) {
                activityService.logAttendanceActivity(
                  action,
                  employeeId,
                  companyId,
                  userId,
                  { 
                    method: req.method,
                    path: req.path,
                    location: req.body?.location ? "with location" : "without location"
                  }
                ).catch(err => {
                  console.error("Error logging attendance activity:", err);
                });
              }
            }
          } catch (error) {
            console.error("Error parsing response data for attendance activity logging:", error);
          }
        }
        
        originalSend.call(this, data);
      };
      
      next();
    };
  }

  // Middleware to log leave activities
  static logLeaveActivity(action) {
    return async (req, res, next) => {
      const originalSend = res.send;
      
      res.send = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseData = JSON.parse(data);
            if (responseData.success && responseData.data) {
              const companyId = req.user?.company?._id || req.user?.companyId || req.user?.company;
              const userId = req.user?._id;
              const employeeId = req.body?.employeeId || responseData.data?.employeeId || req.params?.employeeId;
              
              if (employeeId) {
                activityService.logLeaveActivity(
                  action,
                  employeeId,
                  companyId,
                  userId,
                  { 
                    method: req.method,
                    path: req.path,
                    leaveType: req.body?.leaveType || responseData.data?.leaveType,
                    status: responseData.data?.status
                  }
                ).catch(err => {
                  console.error("Error logging leave activity:", err);
                });
              }
            }
          } catch (error) {
            console.error("Error parsing response data for leave activity logging:", error);
          }
        }
        
        originalSend.call(this, data);
      };
      
      next();
    };
  }

  // Middleware to log company activities
  static logCompanyActivity(action) {
    return async (req, res, next) => {
      const originalSend = res.send;
      
      res.send = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const responseData = JSON.parse(data);
            if (responseData.success && responseData.data) {
              const companyId = responseData.data._id || req.body?.companyId || req.params?.companyId;
              const userId = req.user?._id;
              
              if (companyId) {
                activityService.logCompanyActivity(
                  action,
                  companyId,
                  userId,
                  { 
                    method: req.method,
                    path: req.path 
                  }
                ).catch(err => {
                  console.error("Error logging company activity:", err);
                });
              }
            }
          } catch (error) {
            console.error("Error parsing response data for company activity logging:", error);
          }
        }
        
        originalSend.call(this, data);
      };
      
      next();
    };
  }
}

module.exports = ActivityMiddleware;
