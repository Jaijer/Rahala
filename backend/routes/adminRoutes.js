const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define admin routes
router.get('/:id', adminController.getAdminById);

module.exports = router;
