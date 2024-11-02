const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to create a new AuthUser
router.post('/', authController.createAuthUser);

// Route to get an AuthUser by email
router.get('/:email', authController.getAuthUserByEmail);

// Route to delete an AuthUser by email
router.delete('/:email', authController.deleteAuthUserByEmail);

module.exports = router;
