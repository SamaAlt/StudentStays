// backend/config/database.js
const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile, // Path to SQLite database file
    dialect: "sqlite", // Database dialect for SQLite
    seederStorage: "sequelize", // How Sequelize stores seed data
    logQueryParameters: true, // Log query parameters
    typeValidation: true // Enable stricter type validation
  },
  production: {
    use_env_variable: 'DATABASE_URL', // Database URL from environment variables
    dialect: 'postgres', // PostgreSQL dialect
    seederStorage: 'sequelize', // Seeder storage method
    dialectOptions: {
      ssl: { // SSL settings for secure database connections
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA // Custom schema for organization
    }
  }
};
