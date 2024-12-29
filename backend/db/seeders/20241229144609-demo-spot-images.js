'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1, // Corresponds to the spot in demo-spots.js
        url: 'https://example.com/image1.jpg',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://example.com/image2.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://example.com/image3.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://example.com/image4.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://example.com/image5.jpg',
        preview: true,
      },
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      url: { [Op.like]: 'https://example.com/%' },
    }, {});
  },
};
