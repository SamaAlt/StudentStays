'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpotImages', [
      {
        entityId: 1,  // Assuming Spot ID = 1
        entityType: 'Spot',
        url: 'http://example.com/image1.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        entityId: 1,  // Assuming Spot ID = 1
        entityType: 'Spot',
        url: 'http://example.com/image2.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        entityId: 2,  // Assuming Spot ID = 2
        entityType: 'Spot',
        url: 'http://example.com/image3.jpg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        entityId: 2,  // Assuming Spot ID = 2
        entityType: 'Spot',
        url: 'http://example.com/image4.jpg',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Sequelize.Op.like]: 'http://example.com/%' },
    }, {});
  }
};
