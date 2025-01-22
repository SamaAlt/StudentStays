'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Op } = require('sequelize');
const { Spot } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Rd',
        city: 'San Diego',
        state: 'California',
        country: 'United States',
        lat: 32.7,
        lng: -117.2,
        name: 'Beach House',
        description: 'A beautiful beach house with ocean views, perfect for relaxing vacations',
        price: 300.00,
      },
      {
        ownerId: 2,
        address: '456 Ocean Ave',
        city: 'Miami',
        state: 'Florida',
        country: 'United States',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Ocean Breeze Villa',
        description: 'A stunning villa with direct beach access and modern amenities for a luxurious stay',
        price: 450.00,
      },
      {
        ownerId: 3,
        address: '789 Mountain Rd',
        city: 'Aspen',
        state: 'Colorado',
        country: 'United States',
        lat: 39.1911,
        lng: -106.8175,
        name: 'Mountain Retreat',
        description: 'A cozy mountain cabin perfect for skiing and hiking adventures',
        price: 400.00,
      },
      {
        ownerId: 4,
        address: '1010 Park Ave',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        lat: 40.7831,
        lng: -73.9712,
        name: 'City Loft',
        description: 'A stylish loft in the heart of the city with amazing skyline views',
        price: 500.00,
      },
      {
        ownerId: 5,
        address: '1111 Lakeview Dr',
        city: 'Lake Tahoe',
        state: 'California',
        country: 'United States',
        lat: 39.0968,
        lng: -120.0324,
        name: 'Lakeside Cottage',
        description: 'A charming cottage by the lake, perfect for a peaceful getaway',
        price: 350.00,
      },
      {
        ownerId: 6,
        address: '1212 Vine St',
        city: 'Napa',
        state: 'California',
        country: 'United States',
        lat: 38.2975,
        lng: -122.2869,
        name: 'Vineyard Villa',
        description: 'A beautiful villa surrounded by vineyards, ideal for wine lovers',
        price: 450.00,
      },
      {
        ownerId: 7,
        address: '1313 Desert Rd',
        city: 'Phoenix',
        state: 'Arizona',
        country: 'United States',
        lat: 33.4484,
        lng: -112.0740,
        name: 'Desert Oasis',
        description: 'A modern home with a pool and stunning desert views',
        price: 375.00,
      },
      {
        ownerId: 8,
        address: '1414 River Rd',
        city: 'Bend',
        state: 'Oregon',
        country: 'United States',
        lat: 44.0582,
        lng: -121.3153,
        name: 'Riverside Cabin',
        description: 'A rustic cabin by the river, perfect for fishing and kayaking',
        price: 325.00,
      },
      {
        ownerId: 9,
        address: '1515 Hilltop Dr',
        city: 'Charleston',
        state: 'South Carolina',
        country: 'United States',
        lat: 32.7765,
        lng: -79.9311,
        name: 'Historic Home',
        description: 'A charming historic home in the heart of Charleston',
        price: 400.00,
      },
      {
        ownerId: 10,
        address: '1616 Bay Rd',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Bay View Apartment',
        description: 'A luxurious apartment with stunning views of the bay',
        price: 600.00,
      },
      {
        ownerId: 11,
        address: '1717 Forest Ln',
        city: 'Portland',
        state: 'Oregon',
        country: 'United States',
        lat: 45.5122,
        lng: -122.6587,
        name: 'Forest Retreat',
        description: 'A serene retreat in the forest, perfect for nature lovers',
        price: 375.00,
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Rd', '456 Ocean Ave'] }
    }, {});
  }
};