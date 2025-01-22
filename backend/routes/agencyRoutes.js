const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');
const { verifyToken, checkAgency } = require('../middleware/authMiddleware');

// Get all agencies
router.get('/', agencyController.getAllAgencies);

// Get a single agency by email
router.get('/email/:email', agencyController.getAgencyByEmail);

// Agency settings routes
router.put('/agency-settings/:id', verifyToken, checkAgency, agencyController.updateSettings);

// Create a new agency
router.post('/', agencyController.createAgency);

// Get a single agency by ID (keep this last to avoid conflicts)
router.get('/:id', agencyController.getAgencyById);

module.exports = router;
