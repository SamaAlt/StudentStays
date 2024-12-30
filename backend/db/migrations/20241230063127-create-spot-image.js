'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SpotImages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      entityType: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['Spot', 'Review']], // Ensure only 'Spot' or 'Review' are valid types
        },
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preview: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Defaults to false if not specified
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SpotImages');
  },
};
