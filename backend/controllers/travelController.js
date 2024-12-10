const Agency = require('../models/Agency');
const Travel = require('../models/Travel');
const User = require('../models/User');

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

// Get a single travel by ID
exports.getTravelById = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id)
      .populate('agency')  // Populate the agency details
      .populate('travellers.user');  // Populate the user details inside travellers array

    if (!travel) return res.status(404).json({ message: 'Travel not found' });

    res.json(travel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllTravels = async (req, res) => {
  try {
    const { departure, destination, date } = req.query;

    // Build query filters based on search parameters
    const filters = {};

    // Implement case-insensitive partial matching for departure and destination
    if (departure) {
      filters.from = { $regex: departure, $options: 'i' };
    }

    if (destination) {
      filters.destination = { $regex: destination, $options: 'i' };
    }

    // Improve date filtering
    if (date) {
      const inputDate = new Date(date);
      
      // Set the date range to cover the entire day
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);

      filters['dates'] = { 
        $elemMatch: { 
          departure: { 
            $gte: startOfDay, 
            $lte: endOfDay 
          } 
        } 
      };
    }

    // Find travels matching the filters and populate the agency data
    const travels = await Travel.find(filters).populate('agency');
    
    res.json(travels);
  } catch (err) {
    console.error(err);
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

    // Remove the travel ID from all users' registeredTravels array
    const users = await User.updateMany(
      { "registeredTravels.travel": travelId },
      { $pull: { registeredTravels: { travel: travelId } } }
    );

    res.status(200).json({ 
      message: 'Travel deleted successfully', 
      agencyUpdated: Boolean(agency),
      usersUpdated: users.modifiedCount // Number of users updated
    });
  } catch (err) {
    console.error('Error deleting travel:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
