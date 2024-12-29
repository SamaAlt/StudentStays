//backend/app.js

const express = require('express');
require('express-async-errors');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { environment } = require('./config');
const { ValidationError } = require('sequelize');

const isProduction = environment === 'production';

const app = express();

// Middleware setup
app.use(morgan('dev')); // Logging should be first
app.use(cookieParser()); // Parse cookies before CSRF
app.use(express.json()); // Parse JSON request bodies

// Security Middleware
if (!isProduction) {
  // Enable CORS only in development
  app.use(cors());
}

// Helmet setup for security
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);

// CSRF Protection
app.use(
  csurf({
    cookie: {
      secure: isProduction, // Enable secure cookies only in production
      sameSite: isProduction ? 'Lax' : 'Strict',
      httpOnly: true,
    },
  })
);

// Routes
app.use(routes); // This will use the routes defined in routes/index.js

// Catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = 'Resource Not Found';
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Error formatter for Sequelize and general errors
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
