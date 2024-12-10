const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 🔥 Move this route ABOVE the /:id route
router.get('/agencies', adminController.getAllAgencies);

// Route to get an admin by ID
router.get('/:id', adminController.getAdminById);

// Get an admin by email
router.get('/email/:email', adminController.getAdminByEmail);

// Route to delete an agency by ID
router.delete('/agencies/:id', adminController.deleteAgency);

module.exports = router;
