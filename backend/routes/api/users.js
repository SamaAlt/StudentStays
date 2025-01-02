//backend/routes/api/users.js

const express = require('express');
const router = express.Router();
const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// Validate user input
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a first name.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a last name.'),
];

// POST /api/users - Sign up a new user
router.post(
  '/',
  [...validateSignup, handleValidationErrors],
  async (req, res, next) => {
    const { email, username, password, firstName, lastName } = req.body;

    try {
      // Check for existing user
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        const errors = {};

        if (existingUser.email === email) {
          errors.email = 'User already exists with the specified email';
        }
        if (existingUser.username === username) {
          errors.username = 'User already exists with the specified username';
        }

        // Simulating a `500` error when duplicates are detected for test compliance
        const error = new Error('User already exists');
        error.status = 500; // Set the status code for testing compliance
        error.errors = errors;
        throw error;
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        username,
        hashedPassword,
        firstName,
        lastName,
      });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.status(201).json({ user: safeUser });
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        // For validation issues, still return a 400 status
        const errors = err.errors.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        return res.status(400).json({
          message: 'Validation error',
          statusCode: 400,
          errors,
        });
      }

      if (err.status === 500) {
        // Simulated 500 response for duplicate user error as per test spec
        return res.status(500).json({
          message: 'Internal Server Error',
          errors: err.errors,
        });
      }

      console.error('Unexpected error:', err);
      return next(err);
    }
  }
);


// POST /api/users - Login a user
router.post(
  '/login',
  [
    check('credential').exists({ checkFalsy: true }).withMessage('Email or username is required'),
    check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
  ],
  async (req, res, next) => {
    const { credential, password } = req.body;
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors.array().forEach(error => errors[error.path] = error.msg);
      return res.status(400).json({ message: 'Validation error', statusCode: 400, errors });
    }

    try {
      // Check if credential is an email or username
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: credential }, { username: credential }]
        }
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate the JWT token and set the cookie
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      const token = await setTokenCookie(res, safeUser);

      // Respond with the user info (without password)
      return res.status(200).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        }
      });

    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

module.exports = router;