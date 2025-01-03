// backend/routes/api/review-images.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();



// Delete a Review Image
router.delete(
    '/:imageId',
    requireAuth,
    async (req, res, next) => {
        const userId = req.user.id;
        const imageId = parseInt(req.params.imageId, 10);

        const existingImage = await ReviewImage.findByPk(imageId);
        if (!existingImage) {
            res.status(404);
            return res.json({
                message: "Review Image couldn't be found" // And needs to belong to user
            });
        }

        const review = await Review.findByPk(existingImage.reviewId);

        if(review.userId === userId){
            await existingImage.destroy();

            res.status(200);
            return res.json({
                message: "Successfully deleted"
            });
        } else{
            const err = new Error("Review must belong to the current user");
            err.status = 403;
            return next(err);
        }

        
    }
);

module.exports = router;