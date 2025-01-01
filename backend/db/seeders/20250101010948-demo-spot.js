'use strict';
const { Spot, User } = require('../models'); // Import the Spot model and User for association

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Sunny Apartment',
        description: 'A beautiful sunny apartment in the heart of New York.',
        price: 250.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 2,
        address: '456 Oak Rd',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Ocean View Condo',
        description: 'A luxurious condo with an ocean view.',
        price: 350.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ownerId: 3,
        address: '789 Pine Blvd',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Mountain Retreat',
        description: 'A peaceful mountain retreat with stunning views.',
        price: 400.00,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Sunny Apartment', 'Ocean View Condo', 'Mountain Retreat'] }
    }, {});
  }
};