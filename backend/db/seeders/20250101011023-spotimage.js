'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { SpotImage } = require('../models')
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

    await SpotImage.bulkCreate([
      {spotId: 1,
        url:'https://unsplash.com/photos/3d-render-modern-building-exterior-2MA8dFvOMec',
        preview:true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {spotId: 2,
        url:'https://images.app.goo.gl/J2T3764iNL8akcMW7',
        preview:true,
        createdAt: new Date(),
        updatedAt: new Date(),      
      },
    ],{ validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://images.app.goo.gl/J2T3764iNL8akcMW7', 'https://unsplash.com/photos/3d-render-modern-building-exterior-2MA8dFvOMec'] }
    }, {})
  }
};