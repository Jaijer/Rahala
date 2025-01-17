const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkUser, checkAgency } = require('../middleware/authMiddleware');

// Route to get a User by email
router.get('/email/:email', userController.getUserByEmail);

// Define other user routes
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);

// Add a travel to a user's registeredTravels
router.post('/:userId/add-travel', verifyToken, checkUser, userController.addTravelToUser);

// A route to delete a traveler by ID
router.delete('/travelers/:id', verifyToken, checkAgency, userController.deleteTraveler);

// A route to update user settings
router.put('/user-settings/:id', verifyToken, checkUser, userController.updateSettings);
router.put('/user-settings/notifications/:id', verifyToken, checkUser, userController.updateNotificationSettings);

module.exports = router;
