const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkAdmin } = require('../middleware/authMiddleware');

router.get('/agencies', verifyToken, checkAdmin, adminController.getAllAgencies);

// Route to get an admin by ID
router.get('/:id', adminController.getAdminById);

// Get an admin by email
router.get('/email/:email', adminController.getAdminByEmail);

// Route to delete an agency by ID
router.delete('/agencies/:id', verifyToken, checkAdmin, adminController.deleteAgency);

module.exports = router;
