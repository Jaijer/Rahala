const User = require('../models/User');

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};
