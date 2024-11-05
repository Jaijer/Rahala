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
        const { email, name, phone, address } = req.body;
        const newAgency = new Agency({ email, name, phone, address });
        await newAgency.save();
        res.status(201).json(newAgency);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete an agency by email
exports.deleteAgency = async (req, res) => {
    try {
        const { email } = req.params;
        const agency = await Agency.findOneAndDelete({ email });
        if (!agency) return res.status(404).json({ message: 'Agency not found' });
        res.json({ message: 'Agency deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Agency by email
exports.getAgencyByEmail = async (req, res) => {
  try {
    console.log("Fetching Agency by email:", req.params.email);
    
    const { email } = req.params;
    const agency = await Agency.findOne({ email });
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    res.json(agency);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};