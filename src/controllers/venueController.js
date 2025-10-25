const Venue = require('../models/Venue');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
const getVenues = async (req, res) => {
  try {
    const { city, minCapacity, maxPrice } = req.query;
    let query = { isAvailable: true };

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    if (minCapacity) {
      query.capacity = { $gte: parseInt(minCapacity) };
    }
    if (maxPrice) {
      query.pricePerDay = { $lte: parseInt(maxPrice) };
    }

    const venues = await Venue.find(query).sort('pricePerDay');
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create venue (Admin only - for demo purposes)
// @route   POST /api/venues
// @access  Public
const createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVenues,
  getVenueById,
  createVenue
};
