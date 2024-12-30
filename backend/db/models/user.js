'use strict';

const { Model, DataTypes } = require('sequelize');
const Validator = require('validator');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        as: 'Spots',
      });

      User.hasMany(models.Review, {
        foreignKey: 'userId',
        as: 'Reviews',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
          isNotEmpty(value) {
            if (Validator.isEmpty(value)) {
              throw new Error('Username cannot be empty.');
            }
          },
        },
        set(value) {
          this.setDataValue('username', value.toLowerCase());
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
        set(value) {
          this.setDataValue('email', value.toLowerCase());
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60], // Adjust if using a hash method with a different fixed length
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 50],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: { exclude: ['hashedPassword', 'createdAt', 'updatedAt'] },
      },
      timestamps: true,
    }
  );

  return User;
};
