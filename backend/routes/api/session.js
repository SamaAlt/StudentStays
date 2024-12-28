const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// POST /api/session - Log the user in
router.post('/', async (req, res, next) => {
  const { credential, password } = req.body;

  // Ensure both credential and password are provided
  if (!credential || !password) {
    const err = new Error("Both credential and password are required.");
    err.status = 400;
    return next(err);
  }

  try {
    // Find the user by either email or username
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    // Safe user object without the sensitive information (hashedPassword)
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    // Set the token cookie for the session
    await setTokenCookie(res, safeUser);

    // Respond with the safe user data
    return res.json({ user: safeUser });

  } catch (error) {
    console.error(error);
    return next(error);  // Forward error to the error-handling middleware
  }
});
//This
// DELETE /api/session - Log out the user
router.delete('/', (req, res) => {
  res.clearCookie('token');  // Clear the token cookie
  return res.json({ message: 'success' });  // Send success message
});

// Restore session user
router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);
module.exports = router;
