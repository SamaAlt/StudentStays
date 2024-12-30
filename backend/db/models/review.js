'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  const Review = sequelize.define('Review', {

    id: {  // Explicitly define the primary key
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',  // referenced model
        key: 'id',       // referenced primary key
      },
      onDelete: 'CASCADE',  // Optional: Defines behavior when a referenced row in the 'Spots' table is deleted
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',  // referenced model
        key: 'id',       // referenced primary key
      },
      onDelete: 'CASCADE',  // Optional: Defines behavior when a referenced row in the 'Users' table is deleted
    },

    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,  // Optional: Adds validation to ensure stars are within a valid range
        max: 5,
      },
    },

    review: {
      type: DataTypes.TEXT,
    },

  });

  // Associations
  Review.associate = (models) => {
    // A Review belongs to a Spot
    Review.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      as: 'Spot',  // Custom alias for the relationship
    });

    // A Review belongs to a User (the reviewer)
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',  // Custom alias for the relationship
    });
  };

  return Review;
};
