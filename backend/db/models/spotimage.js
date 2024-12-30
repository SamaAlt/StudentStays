'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {

  class SpotImage extends Model {

    static associate(models) {
      // SpotImage can be associated with either Spot or Review via entityId and entityType

      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'entityId',
        constraints: false,
        as: 'Spot', // Association alias for Spot
      });

      SpotImage.belongsTo(models.Review, {
        foreignKey: 'entityId',
        constraints: false,
        as: 'Review', // Association alias for Review
      });
    }

  }

  SpotImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['Spot', 'Review']], // Ensure only 'Spot' or 'Review' are valid types
        },
      },

      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Defaults to false if not specified
      },

    },
    {
      sequelize,
      modelName: 'SpotImage',
      timestamps: true, // Enable timestamps (createdAt and updatedAt)
    }
  );

  return SpotImage;

};
