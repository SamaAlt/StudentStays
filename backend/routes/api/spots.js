const express = require('express');
const { Spot, User, Review, SpotImage } = require('../../db/models');
const { Op } = require('sequelize'); // Sequelize operators
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { validateSpot, handleValidationErrors } = require('../../utils/validation');

// Route for fetching a single spot with associated owner (User)
// GET /api/spots - Get all spots
router.get('/', async (req, res) => {
  const { city, state, country, minPrice, maxPrice, name, page = 1, limit = 20 } = req.query;

  let filters = {};

  if (city) filters.city = city;
  if (state) filters.state = state;
  if (country) filters.country = country;
  if (name) filters.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive match for name
  if (minPrice) filters.price = { [Op.gte]: minPrice };
  if (maxPrice) filters.price = { [Op.lte]: maxPrice };

  try {
    const spots = await Spot.findAll({
      where: filters,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng',
        'name', 'description', 'price', 'avgRating', 'previewImage', 'createdAt', 'updatedAt'
      ],
    });

    return res.status(200).json({ Spots: spots });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// GET /api/spots/current - Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  try {
    const spots = await Spot.findAll({
      where: { ownerId: req.user.id },
      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng',
        'name', 'description', 'price', 'createdAt', 'updatedAt', 'previewImage', 'avgRating'
      ],
    });

    return res.status(200).json({
      Spots: spots.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage
      }))
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to retrieve spots',
      error: error.message,
    });
  }
});

// GET /api/spots/:id - Get details of a spot by ID
router.get('/:id', async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Review,
          attributes: ['id', 'review', 'rating'],
        },
        {
          model: SpotImage,
          attributes: ['id', 'url', 'previewImage'],
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    return res.json(spot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
});

// POST /api/spots - Create a new spot
router.post('/', requireAuth, validateSpot(), handleValidationErrors, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price, previewImage, avgRating } = req.body;

  try {
    const spot = await Spot.create({
      ownerId: req.user.id, // Associate the spot with the current user
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      avgRating: avgRating || 0, // Default to 0 if avgRating is not provided
      previewImage: previewImage || null, // Default to null if previewImage is not provided
    });

    return res.status(201).json({
      spot: {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create spot', error: error.message });
  }
});

// POST /spots/:spotId/images - Add an image to a spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  if (!url || preview === undefined) {
    return res.status(400).json({ message: "URL and preview image are required" });
  }

  try {
    // Find the spot by primary key (spotId)
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the user is the of the spot
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to add an image to this spot" });
    }

    // Create a new SpotImage associated with the spot
    const newImage = await SpotImage.create({
      spotId,
      url,
      preview: !!preview, // Ensure preview is a boolean
    });

    return res.status(201).json({
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


// PUT /spots/:spotId - Edit an existing spot
router.put('/:spotId', requireAuth, validateSpot(), handleValidationErrors, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to edit this spot" });
    }

    await spot.update({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    return res.status(200).json(spot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// DELETE /spots/:spotId - Delete an existing spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this spot" });
    }

    await spot.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

module.exports = router;
