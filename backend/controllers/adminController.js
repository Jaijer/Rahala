const Admin = require('../models/Admin');
const Agency = require('../models/Agency'); // Make sure to import Agency model

// Get Admin by email
exports.getAdminByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all registered agencies
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.find({});
    res.status(200).json({ success: true, agencies }); // Send agencies in response

  } catch (error) {
    console.error('Error fetching agencies:', error); // This will now log the actual error
    res.status(500).json({ message: 'Server error', error: error.message }); // Send back the actual error
  }
};

// Delete agency by ID
exports.deleteAgency = async (req, res) => {
  const { id } = req.params;
  try {
    const agency = await Agency.findByIdAndDelete(id);
    if (!agency) {
      return res.status(404).json({ success: false, message: 'Agency not found' });
    }
    res.status(200).json({ success: true, message: 'Agency deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting agency', error: error.message });
  }
};
