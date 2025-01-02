// backend/utils/validation.js
const { body, validationResult } = require('express-validator');

// Helper function for validating common spot fields
const validateSpot = () => {
  return [
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('name').isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
  ];
};

// Error handler function to send back errors
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors.array().forEach((error) => {
      errors[error.path] = {
        message: error.msg,
        value: error.value,
        location: error.location,
      };
    });

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    return next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors,
  validateSpot,
};
