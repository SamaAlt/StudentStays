'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Op } = require('sequelize');
const { ReviewImage } = require('../models')

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
    await ReviewImage.bulkCreate([
      { 
        reviewId: 1,
        url:'imageUrl1',
      },
      { 
        reviewId: 2,
        url:'imageUrl2'
      },
      { 
        reviewId: 3,
        url: 'imageUrl3',
      },
      { 
        reviewId: 4,
        url: 'imageUrl4',
      },
      { 
        reviewId: 5,
        url: 'imageUrl5',
      },
      { 
        reviewId: 6,
        url: 'imageUrl6',
      },
      { 
        reviewId: 7,
        url: 'imageUrl7',
      },
      { 
        reviewId: 8,
        url: 'imageUrl8',
      },
      { 
        reviewId: 9,
        url: 'imageUrl9',
      },
      { 
        reviewId: 10,
        url: 'imageUrl10',
      },
      { 
        reviewId: 11,
        url: 'imageUrl11',
      },
      { 
        reviewId: 12,
        url: 'imageUrl12',
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
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['imageUrl1', 'imageUrl2'] }
    }, {})

  }
};