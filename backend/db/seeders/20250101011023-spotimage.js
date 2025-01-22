'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { SpotImage } = require('../models');
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      { spotId: 1, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 2, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 3, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 4, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 5, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 6, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 7, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 8, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 9, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 10, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 11, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
      { spotId: 12, url: 'https://picsum.photos/200/300', preview: true, createdAt: new Date(), updatedAt: new Date() },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://picsum.photos/200/300'] }
    }, {});
  }
};
