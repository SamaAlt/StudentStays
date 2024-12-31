'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "${options.schema ? `${options.schema}.` : ''}Users" WHERE id IN (1, 2, 3, 4, 5)`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const userIds = users.map(user => user.id);

    if (userIds.length) {
      await queryInterface.bulkInsert('Spots', [
        {
          ownerId: userIds[0],
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          lat: 40.7128,
          lng: -74.0060,
          name: 'Downtown Apartment',
          description: 'A cozy downtown apartment.',
          price: 150.00,
          previewImage: 'https://example.com/image.jpg',
          numReviews: 0,
          avgStarRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: userIds[1],
          address: '456 Elm St',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          lat: 34.0522,
          lng: -118.2437,
          name: 'Sunny Beach House',
          description: 'A beach house with ocean views.',
          price: 200.00,
          previewImage: 'https://example.com/image2.jpg',
          numReviews: 0,
          avgStarRating: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // More spot entries...
      ], options);
    } else {
      console.log('Required users not found. Skipping Spot insertion.');
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.like]: '%' }, // Delete all spots
    }, {});
  }
};
