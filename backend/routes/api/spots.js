// backend/routes/api/spots.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { where, fn, col, Op } = require('sequelize');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../../config');
const reviewimage = require('../../db/models/reviewimage');
const { secret } = jwtConfig;


const router = express.Router();
router.use(cookieParser());

const validateSpots = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .isFloat({min: -90, max: 90})
        .withMessage('Latitude is not valid'),
    check('lng')
        .isFloat({min: -180, max: 180})
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({max: 50})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .isFloat({min: 0})
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReviews = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isFloat({min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];


const validateQuery = [
    check('page')
        .optional()
        .isInt({ min: 1 })  
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({min:2, max:20})
        .withMessage('Size must be between 1 and 20'),
    check('maxLat')
        .optional()
        .isFloat()
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .optional()
        .isFloat()
        .withMessage('Minimum latitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat()
        .withMessage('Maximum longitude is invalid'),
    check('minLng')
        .optional()
        .isFloat()
        .withMessage('Minimum longitude is invalid'),
    check('minPrice')
        .optional()
        .isFloat({min:0})
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .optional()
        .isFloat({min:0})
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
];

const checkSpotExists = async (req, res, next) =>{
    const spotId = req.params.spotId;
        let spot = await Spot.findByPk(spotId);

        if (!spot) {
            res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }  
    next();
}

// Create a Review for a Spot based on the Spot's id
router.post(
    '/:spotId/reviews',
    validateReviews,
    requireAuth,
    async (req, res) => {
        const {review, stars} = req.body;

        const userId = req.user.id;
        const spotId = parseInt(req.params.spotId, 10);

        const existingSpotId = await Spot.findByPk(spotId);
        if (!existingSpotId) {
            res.status(404);
            return res.json({
                message: "Spot couldn't be found"
            });
        }

        const existingReview = await Review.findOne({
            where: {userId, spotId}
        });
        if (existingReview) {
            res.status(500);
            return res.json({
                message: "User already has a review for this spot"
            });
        }
        
        const spotReview = await Review.create({
            userId,
            spotId,
            review,
            stars,
        });

        res.status(201);
        return res.json({
            id: spotReview.id,
            userId: spotReview.userId,
            spotId: spotReview.spotId,
            review: spotReview.review,
            stars: spotReview.stars,
            createdAt: spotReview.createdAt,
            updatedAt: spotReview.updatedAt
        });
    }
);

// Create a Spot
router.post(
    '/',
    validateSpots,
    requireAuth,
    async (req, res, next) => {
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        } = req.body;        

        const ownerId = req.user.id;
        
        const spot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })

        console.log('Data 1:', spot.dataValues);

        res.status(201);
        return res.json(
            spot.dataValues
                // {
                // id: spot.id,
                // ownerId: spot.dataValues.ownerId,
                // address: spot.dataValues.address,
                // city: spot.dataValues.city,
                // state: spot.dataValues.state,
                // country: spot.dataValues.country,
                // lat: spot.dataValues.lat,
                // lng: spot.dataValues.lng,
                // name: spot.dataValues.name,
                // description: spot.dataValues.description,
                // price: spot.dataValues.price,
                // createdAt: spot.dataValues.createdAt,
                // updatedAt: spot.dataValues.updatedAt
            // }
        );
    }
);



// Add an Image to a Spot based on the Spot's id
router.post(
    '/:spotId/images',
    requireAuth,
    async (req, res) => {
        const {url, preview} = req.body;

        const userId = req.user.id;
        const spotId = parseInt(req.params.spotId, 10);
               
        const existingSpot = await Spot.findByPk(spotId);

        if (!existingSpot) {
            res.status(404);
            return res.json({
                message: "Spot couldn't be found" // And needs to belong to user
            });
        }
        
        if (userId === existingSpot.ownerId) {
            const spotImage = await SpotImage.create({
                spotId,
                url,
                preview
            });
    
            res.status(201);
            return res.json({
                id: spotImage.id,
                url: spotImage.url,
                preview: spotImage.preview
            });
        } else{
            res.status(403).json('Spot must belong to the current user')
        }       
    }
);

// Get all Spots owned by the Current User
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        const spots = await Spot.findAll({
            where: {ownerId: userId},
            include: [
                {model: Review, attributes: []},
                {model: SpotImage}
            ],
            attributes: {
                include: [
                    [fn('AVG', col('Reviews.stars')),'avgRating'],
                    [col('SpotImages.url'), 'previewImage']
                ]
            },
            group: ['Spot.id', 'SpotImages.id']
        });

        const allUserSpots = spots.map(spot => ({
            id: spot.dataValues.id,
            ownerId: spot.dataValues.ownerId,
            address: spot.dataValues.address,
            city: spot.dataValues.city,
            state: spot.dataValues.state,
            country: spot.dataValues.country,
            lat: spot.dataValues.lat,
            lng: spot.dataValues.lng,
            name: spot.dataValues.name,
            description: spot.dataValues.description,
            price: spot.dataValues.price,
            createdAt: spot.dataValues.createdAt,
            updatedAt: spot.dataValues.updatedAt,
            avgRating: spot.dataValues.avgRating,
            previewImage: spot.dataValues.previewImage
        }));

        res.status(200);
        return res.json({
            Spots: allUserSpots
        });
    }
);


//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', 
    checkSpotExists,
    async (req, res) => {
    const spotId = req.params.spotId;
    const reviews = await Review.findAll({
        where:{spotId: spotId},
        include:[
            {
                model: User,
                attributes:['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]  
    })

    res.status(200).json(
        {Reviews: reviews});
})


// Get details of a Spot from an id
router.get('/:spotId', async (req, res) =>{
    const spotId = req.params.spotId;
    //     console.log('\nspotId:', spotId,'\n');
    //     let spot = await Spot.findByPk(spotId)
    //     console.log('\nspot:', spot)

    try{

        let spot = await Spot.findByPk(spotId, {
            include:[{
                model:SpotImage,
                attributes: ['id', 'url', 'preview'],
                required:false
            },{
               model: User, 
               as: 'Owner',
               attributes: ['id', 'firstName', 'lastName'], 
               required:true        
            }]
        });
    
        if (!spot) {
            res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }
    
        let totalStars = await Review.sum(
            'stars',
            {where:{spotId:spot.id}}
        );
        let reviewsCount = await Review.count(
            {where:{spotId:spot.id}}
        );
        
        if (reviewsCount !== 0){
            let avgStarRating = totalStars/reviewsCount;
            spot.dataValues.avgStarRating = avgStarRating;
        } else {
            spot.dataValues.avgStarRating = 0;
        }
        spot.dataValues.numReviews = reviewsCount;   
    
        res.status(200).json(spot);
    } catch(error){
        res.status(500).json({message:'Internal server error.'})
    }
    
})


// Get all Spots and Add Query Filter and Pagination
router.get('/', validateQuery,
    async (req, res) => {
    
    let where = {};
    let pagination = {};
    
    let {page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    
    page = parseInt(page);
    size = parseInt(size);
    minLat = parseFloat(minLat);
    maxLat = parseFloat(maxLat);
    minLng = parseFloat(minLng);
    maxLng = parseFloat(maxLng);
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);
    
    pagination.limit = size;
    pagination.offset = size * (page - 1);

    if (minLat && maxLat){
        where.lat = {[Op.between]:[minLat, maxLat]};
    } else if (minLat) {
        where.lat = {[Op.gte]: minLat};
    } else if(maxLat){
        where.lat = {[Op.lte]: maxLat}
    }

    if (minLng && maxLng){
        where.lng = {[Op.between]:[minLng, maxLng]};
    } else if (minLng) {
        where.lng = {[Op.gte]: minLng};
    } else if(maxLng){
        where.lng = {[Op.lte]: maxLng}
    }

    if (minPrice && maxPrice){
        where.price = {[Op.between]:[minPrice, maxPrice]};
    } else if (minPrice) {
        where.price = {[Op.gte]: minPrice};
    } else if(maxPrice){
        where.price = {[Op.lte]: maxPrice}
    }

    const filteredSpots = await Spot.findAll({
        where,
        include:[{
            model:SpotImage,
            where:{preview:true},
            required:false
        }],
        ...pagination
    });
    
    let spotsWithRating = await Promise.all(filteredSpots.map(async spot => {
        let totalStars = await Review.sum(
            'stars',
            {where:{spotId:spot.id}}
        );
        let reviewsCount = await Review.count(
            {where:{spotId:spot.id}}
        );

        if (reviewsCount !== 0){
            let avgRating = totalStars/reviewsCount;
            spot.dataValues.avgRating = avgRating;
        } else {
            spot.dataValues.avgRating = 0;
        }
        
        if (spot.SpotImages && spot.SpotImages.length > 0) {
            spot.dataValues.previewImage = spot.SpotImages[0].dataValues.url; 
        } else {
            spot.dataValues.previewImage = null;
        }
      
        delete spot.dataValues.SpotImages;
        

        return spot
    })
)
        // console.log(`\nspotId: `, spot.id)

    const safeSpots = spotsWithRating.map(spot => ({
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
        avgRating: spot.dataValues.avgRating,
        previewImage: spot.dataValues.previewImage
    }));

    const Spots= {};
    Spots.Spots = safeSpots;

    Spots.page = page;
    Spots.size = size;

    res.status(200).json(Spots);
    
})



// Edit a Spot

// const getUserFromCookies = (req, res, next) => {
//     const token = req.cookies.token;
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded.data;
//     next();
// }



router.put(
    '/:spotId',
    checkSpotExists,
    requireAuth,
    validateSpots,
    // getUserFromCookies,
    async (req, res, next) => {
        const spotId = req.params.spotId;
        let spot = await Spot.findByPk(spotId);

        if (req.user.id === spot.ownerId){
          
            const {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
            } = req.body;
    
            
            spot.set({
                address: address,
                city: city,
                state: state,
                country: country,
                lat: lat,
                lng: lng,
                name: name,
                description: description,
                price: price
            })
    
            await spot.save();
    
            const safeSpot = {
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
                updatedAt: spot.updatedAt
            };
            res.status(200);
            res.json(safeSpot);

        }else{
            res.status(403).json('Spot must belong to the current user.')
        }

    } 
       
);

// delete a spot
router.delete('/:spotId', 
    requireAuth,
    async (req, res, next) => {
     const spotId = req.params.spotId;
     const userId = req.user.id;
     const spot = await Spot.findByPk(spotId)

     if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }  

     if(userId === spot.ownerId){
        await spot.destroy();
        res.status(200).json({
            message: "Successfully deleted"
        })
     } else{
        const err = new Error('Spot must belong to the current user');
        err.status = 403;
        return next(err);
     }
         
})

module.exports = router;