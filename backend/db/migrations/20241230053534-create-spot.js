'use strict';

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Use schema in production
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Spots', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // references the 'Users' table
          key: 'id',      // references the 'id' column
        },
        allowNull: true,
        onDelete: 'SET NULL', // Ensures the behavior when a referenced user is deleted
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lat: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      lng: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      previewImage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      numReviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // Default value set to 0
        allowNull: false,
      },
      avgStarRating: {
        type: Sequelize.DECIMAL,
        defaultValue: 0, // Default value set to 0
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, options); // Pass schema options
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Spots', options); // Ensure schema is respected when rolling back
  },
};
