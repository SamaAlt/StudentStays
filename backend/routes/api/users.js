// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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
  handleValidationErrors
];

// POST /api/users - Sign up a new user
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
      // Check if email or username already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        const err = new Error('User already exists');
        err.status = 400;
        err.errors = {
          email: 'User with this email already exists.',
          username: 'User with this username already exists.',
        };
        return next(err); // Return error if the user already exists
      }

      // Hash the user's password before saving it
      const hashedPassword = bcrypt.hashSync(password);

      // Create a new user
      const user = await User.create({
        email,
        username,
        hashedPassword,
      });

      // Prepare a safe user object (no password)
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      // Set the token cookie
      await setTokenCookie(res, safeUser);

      // Return the new user (without sensitive information like hashedPassword)
      return res.json({
        user: safeUser,
      });
    } catch (err) {
      console.error(err);
      next(err); // Forward error to error handler
    }
  }
);

module.exports = router;
