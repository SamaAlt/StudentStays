'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Use schema in production
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Spots',
      [
        {
          ownerId: 1,
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          lat: 40.7128,
          lng: -74.0060,
          name: 'Downtown Apartment',
          description: 'A cozy downtown apartment.',
          price: 150,
          previewImage: 'https://example.com/image.jpg',
          numReviews: 0,
          avgStarRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,  // Owner with ID 2 (different from the first spot)
          address: '456 Elm St',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          lat: 34.0522,
          lng: -118.2437,
          name: 'Sunny Beach House',
          description: 'A beach house with ocean views.',
          price: 200,
          previewImage: 'https://example.com/image2.jpg',
          numReviews: 0,
          avgStarRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,  // Owner with ID 3 (different from the first two spots)
          address: '789 Oak St',
          city: 'Chicago',
          state: 'IL',
          country: 'USA',
          lat: 41.8781,
          lng: -87.6298,
          name: 'Cozy Suburban Home',
          description: 'A comfortable home in the suburbs.',
          price: 150,
          previewImage: 'https://example.com/image3.jpg',
          numReviews: 0,
          avgStarRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more spots as needed
      ],
      options // Pass schema options
    );
  },

  async down(queryInterface, Sequelize) {
    let options = {};
    if (process.env.NODE_ENV === 'production') {
      options.schema = process.env.SCHEMA; // Ensure schema is properly set
    }

    await queryInterface.bulkDelete(
      'Spots', // Table name
      {
        address: { [Sequelize.Op.like]: '%' }, // Condition to delete all rows
      },
      options // Pass schema options
    );
  },
};
