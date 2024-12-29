'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      {
        spotId: 1, // Corresponds to a spot in demo-spots.js
        userId: 2, // Assume userId 2 exists in your Users table
        rating: 5,
        comment: 'This spot was amazing! Great location and very clean.',
      },
      {
        spotId: 1,
        userId: 3,
        rating: 4,
        comment: 'Nice place, but the kitchen could use some more equipment.',
      },
      {
        spotId: 2,
        userId: 1,
        rating: 3,
        comment: 'The place was okay, but it was a bit noisy at night.',
      },
      {
        spotId: 3,
        userId: 3,
        rating: 4,
        comment: 'Beautiful spot with stunning views. Would stay again!',
      },
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      comment: { [Op.like]: '%' },
    }, {});
  },
};
