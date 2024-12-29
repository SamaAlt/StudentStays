// backend/db/models/review.js
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
      },
    });
  
    Review.associate = (models) => {
      // A Review belongs to a Spot
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'Spot',
      });
      // A Review belongs to a User (the reviewer)
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });
    };
  
    return Review;
  };
  