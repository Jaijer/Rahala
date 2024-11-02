const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['user', 'agency', 'admin'], required: true }
});

module.exports = mongoose.model('AuthUser', authUserSchema);
