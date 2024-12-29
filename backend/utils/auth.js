const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

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
    // Look for JWT token in headers (Authorization header) or cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      console.log('No token found in request.');
      return next();  // Proceed if no token is provided
    }

    // Decode the JWT token and extract user info
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET || secret); // Use the same secret used to sign the token
    console.log('JWT Payload:', jwtPayload);

    // Retrieve the user based on the user ID in the token
    const user = await User.findByPk(jwtPayload.data.id, {
      attributes: ['id', 'email', 'username', 'firstName', 'lastName'],
    });

    if (user) {
      req.user = user;  // Attach the user to the request object
      console.log('User restored:', req.user);
    } else {
      console.log('No user found for provided token.');
    }

  } catch (error) {
    console.error('Error restoring user from token:', error);
  }

  return next();  // Continue processing the request
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
