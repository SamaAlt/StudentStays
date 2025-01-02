//backend/db/models/spot.js

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // Associations
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
    }
  }

  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Refers to the 'Users' table
          key: 'id', // Refers to the 'id' field in the 'Users' table
        },
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: DataTypes.DECIMAL,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      avgRating: { // Define avgRating attribute
        type: DataTypes.FLOAT,
        defaultValue: 0, // Set a default value
      },
      previewImage: { // Define previewImage attribute
        type: DataTypes.STRING,
        allowNull: true, // Allow null if no image is provided
      },
    },
    {
      sequelize,
      modelName: 'Spot',
      timestamps: true, // Enables automatic management of createdAt and updatedAt
    }
  );
  return Spot;
};