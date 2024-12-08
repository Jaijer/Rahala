const Agency = require('../models/Agency');
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
      ...(date && { 'dates': { $elemMatch: { departure: new Date(date) } } })
    };

    // Find travels matching the filters and populate the agency data
    const travels = await Travel.find(filters).populate('agency');
    res.json(travels);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new travel and add it to the agency's travels array
exports.createTravel = async (req, res) => {
  try {
    const travelData = req.body;

    // Create and save the new Travel
    const travel = new Travel(travelData);
    await travel.save();

    // Update the Agency's travels array with the new travel ID
    const agency = await Agency.findById(travelData.agency);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    agency.travels.push(travel._id);
    await agency.save();

    res.status(201).json(travel);
  } catch (err) {
    console.error('Error creating travel:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing travel by ID
exports.updateTravel = async (req, res) => {
  try {
    const travelId = req.params.id;
    const updatedData = req.body;

    const travel = await Travel.findByIdAndUpdate(travelId, updatedData, { new: true });
    if (!travel) return res.status(404).json({ message: 'Travel not found' });

    res.json(travel);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a travel by ID
exports.deleteTravel = async (req, res) => {
  try {
    const travelId = req.params.id;

    // Find and delete the travel
    const travel = await Travel.findByIdAndDelete(travelId);
    if (!travel) return res.status(404).json({ message: 'Travel not found' });

    // Remove the travel ID from the associated agency's travels array
    const agency = await Agency.findById(travel.agency);
    if (agency) {
      agency.travels = agency.travels.filter(id => id.toString() !== travelId);
      await agency.save();
    }

    res.status(200).json({ message: 'Travel deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
