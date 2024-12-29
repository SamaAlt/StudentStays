// backend/routes/api/spotImages.js
const express = require('express');
const { Spot, SpotImage } =  require('../../db/models');
const router = express.Router();

// DELETE /spots/:spotId/images/:imageId - Delete an image from a spot
router.delete('/spots/:spotId/images/:imageId', async (req, res) => {
  const { spotId, imageId } = req.params;
  const userId = req.user.id; // Assuming user authentication is handled

  try {
    // 1. Ensure the spot exists and belongs to the current user
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: "You do not have permission to delete this spot image" });
    }

    // 2. Ensure the image exists for the spot
    const imageToDelete = await SpotImage.findOne({ where: { id: imageId, spotId } });

    if (!imageToDelete) {
      return res.status(404).json({ message: "Spot Image couldn't be found" });
    }

    // 3. Delete the image
    await imageToDelete.destroy();

    // 4. Return success message
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
