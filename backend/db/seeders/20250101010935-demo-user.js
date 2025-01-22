'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { User } = require('../models');
const bcrypt = require("bcryptjs");


module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'Demo-fname',
        lastName: 'Demo-lname',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        firstName: 'fake1-fname',
        lastName: 'fake1-lname',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'fake2-fname',
        lastName: 'fake2-lname',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        firstName: 'fake3-fname',
        lastName: 'fake3-lname',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        firstName: 'fake4-fname',
        lastName: 'fake4-lname',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        firstName: 'fake5-fname',
        lastName: 'fake5-lname',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        firstName: 'fake6-fname',
        lastName: 'fake6-lname',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        email: 'user7@user.io',
        username: 'FakeUser7',
        firstName: 'fake7-fname',
        lastName: 'fake7-lname',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        email: 'user8@user.io',
        username: 'FakeUser8',
        firstName: 'fake8-fname',
        lastName: 'fake8-lname',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        email: 'user9@user.io',
        username: 'FakeUser9',
        firstName: 'fake9-fname',
        lastName: 'fake9-lname',
        hashedPassword: bcrypt.hashSync('password10')
      },
      {
        email: 'user10@user.io',
        username: 'FakeUser10',
        firstName: 'fake10-fname',
        lastName: 'fake10-lname',
        hashedPassword: bcrypt.hashSync('password11')
      },
      {
        email: 'user11@user.io',
        username: 'FakeUser11',
        firstName: 'fake11-fname',
        lastName: 'fake11-lname',
        hashedPassword: bcrypt.hashSync('password12')
      },
      {
        email: 'user12@user.io',
        username: 'FakeUser12',
        firstName: 'fake12-fname',
        lastName: 'fake12-lname',
        hashedPassword: bcrypt.hashSync('password13')
      },
      {
        email: 'user13@user.io',
        username: 'FakeUser13',
        firstName: 'fake13-fname',
        lastName: 'fake13-lname',
        hashedPassword: bcrypt.hashSync('password14')
      },
      {
        email: 'user14@user.io',
        username: 'FakeUser14',
        firstName: 'fake14-fname',
        lastName: 'fake14-lname',
        hashedPassword: bcrypt.hashSync('password15')
      },
      {
        email: 'user15@user.io',
        username: 'FakeUser15',
        firstName: 'fake15-fname',
        lastName: 'fake15-lname',
        hashedPassword: bcrypt.hashSync('password16')
      },
      {
        email: 'user16@user.io',
        username: 'FakeUser16',
        firstName: 'fake16-fname',
        lastName: 'fake16-lname',
        hashedPassword: bcrypt.hashSync('password17')
      }


    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};