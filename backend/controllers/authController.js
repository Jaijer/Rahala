const AuthUser = require('../models/AuthUser');

// Create a new AuthUser
exports.createAuthUser = async (req, res) => {
  try {
    const { email, userType } = req.body;
    const authUser = new AuthUser({ email, userType });
    await authUser.save();
    res.status(201).json(authUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get an AuthUser by email
exports.getAuthUserByEmail = async (req, res) => {
  try {
    console.log("Fetching AuthUser by email:", req.params.email);

      const { email } = req.params;
      const authUser = await AuthUser.findOne({ email });
      if (!authUser) {
          return res.status(404).json({ message: 'AuthUser not found' });
      }
      res.json(authUser);
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
};


// Delete an AuthUser by email
exports.deleteAuthUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const deletedAuthUser = await AuthUser.findOneAndDelete({ email });
    if (!deletedAuthUser) {
      return res.status(404).json({ message: 'AuthUser not found' });
    }
    res.json({ message: 'AuthUser deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
