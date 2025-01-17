const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');
const { verifyToken, checkAgency } = require('../middleware/authMiddleware');

// Get a single travel by ID
router.get('/:id', travelController.getTravelById);

// Get all travels
router.get('/', travelController.getAllTravels);

// Create a new travel
router.post('/', verifyToken, checkAgency, travelController.createTravel);

// Update a travel by ID
router.put('/:id', verifyToken, checkAgency, travelController.updateTravel);

// Delete a travel by ID
router.delete('/:id', verifyToken, checkAgency, travelController.deleteTravel);

module.exports = router;
