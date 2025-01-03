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
        url:'https://www.google.com/imgres?imgurl=https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs%3Dsrgb%26dl%3Dpexels-binyaminmellish-106399.jpg%26fm%3Djpg&tbnid=kdENxlNldMG6sM&vet=1&imgrefurl=https://www.pexels.com/search/houses/&docid=pOKaSh3YkKiy2M&w=5408&h=3605&source=sh/x/im/m1/1&kgs=e556ea0cc2d90162&shem=abme,trie',
        preview:true

      },
      {spotId: 2,
        url:'https://images.app.goo.gl/J2T3764iNL8akcMW7',
        preview:true
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
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://images.app.goo.gl/J2T3764iNL8akcMW7', 'https://www.google.com/imgres?imgurl=https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs%3Dsrgb%26dl%3Dpexels-binyaminmellish-106399.jpg%26fm%3Djpg&tbnid=kdENxlNldMG6sM&vet=1&imgrefurl=https://www.pexels.com/search/houses/&docid=pOKaSh3YkKiy2M&w=5408&h=3605&source=sh/x/im/m1/1&kgs=e556ea0cc2d90162&shem=abme,trie'] }
    }, {})
  }
};