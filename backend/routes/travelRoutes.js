const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// Get a single travel by ID
router.get('/:id', travelController.getTravelById);

// Get all travels
router.get('/', travelController.getAllTravels);

// Create a new travel
router.post('/', travelController.createTravel);

module.exports = router;
