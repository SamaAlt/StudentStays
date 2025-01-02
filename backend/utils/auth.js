// backend/utils/auth.js

const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');
const csrf = require('csurf');

const { secret, expiresIn } = jwtConfig; 

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  // Use JWT_SECRET from environment variables or config
  const token = jwt.sign(
    { data: safeUser },
    process.env.JWT_SECRET || secret, 
    { expiresIn: parseInt(expiresIn) || '1h' } 
  );

  const isProduction = process.env.NODE_ENV === 'production';

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,  // Makes the cookie accessible only by the web server
    secure: isProduction, // Only send cookie over HTTPS in production
    sameSite: isProduction ? 'Lax' : 'Strict', // Controls cookie behavior in cross-site requests
  });

  return token;
};


// Restore user from JWT token
const restoreUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      console.log('No token found in request.');
      return next(); // Proceed if no token is provided
    }

    try {
      const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

      if (!jwtPayload || !jwtPayload.data || !jwtPayload.data.id) {
        console.log('Invalid JWT payload structure.');
        return next();
      }

      const user = await User.findByPk(jwtPayload.data.id, {
        attributes: ['id', 'email', 'username', 'firstName', 'lastName'],
      });

      if (user) {
        req.user = user;
        console.log('User restored:', user.toJSON());
      } else {
        console.log('No user found for provided token.');
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Token has expired.');
      } else if (err.name === 'JsonWebTokenError') {
        console.log('Invalid token:', err.message);
      } else {
        console.error('Token verification error:', err);
      }
    }
  } catch (error) {
    console.error('Error restoring user from token:', error);
  }

  return next(); // Continue processing the request
};



// Middleware to require authentication for certain routes
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
}

module.exports = { setTokenCookie, restoreUser, requireAuth };
