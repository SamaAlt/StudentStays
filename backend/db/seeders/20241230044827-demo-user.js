'use strict';

const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Use schema defined in environment variable
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Using bulkCreate to insert the data into the Users table
    await queryInterface.bulkInsert(
      'Users',  // Table name
      [
        {
          firstName: 'Demo',
          lastName: 'User',
          username: 'Demo-lition',
          email: 'demo@user.io',
          hashedPassword: bcrypt.hashSync('password'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Fake',
          lastName: 'User1',
          username: 'FakeUser1',
          email: 'user1@user.io',
          hashedPassword: bcrypt.hashSync('password2'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Fake',
          lastName: 'User2',
          username: 'FakeUser2',
          email: 'user2@user.io',
          hashedPassword: bcrypt.hashSync('password3'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options // Include schema settings if in production environment
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users'; // Explicitly specify the table name
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options, // Include schema settings if in production
      {
        username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },  // Delete users based on their usernames
      },
      {}
    );
  },
};
