// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

// API Routes
router.use('/api', apiRouter);

// Default root route
router.get('/', (req, res) => {
  res.send('Welcome to student_stays Backend!');
});

// CSRF route for testing
router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});
// Catch-all route for debugging
router.all('*', (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Testing route
router.get('/hello/world', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

module.exports = router;
