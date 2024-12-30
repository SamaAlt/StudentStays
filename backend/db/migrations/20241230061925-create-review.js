'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Use the schema from the environment variable in production
}

module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reviews', {

      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      spotId: {
        type: Sequelize.INTEGER,
        references: {
          model: options.schema ? { tableName: 'Spots', schema: options.schema } : 'Spots',  // Handle schema dynamically
          key: 'id',  // references the 'id' column
        },
        allowNull: false,
      },

      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: options.schema ? { tableName: 'Users', schema: options.schema } : 'Users',  // Handle schema dynamically
          key: 'id',  // references the 'id' column
        },
        allowNull: false,
      },

      stars: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      review: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    }, options);  // Apply options including schema if in production

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Reviews', options);  // Apply options including schema if in production
  },

};
