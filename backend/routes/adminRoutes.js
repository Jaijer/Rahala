const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define admin routes
router.get('/:id', adminController.getAdminById);

// Get an admin by email
router.get('/email/:email', adminController.getAdminByEmail);

module.exports = router;
