const User = require('../models/User');

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create User
exports.createUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    const newUser = new User({ email, name });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a User by email
exports.deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getUserByEmail = async (req, res) => {
  try {
    console.log("Fetching User by email:", req.params.email);

      const { email } = req.params;
      const user = await User.findOne({ email }).populate('registeredTravels.travel');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (err) {
      res.status(500).json({ message: 'Server error' });
  }
};

// Add a travel to a user
exports.addTravelToUser = async (req, res) => {
  const { userId } = req.params;
  const { travelId, package, date } = req.body;

  try {
    // Find the user and update registeredTravels
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $push: { 
          registeredTravels: { 
            travel: travelId, 
            package, 
            date 
          } 
        } 
      },
      { new: true } // Return the updated document
    ).populate('registeredTravels.travel'); // Optionally populate travel details

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
