const express = require('express');
const router = express.Router();
const userController = require('../controllers/fetchController'); // Correct the path to your controller

// Define your routes and use the controller
router.post('/fetch_products', userController);

module.exports = router;
