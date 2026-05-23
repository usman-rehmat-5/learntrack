const { body, validationResult } = require('express-validator');

// Validation result check
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg
    });
  }
  next();
};

// Register validation
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Login validation
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Field validation
exports.fieldValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Field name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
];

// Track validation
exports.trackValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Track name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
];

// Course validation
exports.courseValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be 2-200 characters'),
  body('platform')
    .notEmpty().withMessage('Platform is required'),
];

// Quiz validation
exports.quizValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Quiz title is required'),
  body('questions')
    .isArray({ min: 1 }).withMessage('At least one question is required'),
];