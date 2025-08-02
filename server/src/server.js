const app = require('./app');
const userService = require('./services/user.service');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Create super admin on server start
    await userService.createSuperAdmin();
    console.log('Super admin created/verified successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 