const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get a User by email
router.get('/email/:email', userController.getUserByEmail);

// Define other user routes
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:email', userController.deleteUserByEmail);

// Add a travel to a user's registeredTravels
router.post('/:userId/add-travel', userController.addTravelToUser);

module.exports = router;
