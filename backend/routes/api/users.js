// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// POST /api/users - Sign up a new user
router.post(
  '/',
  async (req, res, next) => {
    const { email, username, password } = req.body;

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
      return next(err);
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
  }
);

module.exports = router;
