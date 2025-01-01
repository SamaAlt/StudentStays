'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkCreate('SpotImages', [
      {
        spotId: 1,
        url: 'https://example.com/images/spot1_1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        url: 'https://example.com/images/spot1_2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://example.com/images/spot2_1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://example.com/images/spot2_2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        url: 'https://example.com/images/spot3_1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: [
        'https://example.com/images/spot1_1.jpg',
        'https://example.com/images/spot1_2.jpg',
        'https://example.com/images/spot2_1.jpg',
        'https://example.com/images/spot2_2.jpg',
        'https://example.com/images/spot3_1.jpg'
      ] }
    }, {});
  }
};
