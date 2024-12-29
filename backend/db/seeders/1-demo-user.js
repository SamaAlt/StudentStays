'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema in options (for non-SQLite DBs)
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // If there's a schema, use it; otherwise, just use 'Users' table name
    const tableName = 'Users'; // No schema in the table name for SQLite

    // Check if the user already exists using raw SQL
    const userExists = await queryInterface.sequelize.query(
      `SELECT 1 FROM "${tableName}" WHERE "username" = 'Demo-lition' LIMIT 1`, 
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Only insert if the user doesn't already exist
    if (!userExists.length) {
      await queryInterface.bulkInsert(
        tableName, // Just the table name without schema
        [
          {
            email: 'demo@user.io',
            username: 'Demo-lition',
            firstName: 'Demo',
            lastName: 'User',
            hashedPassword: bcrypt.hashSync('password'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            email: 'user1@user.io',
            username: 'FakeUser1',
            firstName: 'Fake',
            lastName: 'User1',
            hashedPassword: bcrypt.hashSync('password2'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            email: 'user2@user.io',
            username: 'FakeUser2',
            firstName: 'Fake',
            lastName: 'User2',
            hashedPassword: bcrypt.hashSync('password3'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        options // Include options (if any)
      );
    } else {
      console.log('User "Demo-lition" already exists, skipping insertion.');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'Users'; // No schema for SQLite

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      tableName, // No schema reference, just the table name
      {
        username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
      },
      options // Pass options (if any) in production
    );
  }
};
