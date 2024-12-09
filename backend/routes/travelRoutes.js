const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// Get a single travel by ID
router.get('/:id', travelController.getTravelById);

// Get all travels
router.get('/', travelController.getAllTravels);

// Create a new travel
router.post('/', travelController.createTravel);

// Update a travel by ID
router.put('/:id', travelController.updateTravel);

// Delete a travel by ID
router.delete('/:id', travelController.deleteTravel);

module.exports = router;
