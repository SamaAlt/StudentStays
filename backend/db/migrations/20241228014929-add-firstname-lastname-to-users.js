'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make firstName NOT NULL
    await queryInterface.changeColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,  // Set it to NOT NULL
    });

    // Make lastName NOT NULL
    await queryInterface.changeColumn('Users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,  // Set it to NOT NULL
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the columns to allow NULL values if the migration is undone
    await queryInterface.changeColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('Users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};

