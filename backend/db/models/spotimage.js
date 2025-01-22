'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  SpotImage.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    spotId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        isUrl: true 
      }
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull:false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    timestamps: true,
  });
  return SpotImage;
};