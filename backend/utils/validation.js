// backend/utils/validation.js

const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors.array().forEach((error) => {
      errors[error.path] = {
        message: error.msg,
        value: error.value, // Optional: Return the invalid value for debugging purposes
        location: error.location, // Optional: Specify the location of the error (e.g., body, query, params)
      };
    });

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    return next(err); // Pass the error to the next middleware (error handler)
  }
  next(); // Continue to the next middleware if there are no validation errors
};

module.exports = {
  handleValidationErrors,
};

