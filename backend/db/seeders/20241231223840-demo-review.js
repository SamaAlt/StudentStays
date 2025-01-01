'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkCreate('Reviews', [
      {
        userId: 1,
        spotId: 1,
        review: 'Amazing place! Highly recommend.',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Great view, but a bit overpriced.',
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        spotId: 3,
        review: 'The retreat was peaceful, just as described.',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['Amazing place! Highly recommend.', 'Great view, but a bit overpriced.', 'The retreat was peaceful, just as described.'] }
    }, {});
  }
};
