const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');

// Get a single agency by ID
router.get('/:id', agencyController.getAgencyById);

// Get all agencies
router.get('/', agencyController.getAllAgencies);

// Create a new agency
router.post('/', agencyController.createAgency);

// Get a single agency by email
router.get('/email/:email', agencyController.getAgencyByEmail);

module.exports = router;
