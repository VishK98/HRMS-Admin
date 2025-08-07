const os = require("os");
const mongoose = require("mongoose");

class SystemController {
  // Get system health for super admin
  async getSystemHealth(req, res) {
    try {
      // Get CPU usage
      const cpuUsage = os.loadavg()[0] * 100; // 1 minute average

      // Get memory usage
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;

      // Get disk usage (simplified - would need a proper disk usage library in production)
      const diskUsage = 32; // Placeholder - in production use a library like 'diskusage'

      // Get network usage (simplified)
      const networkUsage = 85; // Placeholder - in production use network monitoring

      // Get database connection status
      const dbStatus =
        mongoose.connection.readyState === 1 ? "connected" : "disconnected";

      // Get system uptime
      const uptime = os.uptime();

      // Get system info
      const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: {
          total: totalMemory,
          free: freeMemory,
          used: totalMemory - freeMemory,
        },
      };

      const healthData = {
        cpu: Math.round(cpuUsage),
        memory: Math.round(memoryUsage),
        disk: diskUsage,
        network: networkUsage,
        database: dbStatus,
        uptime: Math.round(uptime / 3600), // in hours
        systemInfo,
      };

      res.status(200).json({
        success: true,
        data: healthData,
      });
    } catch (error) {
      console.error("Error in getSystemHealth:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch system health",
      });
    }
  }

  // Get system logs (simplified)
  async getSystemLogs(req, res) {
    try {
      // In production, this would fetch from actual log files
      const logs = [
        {
          timestamp: new Date().toISOString(),
          level: "INFO",
          message: "System health check completed",
        },
        {
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: "INFO",
          message: "Database connection stable",
        },
        {
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: "WARN",
          message: "High memory usage detected",
        },
      ];

      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      console.error("Error in getSystemLogs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch system logs",
      });
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(req, res) {
    try {
      const metrics = {
        responseTime: 120, // ms
        requestsPerSecond: 45,
        errorRate: 0.1, // percentage
        activeConnections: 25,
        databaseQueries: 150,
        cacheHitRate: 85, // percentage
      };

      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error("Error in getPerformanceMetrics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch performance metrics",
      });
    }
  }
}

module.exports = new SystemController();
