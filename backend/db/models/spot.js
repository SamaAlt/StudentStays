// backend/db/models/spot.js
module.exports = (sequelize, DataTypes) => {
  const Spot = sequelize.define('Spot', {
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    previewImage: {
      type: DataTypes.STRING,
    },
    // Optional fields for reviews and ratings
    numReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    avgStarRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    }
  });

  // Define associations
  Spot.associate = (models) => {
    // A spot belongs to a user (owner)
    Spot.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'Owner',
    });

    // A spot has many images (SpotImage)
    Spot.hasMany(models.SpotImage, {
      foreignKey: 'spotId',
      as: 'SpotImages',
    });

    // A spot has many reviews
    Spot.hasMany(models.Review, {
      foreignKey: 'spotId',
      as: 'Reviews',
    });
  };

  return Spot;
};
