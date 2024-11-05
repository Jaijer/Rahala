const Admin = require('../models/Admin');

// Get Admin by email
exports.getAdminByEmail = async (req, res) => {
  try {
    console.log("Fetching Admin by email:", req.params.email);
    
    const { email } = req.params;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
