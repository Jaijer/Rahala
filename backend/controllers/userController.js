const Travel = require('../models/Travel');
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
    const { email, name, phoneNumber } = req.body;
    const newUser = new User({ email, name, phoneNumber });
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
  const { travelId, package: packageType, date } = req.body;

  try {
    // First check if user exists and if they already registered for this travel
    const existingUser = await User.findById(userId);
    
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has already registered for this travel
    const hasRegistered = existingUser.registeredTravels.some(
      registration => registration.travel.toString() === travelId
    );

    if (hasRegistered) {
      return res.status(400).json({ 
        message: 'You have already registered for this travel',
        success: false
      });
    }

    // Update the user's registeredTravels
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          registeredTravels: {
            travel: travelId,
            package: packageType,
            date,
          },
        },
      },
      { new: true } // Return the updated document
    );


    // Update the travel's travellers list
    const travel = await Travel.findByIdAndUpdate(
      travelId,
      {
        $push: {
          travellers: {
            user: userId,
            package: packageType,
            date,
          },
        },
      },
      { new: true } // Return the updated document
    );

    if (!travel) {
      return res.status(404).json({ message: 'Travel not found' });
    }

    res.json({ user, travel });
  } catch (err) {
    console.error('Error adding travel:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteTraveler = async (req, res) => {
  const travelerId = req.params.id;

  try {
    // Find the traveler first to get the associated user and travel details
    const traveler = await Travel.findOne({ 'travellers._id': travelerId });
    if (!traveler) {
      return res.status(404).json({ message: 'Traveler not found' });
    }

    // Find the specific traveler object within the travellers array
    const travelerToRemove = traveler.travellers.find(t => t._id.toString() === travelerId);

    if (!travelerToRemove) {
      return res.status(404).json({ message: 'Traveler details not found' });
    }

    // Remove the traveler from the travel's travellers list
    await Travel.findByIdAndUpdate(
      traveler._id,
      { $pull: { travellers: { _id: travelerId } } },
      { new: true }
    );

    // Remove the travel from the user's registered travels
    await User.findByIdAndUpdate(
      travelerToRemove.user,
      { $pull: { registeredTravels: { travel: traveler._id } } },
      { new: true }
    );

    res.json({ message: 'Traveler deleted successfully' });
  } catch (err) {
    console.error('Error deleting traveler:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get details of a specific booking
exports.getBookingDetails = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const userId = req.user.uid;

    // Find the user and their registered travel
    const user = await User.findOne({ email: req.user.email })
      .populate({
        path: 'registeredTravels.travel',
        populate: {
          path: 'agency',
          select: 'name phoneNumber'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // Find the specific booking
    const booking = user.registeredTravels.find(
      travel => travel._id.toString() === bookingId
    );

    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error in getBookingDetails:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب تفاصيل الحجز' });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const userId = req.user.uid;

    // Find the user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    // Find the booking index
    const bookingIndex = user.registeredTravels.findIndex(
      travel => travel._id.toString() === bookingId
    );

    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    // Get the travel details before removing the booking
    const booking = user.registeredTravels[bookingIndex];
    const travel = await Travel.findById(booking.travel);

    if (!travel) {
      return res.status(404).json({ message: 'الرحلة غير موجودة' });
    }

    // Remove the booking from registeredTravels
    user.registeredTravels.splice(bookingIndex, 1);
    await user.save();

    // Remove the user from travel's travellers
    const travellerIndex = travel.travellers.findIndex(
      t => t.user.toString() === user._id.toString()
    );
    
    if (travellerIndex !== -1) {
      travel.travellers.splice(travellerIndex, 1);
      await travel.save();
    }

    res.status(200).json({ message: 'تم إلغاء الحجز بنجاح' });
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إلغاء الحجز' });
  }
};

// Update User Settings
exports.updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(id, { name, phoneNumber }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Settings updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { advNotifications, tripNotifications } = req.body;

    const user = await User.findByIdAndUpdate(id, { advNotifications, tripNotifications }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Notifcation Settings updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};