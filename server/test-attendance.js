const express = require('express');
const app = require('./src/app');

const testApp = express();
testApp.use('/api', app._router);

// Simple test to verify routes are registered
const server = testApp.listen(0, () => {
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);
  
  // Test attendance routes
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: `/api${handler.route.path}`,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  console.log('Registered routes:');
  routes.forEach(route => {
    if (route.path.includes('attendance')) {
      console.log(`  ${route.methods.join(', ')} ${route.path}`);
    }
  });
  
  server.close();
});
