const { validationResult } = require('express-validator');

// Validation middleware to check express-validator results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Custom validation for MongoDB ObjectId
const validateObjectId = (field = 'id') => {
  return (req, res, next) => {
    const mongoose = require('mongoose');
    const id = req.params[field];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${field} format`
      });
    }
    
    next();
  };
};

// Sanitize user input
const sanitizeInput = (req, res, next) => {
  // Remove any properties that start with '$' to prevent NoSQL injection
  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (key.startsWith('$')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitizeObject(obj[key]);
        }
      }
    }
  };
  
  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);
  
  next();
};

module.exports = {
  validate,
  validateObjectId,
  sanitizeInput
};