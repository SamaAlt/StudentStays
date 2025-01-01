'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Sama',
        lastName: 'Thiabat',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        hashedPassword: bcrypt.hashSync('password123'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane.smith@example.com',
        hashedPassword: bcrypt.hashSync('password123'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        username: 'mikejohnson',
        email: 'mike.johnson@example.com',
        hashedPassword: bcrypt.hashSync('password123'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['johndoe', 'janesmith', 'mikejohnson'] }
    }, {});
  }
};