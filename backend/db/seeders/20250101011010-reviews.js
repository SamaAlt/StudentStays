'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Review } = require('../models');
const { Op } = require('sequelize'); 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'Very nice beach',
        stars: 5
      },
      {
        spotId: 1,
        userId: 2,
        review: 'I like it',
        stars: 3
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Amazing stay!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 4,
        review: 'Not bad, but could be cleaner',
        stars: 2
      },
      {
        spotId: 3,
        userId: 5,
        review: 'Loved the ambiance',
        stars: 4
      },
      {
        spotId: 3,
        userId: 6,
        review: 'A decent place to stay',
        stars: 3
      },
      {
        spotId: 4,
        userId: 7,
        review: 'Absolutely wonderful experience!',
        stars: 5
      },
      {
        spotId: 4,
        userId: 8,
        review: 'Would definitely come back!',
        stars: 4
      },
      {
        spotId: 5,
        userId: 9,
        review: 'An okay place for the price',
        stars: 3
      },
      {
        spotId: 5,
        userId: 10,
        review: 'Great amenities and friendly staff',
        stars: 4
      },
      {
        spotId: 6,
        userId: 11,
        review: 'A hidden gem!',
        stars: 5
      },
      {
        spotId: 6,
        userId: 12,
        review: 'Peaceful and relaxing',
        stars: 4
      },
      {
        spotId: 7,
        userId: 13,
        review: 'Nice view, but a bit overpriced',
        stars: 3
      }

    ],{ validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {})
  }
};