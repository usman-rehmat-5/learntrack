const ApiResponse = require('../utils/apiResponse');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('Unhandled Error:', err.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);
    }
    ApiResponse.error(res, 'Server Error');
  });
};

module.exports = asyncHandler;
