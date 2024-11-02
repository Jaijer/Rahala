const Travel = require('../models/Travel');

// Get a single travel by ID
exports.getTravelById = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id).populate('agency');
    if (!travel) return res.status(404).json({ message: 'Travel not found' });
    res.json(travel);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all travels with optional search filters
exports.getAllTravels = async (req, res) => {
  try {
    const { departure, destination, date } = req.query;

    // Build query filters based on search parameters
    const filters = {
      ...(departure && { from: departure }),
      ...(destination && { destination }),
      ...(date && { 'dates.departure': new Date(date) })
    };

    // Find travels matching the filters and populate the agency data
    const travels = await Travel.find(filters).populate('agency');
    res.json(travels);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new travel
exports.createTravel = async (req, res) => {
  try {
    const travelData = req.body;

    // Create and save the new Travel
    const travel = new Travel(travelData);
    await travel.save();

    res.status(201).json(travel);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
