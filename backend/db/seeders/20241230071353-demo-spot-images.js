'use strict';

const { Spot, Review } = require('../models'); // Import models for Spot and Review

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema for production
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert SpotImage entries
    await queryInterface.bulkInsert('SpotImages', [
      {
        entityId: 1,  // Assuming Spot ID = 1
        entityType: 'Spot',
        url: 'http://example.com/image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        entityId: 1,  // Assuming Spot ID = 1
        entityType: 'Spot',
        url: 'http://example.com/image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        entityId: 2,  // Assuming Spot ID = 2
        entityType: 'Spot',
        url: 'http://example.com/image3.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        entityId: 2,  // Assuming Spot ID = 2
        entityType: 'Spot',
        url: 'http://example.com/image4.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more SpotImage entries as needed
    ], options);  // Make sure options are passed for production schema

  },

  down: async (queryInterface, Sequelize) => {
    // Delete the inserted SpotImages by matching URL pattern
    await queryInterface.bulkDelete('SpotImages', {
      url: { [Sequelize.Op.like]: 'http://example.com/%' },
    }, options);  // Ensure to pass options for production schema
  }
};
