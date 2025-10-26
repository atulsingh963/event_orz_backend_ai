const Rating = require('../models/Rating');
const Event = require('../models/Event');
const Invitation = require('../models/Invitation');

// @desc    Create rating for talent or event manager
// @route   POST /api/ratings
// @access  Private (Event Organizer/Manager)
const createRating = async (req, res) => {
  try {
    const { eventId, userId, userType, rating, review, categories } = req.body;

    // Verify event exists and is completed
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate after event completion' });
    }

    // Authorization based on user type
    if (userType === 'talent') {
      // Verify user is organizer or manager of the event
      const isAuthorized =
        event.organizer.toString() === req.user._id.toString() ||
        (event.eventManager && event.eventManager.toString() === req.user._id.toString());

      if (!isAuthorized) {
        return res.status(403).json({ message: 'Not authorized to rate talents for this event' });
      }

      // Verify talent was invited and accepted
      const invitation = await Invitation.findOne({
        event: eventId,
        talent: userId,
        status: 'accepted'
      });

      if (!invitation) {
        return res.status(400).json({ message: 'Talent did not participate in this event' });
      }
    } else if (userType === 'eventManager') {
      // Only organizer can rate event manager
      if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only event organizer can rate event manager' });
      }

      // Verify this was the event manager
      if (!event.eventManager || event.eventManager.toString() !== userId) {
        return res.status(400).json({ message: 'This user was not the event manager' });
      }
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      event: eventId,
      ratedUser: userId,
      ratedBy: req.user._id
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this user for this event' });
    }

    const newRating = await Rating.create({
      event: eventId,
      ratedUser: userId,
      talent: userType === 'talent' ? userId : undefined, // For backward compatibility
      ratedBy: req.user._id,
      userType,
      rating,
      review,
      categories
    });

    const populatedRating = await Rating.findById(newRating._id)
      .populate('ratedUser', 'name email')
      .populate('ratedBy', 'name')
      .populate('event', 'title eventDate');

    res.status(201).json(populatedRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a user (talent or event manager)
// @route   GET /api/ratings/user/:userId
// @access  Public
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate('ratedBy', 'name')
      .populate('event', 'title eventDate')
      .sort('-createdAt');

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a talent (backward compatibility)
// @route   GET /api/ratings/talent/:talentId
// @access  Public
const getTalentRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.talentId, userType: 'talent' })
      .populate('ratedBy', 'name')
      .populate('event', 'title eventDate')
      .sort('-createdAt');

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for an event
// @route   GET /api/ratings/event/:eventId
// @access  Private
const getEventRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ event: req.params.eventId })
      .populate('talent', 'name email skills')
      .populate('ratedBy', 'name')
      .sort('-createdAt');

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update rating
// @route   PUT /api/ratings/:id
// @access  Private
const updateRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (rating.ratedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this rating' });
    }

    const { rating: ratingValue, review, categories } = req.body;

    if (ratingValue) rating.rating = ratingValue;
    if (review) rating.review = review;
    if (categories) rating.categories = categories;

    const updatedRating = await rating.save();

    res.json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRating,
  getUserRatings,
  getTalentRatings,
  getEventRatings,
  updateRating
};
