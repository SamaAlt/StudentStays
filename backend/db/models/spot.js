'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Spot extends Model {
    static associate(models) {
      // A spot belongs to a user (owner)
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner', // Alias for the association
      });

      // A spot has many images
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        as: 'Images', // Alias for the association
      });

      // A spot has many reviews
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        as: 'Reviews',
      });
    }
  }

  Spot.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // References Users table
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lat: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      previewImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Default value set to 0
        allowNull: false,
      },
      avgStarRating: {
        type: DataTypes.DECIMAL,
        defaultValue: 0, // Default value set to 0
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Spot',
      timestamps: true, // Adds `createdAt` and `updatedAt`
      tableName: 'Spots', // Explicitly defines the table name
    }
  );

  return Spot;
};
