const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  advNotifications: { type: Boolean, default: false },
  tripNotifications: { type: Boolean, default: true },
  registeredTravels: [
    {
      travel: { type: mongoose.Schema.Types.ObjectId, ref: 'Travel', required: true },
      package: { type: String, required: true },
      date: {
        departure: { type: Date, required: true },
        arrival: { type: Date, required: true }
      }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
