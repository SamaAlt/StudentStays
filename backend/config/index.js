// backend/config/index.js
module.exports = {
    environment: process.env.NODE_ENV || 'development', // Development or production environment
    port: process.env.PORT || 8000, // Server port
    dbFile: process.env.DB_FILE, // SQLite database file for development
    jwtConfig: {
      secret: process.env.JWT_SECRET, // Secret key for signing JWTs
      expiresIn: process.env.JWT_EXPIRES_IN // Expiry time for JWTs
    }
  };
  