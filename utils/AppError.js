class AppError extends Error {
    constructor(message = 'Something went wrong', statusCode) {
      super(message);
      
      if (!statusCode || typeof statusCode !== 'number') {
        throw new Error('StatusCode must be a number');
      }
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      // Create stack trace
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  