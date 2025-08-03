const { authenticate } = require('./src/middlewares/auth.middleware');

console.log('Middleware imported successfully:', typeof authenticate);
console.log('Is function:', typeof authenticate === 'function'); 