// backend/routes/api/spots.js
const express = require('express');
const { Spot, SpotImage } = require('../../db/models'); // Import the Spot model
const router = express.Router();

const { requireAuth } = require('../../utils/auth');


// GET /api/spots - Get all spots
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll({
      attributes: [
        'id', 
        'ownerId', 
        'address', 
        'city', 
        'state', 
        'country', 
        'lat', 
        'lng', 
        'name', 
        'description', 
        'price', 
        'createdAt', 
        'updatedAt', 
        'avgRating', 
        'previewImage'
      ]
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
        avgRating: spot.avgRating, // You may need to calculate avgRating if not present in the model
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

// GET /api/spots/current - Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  try {
    const spots = await Spot.findAll({
      where: { ownerId: req.user.id },  // Fetch spots where ownerId matches the authenticated user
      attributes: [
        'id', 
        'ownerId', 
        'address', 
        'city', 
        'state', 
        'country', 
        'lat', 
        'lng', 
        'name', 
        'description', 
        'price', 
        'createdAt', 
        'updatedAt', 
        'previewImage',
        'avgRating'  // You can calculate avgRating as necessary
      ]
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
        avgRating: spot.avgRating, // Calculate avgRating if needed
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
router.get('/:id', async (req, res, next) => {
    const { id } = req.params; // Get the spot ID from the URL
  
    try {
      // Fetch the spot by its ID, including its associated images and owner details
      const spot = await Spot.findOne({
        where: { id },
        include: [
          {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
          },
          {
            model: User,  // Assuming the spot is owned by a user (owner)
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
  
      // If the spot isn't found, return a 404 error
      if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found"
        });
      }
  
      // Return the spot details with its images and owner information
      return res.status(200).json({
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
        numReviews: spot.numReviews,
        avgStarRating: spot.avgStarRating,
        SpotImages: spot.SpotImages,
        Owner: spot.Owner
      });
    } catch (error) {
      console.error(error);
      return next(error);  // Let the error be handled by the error handler middleware
    }
  });
  
// POST /api/spots - Create a new spot
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price, previewImage } = req.body;
  
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
        previewImage
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
          previewImage: spot.previewImage
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to create spot', error: error.message });
    }
  });

// POST /spots - Create a new Spot
router.post('/', async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  // Validate required fields
  const errors = validateSpotCreation(req.body); // Custom validation utility
  if (errors.length) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors.reduce((acc, error) => {
        acc[error.field] = error.message;
        return acc;
      }, {})
    });
  }

  try {
    // Create a new spot
    const newSpot = await Spot.create({
      ownerId: req.user.id,  // Assume that the user ID is available from authentication middleware
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

    return res.status(201).json(newSpot);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
});
 
// POST /spots/:spotId/images - Add an image to a spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Ensure the current user is the owner of the spot
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to add an image to this spot" });
  }

  try {
    // Create the new image for the spot
    const newImage = await SpotImage.create({
      spotId,
      url,
      preview,
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
router.put('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  // Validate input fields
  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
  if (lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
  if (name.length > 50) errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (price <= 0) errors.price = "Price per day must be a positive number";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors
    });
  }

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Ensure the current user is the owner of the spot
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to edit this spot" });
  }

  // Update the spot with new data
  try {
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

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Ensure the current user is the owner of the spot
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to delete this spot" });
  }

  // Delete the spot
  try {
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

// GET /spots - Get all spots with query filters
router.get('/spots', async (req, res) => {
  const { city, state, country, minPrice, maxPrice, name, page = 1, limit = 20 } = req.query;
  
  try {
    // Construct filter conditions
    let filters = {};

    if (city) filters.city = city;
    if (state) filters.state = state;
    if (country) filters.country = country;
    if (name) filters.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive match for name
    if (minPrice) filters.price = { [Op.gte]: minPrice };
    if (maxPrice) filters.price = { [Op.lte]: maxPrice };
    
    // Paginate results
    const spots = await Spot.findAll({
      where: filters,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    return res.status(200).json({ spots });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


 
module.exports = router;
