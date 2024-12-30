'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Ensure schema is set for production
}

module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Reviews',
      [
        {
          spotId: 1, // Corresponds to a spot in your Spots table
          userId: 2, // Assume userId 2 exists in your Users table
          stars: 5,  // Corrected field name as per model
          review: 'This spot was amazing! Great location and very clean.', // Corrected field name as per model
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
      ],
      options // Include schema options for production
    );
  },

  async down(queryInterface, Sequelize) {
    // To maintain consistency, use the same schema logic in the down method
    let options = {};
    if (process.env.NODE_ENV === 'production') {
      options.schema = process.env.SCHEMA; // Ensure schema is set for production
    }

    const Op = Sequelize.Op;

    // Delete the reviews that were inserted (based on some criteria like review content)
    await queryInterface.bulkDelete(
      'Reviews', // Table name
      {
        review: { [Op.like]: '%' }, // Delete all reviews (using LIKE to match any review)
      },
      options // Include schema options for production
    );
  },

};
