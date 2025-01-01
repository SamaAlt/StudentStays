// backend/config/index.js

// Import environment variables loaded by dotenv
require('dotenv').config();

module.exports = {
  environment: process.env.NODE_ENV || 'development',  // Default to 'development' if not set
  port: process.env.PORT || 8000,  // Default to 8000 if not set
  dbFile: process.env.DB_FILE,  // Path to the SQLite database file
  jwtConfig: {
    secret: process.env.JWT_SECRET,  // JWT secret for signing tokens
    expiresIn: process.env.JWT_EXPIRES_IN,  // JWT expiration time (in seconds)
  },
  schema: process.env.SCHEMA,  // Schema name for PostgreSQL in production
};
