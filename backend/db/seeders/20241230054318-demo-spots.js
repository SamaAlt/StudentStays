'use strict';

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Use schema in production
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the required users exist before inserting spots
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Users" WHERE id IN (1, 2, 3, 4, 5)`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map(user => user.id);

    // Only insert spots for existing users (if userIds is not empty)
    if (userIds.length) {
      await queryInterface.bulkInsert(
        'Spots',
        [
          {
            ownerId: userIds[0], // Assuming the user with ID 1 exists
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            lat: 40.7128,
            lng: -74.0060,
            name: 'Downtown Apartment',
            description: 'A cozy downtown apartment.',
            price: 150.00,
            previewImage: 'https://example.com/image.jpg',
            numReviews: 0,
            avgStarRating: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            ownerId: userIds[1], // Assuming user with ID 2 exists
            address: '456 Elm St',
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            lat: 34.0522,
            lng: -118.2437,
            name: 'Sunny Beach House',
            description: 'A beach house with ocean views.',
            price: 200.00,
            previewImage: 'https://example.com/image2.jpg',
            numReviews: 0,
            avgStarRating: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            ownerId: userIds[2], // Assuming user with ID 3 exists
            address: '789 Oak St',
            city: 'Chicago',
            state: 'IL',
            country: 'USA',
            lat: 41.8781,
            lng: -87.6298,
            name: 'Cozy Suburban Home',
            description: 'A comfortable home in the suburbs.',
            price: 150.00,
            previewImage: 'https://example.com/image3.jpg',
            numReviews: 0,
            avgStarRating: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            ownerId: userIds[3], // Assuming user with ID 4 exists
            address: '123 Oak Rd',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            lat: 37.7749,
            lng: -122.4194,
            name: 'Beautiful Beach House',
            description: 'A lovely beach house with a great view.',
            price: 250.00,
            previewImage: 'https://example.com/image4.jpg',
            numReviews: 0,
            avgStarRating: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            ownerId: userIds[4], // Assuming user with ID 5 exists
            address: '456 Pine St',
            city: 'Austin',
            state: 'TX',
            country: 'USA',
            lat: 30.2672,
            lng: -97.7431,
            name: 'Mountain Retreat',
            description: 'A peaceful retreat in the mountains.',
            price: 300.00,
            previewImage: 'https://example.com/image5.jpg',
            numReviews: 0,
            avgStarRating: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        options // Pass schema options
      );
    } else {
      console.log('Required users not found. Skipping Spot insertion.');
    }
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
