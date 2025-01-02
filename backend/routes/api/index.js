// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');

const { restoreUser, requireAuth } = require("../../utils/auth.js");


router.use(restoreUser);
router.use('/users', usersRouter);
router.use('/session', sessionRouter);
router.use('/spots', spotsRouter); 

// GET /api/require-auth
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

// POST route for /test
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;