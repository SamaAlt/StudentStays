'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema in options (for non-SQLite DBs)
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users'; // Include tableName in options for compatibility

    // Check if a user with the username 'Demo-lition' already exists
    const userExists = await queryInterface.sequelize.query(
      `SELECT 1 FROM "${options.schema ? `${options.schema}.` : ''}Users" WHERE "username" = 'Demo-lition' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // If the user doesn't exist, insert new users
    if (!userExists.length) {
      const hashedPasswordDemo = bcrypt.hashSync('password');
      const hashedPassword1 = bcrypt.hashSync('password2');
      const hashedPassword2 = bcrypt.hashSync('password3');

      await queryInterface.bulkInsert(
        options.tableName,
        [
          {
            email: 'demo@user.io',
            username: 'Demo-lition',
            firstName: 'Demo',
            lastName: 'User',
            hashedPassword: hashedPasswordDemo,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            email: 'user1@user.io',
            username: 'FakeUser1',
            firstName: 'Fake',
            lastName: 'User1',
            hashedPassword: hashedPassword1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            email: 'user2@user.io',
            username: 'FakeUser2',
            firstName: 'Fake',
            lastName: 'User2',
            hashedPassword: hashedPassword2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        options
      );
    } else {
      console.log('User "Demo-lition" already exists, skipping insertion.');
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users'; // Include tableName in options

    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
      },
      {}
    );
  },
};
