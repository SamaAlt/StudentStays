// backend/routes/api/spot-images.js
const router = require('express').Router();
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');

const checkSpotImageExists = async (req, res, next) =>{
    const spotImageId = req.params.imageId;
    
        let spotImage = await SpotImage.findByPk(spotImageId);
        if (!spotImage) {
            const err = new Error("Spot Image couldn't be found");
            err.status = 404;
            return next(err);
        }  
    next();
  }

  // Delete a Spot Image
  router.delete('/:imageId',
    requireAuth, 
    checkSpotImageExists,
    async (req, res, next) => {
    const userId = req.user.id;
    const spotImageId = req.params.imageId;
    let spotImage = await SpotImage.findByPk(spotImageId); 

    const spotId = spotImage.spotId;
    
    
    let spot = await Spot.findByPk(spotId);
    if(userId === spot.ownerId){
     await spotImage.destroy();
   } else{
     const err = new Error(" Spot must belong to the current user");
     err.status = 403;
     return next(err);
   }
   res.status(200).json({message: "Successfully deleted"})
   
 })
 
 module.exports = router;