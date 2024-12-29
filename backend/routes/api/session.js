const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { setTokenCookie, restoreUser } = require('../../utils/auth');

const router = express.Router();

// GET /api/session - Get the current logged-in user
router.get('/', restoreUser, (req, res) => {
  if (req.user) {
    const { id, firstName, lastName, email, username } = req.user;
    return res.status(200).json({
      user: {
        id,
        firstName,
        lastName,
        email,
        username,
      },
    });
  } else {
    return res.status(200).json({ user: null });
  }
});

// POST /users - User Registration
router.post(
  '/users',
  [
    check('firstName').exists({ checkFalsy: true }).withMessage('First Name is required'),
    check('lastName').exists({ checkFalsy: true }).withMessage('Last Name is required'),
    check('email').isEmail().withMessage('Invalid email').exists({ checkFalsy: true }).withMessage('Email is required'),
    check('username').exists({ checkFalsy: true }).withMessage('Username is required').isLength({ min: 4 }).withMessage('Username must be at least 4 characters long'),
    check('password').exists({ checkFalsy: true }).withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res, next) => {
    const { firstName, lastName, email, username, password } = req.body;

    try {
      // 1. Check for duplicate user FIRST
      const existingUser = await User.unscoped().findOne({
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
          errors.username = 'User with that username already exists';
        }
        return res.status(400).json({ message: 'User already exists with the specified email or username', statusCode: 400, errors });
      }

      // 2. Handle validation errors
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors.array().forEach(error => errors[error.path] = error.msg);
        return res.status(400).json({ message: 'Validation error', statusCode: 400, errors });
      }

      // 3. Only create the user if both checks pass
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ firstName, lastName, email, username, hashedPassword });
      const safeUser = { id: newUser.id, email: newUser.email, username: newUser.username, firstName, lastName };
      await setTokenCookie(res, safeUser);
      return res.status(201).json({ user: safeUser });

    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

// POST /api/session - Log in a user
router.post(
  '/',
  [
    check('credential').exists({ checkFalsy: true }).withMessage('Email or username is required'),
    check('password').exists({ checkFalsy: true }).withMessage('Password is required'),
  ],
  async (req, res, next) => {
    const { credential, password } = req.body;

    // Validation errors check
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = {};
      validationErrors.array().forEach((error) => {
        errors[error.param] = error.msg;
      });
      return res.status(400).json({
        message: 'Bad Request',
        errors,
      });
    }

    try {
      // Find user by email or username
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: credential }, { username: credential }],
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if the password is valid
      const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Safe user object
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      // Set the token cookie
      await setTokenCookie(res, safeUser);

      return res.status(200).json({
        user: safeUser,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);


module.exports = router;
