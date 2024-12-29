'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Spots', [
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
      },
      // Add more spots
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, null, {});
  },
};
