// backend/routes/api/reviewImages.js
const express = require('express');
const { ReviewImage, Review } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');


// DELETE /reviews/images/:id - Delete a review image
router.delete('/reviews/images/:id', async (req, res) => {
    const reviewImageId = req.params.id;
    const userId = req.user.id; // Assuming user authentication is handled
  
    try {
      // 1. Ensure the review image exists
      const reviewImage = await ReviewImage.findByPk(reviewImageId);
  
      if (!reviewImage) {
        return res.status(404).json({
          message: "Review Image couldn't be found",
        });
      }
  
      // 2. Ensure the review belongs to the current user
      const review = await Review.findByPk(reviewImage.reviewId);
      
      if (!review || review.userId !== userId) {
        return res.status(403).json({
          message: "You do not have permission to delete this review image",
        });
      }
  
      // 3. Delete the review image
      await reviewImage.destroy();
  
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