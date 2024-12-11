// backend/models/Travel.js
const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  travelName: { type: String, required: true },
  capacity: { type: Number, required: true },
  from: { type: String, required: true },
  destination: { type: String, required: true },
  dates: [{
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
  },],
  description: { type: String },
  image: { type: String },
  packages: [{
    title: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ['رخيص', 'فاخر', 'افضل قيمة'], 
      default: 'رخيص'
    }
  }],
  isAvailable: { type: Boolean, default: true },
  agency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true },
  travellers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      package: { type: String, required: true },
      date: {
        departure: { type: Date, required: true },
        arrival: { type: Date, required: true }
      }
    }
  ],
});

module.exports = mongoose.model('Travel', travelSchema);