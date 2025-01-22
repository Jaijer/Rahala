const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  travels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Travel' }]
});

module.exports = mongoose.model('Agency', agencySchema);
