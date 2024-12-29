// backend/routes/api/reviews.js
const express = require('express');
const { Review, User, Spot, ReviewImage } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

// GET /reviews/current - Get all reviews by the current user
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    const reviews = await Review.findAll({
      where: {
        userId: userId, // Fetch only reviews by the current user
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price', 'previewImage'],
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url'],
        }
      ],
    });

    if (!reviews.length) {
      return res.status(404).json({
        message: "No reviews found for the current user",
      });
    }

    return res.status(200).json({
      Reviews: reviews,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /spots/:id/reviews - Get all reviews for a specific spot
router.get('/spots/:id/reviews', async (req, res) => {
    const spotId = req.params.id;
  
    try {
      // Fetch reviews for the specified spot ID
      const reviews = await Review.findAll({
        where: {
          spotId: spotId, // Fetch reviews for this spot
        },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'], // Include user details
          },
          {
            model: ReviewImage,
            attributes: ['id', 'url'], // Include review images
          },
        ],
      });
  
      // If no reviews are found, return a 404 error
      if (!reviews.length) {
        return res.status(404).json({
          message: "Spot couldn't be found",
        });
      }
  
      // Send the list of reviews back as a response
      return res.status(200).json({
        Reviews: reviews,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
  

// POST /spots/:id/reviews - Create a review for a spot
router.post('/spots/:id/reviews', async (req, res) => {
    const spotId = req.params.id;
    const { review, stars } = req.body;
    const userId = req.user.id; // Assuming user authentication is handled
  
    try {
      // 1. Validation: Ensure review and stars are provided
      if (!review || !stars) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            review: "Review text is required",
            stars: "Stars must be an integer from 1 to 5",
          },
        });
      }
  
      if (stars < 1 || stars > 5 || !Number.isInteger(stars)) {
        return res.status(400).json({
          message: "Bad Request",
          errors: {
            stars: "Stars must be an integer from 1 to 5",
          },
        });
      }
  
      // 2. Ensure the spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found",
        });
      }
  
      // 3. Ensure the user has not already reviewed this spot
      const existingReview = await Review.findOne({
        where: {
          spotId: spotId,
          userId: userId,
        },
      });
  
      if (existingReview) {
        return res.status(500).json({
          message: "User already has a review for this spot",
        });
      }
  
      // 4. Create the review
      const newReview = await Review.create({
        userId,
        spotId,
        review,
        stars,
      });
  
      // 5. Return the newly created review in the response
      return res.status(201).json({
        id: newReview.id,
        userId: newReview.userId,
        spotId: newReview.spotId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt,
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });


// POST /reviews/:id/images - Add an image to a review
router.post('/reviews/:id/images', async (req, res) => {
  const reviewId = req.params.id;
  const { url } = req.body;
  const userId = req.user.id; // Assuming user authentication is handled

  try {
    // 1. Validation: Ensure the image URL is provided
    if (!url) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          url: "Image URL is required",
        },
      });
    }

    // 2. Ensure the review exists and belongs to the current user
    const review = await Review.findByPk(reviewId, {
      include: User, // Including the User model to check ownership
    });

    if (!review) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: "You do not have permission to add an image to this review",
      });
    }

    // 3. Ensure the review has not already reached the maximum number of images (10)
    const existingImagesCount = await ReviewImage.count({
      where: { reviewId: reviewId },
    });

    if (existingImagesCount >= 10) {
      return res.status(403).json({
        message: "Maximum number of images for this resource was reached",
      });
    }

    // 4. Create the image for the review
    const newImage = await ReviewImage.create({
      reviewId,
      url,
    });

    // 5. Return the newly created image in the response
    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


// PUT /reviews/:id - Edit a review
router.put('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const { review, stars } = req.body;
  const userId = req.user.id; // Assuming user authentication is handled

  try {
    // 1. Validation: Ensure the required fields are provided
    if (!review) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          review: "Review text is required",
        },
      });
    }

    if (stars === undefined || stars < 1 || stars > 5) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          stars: "Stars must be an integer from 1 to 5",
        },
      });
    }

    // 2. Ensure the review exists and belongs to the current user
    const reviewToUpdate = await Review.findByPk(reviewId);

    if (!reviewToUpdate) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    if (reviewToUpdate.userId !== userId) {
      return res.status(403).json({
        message: "You do not have permission to edit this review",
      });
    }

    // 3. Update the review
    reviewToUpdate.review = review;
    reviewToUpdate.stars = stars;
    await reviewToUpdate.save();

    // 4. Return the updated review
    return res.status(200).json(reviewToUpdate);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

 
// DELETE /reviews/:id - Delete a review
router.delete('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id; // Assuming user authentication is handled

  try {
    // 1. Ensure the review exists
    const reviewToDelete = await Review.findByPk(reviewId);

    if (!reviewToDelete) {
      return res.status(404).json({
        message: "Review couldn't be found",
      });
    }

    // 2. Ensure the review belongs to the current user
    if (reviewToDelete.userId !== userId) {
      return res.status(403).json({
        message: "You do not have permission to delete this review",
      });
    }

    // 3. Delete the review
    await reviewToDelete.destroy();

    // 4. Return success message
    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

 
module.exports = router;
