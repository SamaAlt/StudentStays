'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1,
        userId: 2,
        stars: 5,
        review: 'This spot was amazing! Great location and very clean.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        userId: 3,
        stars: 4,
        review: 'Nice place, but the kitchen could use some more equipment.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        userId: 1,
        stars: 3,
        review: 'The place was okay, but it was a bit noisy at night.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        userId: 3,
        stars: 4,
        review: 'Beautiful spot with stunning views. Would stay again!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.like]: '%' },  // Delete all reviews
    }, {});
  }
};
