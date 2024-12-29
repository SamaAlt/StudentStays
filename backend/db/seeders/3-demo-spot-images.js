'use strict';

const { Spot } = require('../models'); // Import the Spot model

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema in production
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch Spot IDs dynamically
    const spots = await Spot.findAll({
      attributes: ['id'], // Only fetch the IDs
      order: [['id', 'ASC']], // Ensure consistent ordering
    });

    // Map Spot IDs to seed SpotImages dynamically
    const spotImages = [];
    spots.forEach((spot, index) => {
      spotImages.push(
        {
          spotId: spot.id,
          url: `https://example.com/image${index * 2 + 1}.jpg`,
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: spot.id,
          url: `https://example.com/image${index * 2 + 2}.jpg`,
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    });

    // Insert the dynamically created SpotImages
    await queryInterface.bulkInsert('SpotImages', spotImages, options);
  },

  async down(queryInterface, Sequelize) {
    let options = {};
    if (process.env.NODE_ENV === 'production') {
      options.schema = process.env.SCHEMA; // Include schema in options
    }

    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      'SpotImages',
      {
        url: { [Op.like]: 'https://example.com/%' }, // Match URLs to delete
      },
      options // Pass schema options
    );
  },
};
