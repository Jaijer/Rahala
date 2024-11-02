const Agency = require('../models/Agency');

// Get a single agency by ID
exports.getAgencyById = async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id).populate('travels');
    if (!agency) return res.status(404).json({ message: 'Agency not found' });
    res.json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all agencies
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find().populate('travels');
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new agency
exports.createAgency = async (req, res) => {
  try {
    const { uid, email, name, phone, address } = req.body;
    const newAgency = new Agency({ uid, email, name, phone, address });
    await newAgency.save();
    res.status(201).json(newAgency);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
