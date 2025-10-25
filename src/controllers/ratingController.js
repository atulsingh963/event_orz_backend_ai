const Rating = require('../models/Rating');
const Event = require('../models/Event');
const Invitation = require('../models/Invitation');

// @desc    Create rating for talent
// @route   POST /api/ratings
// @access  Private (Event Organizer/Manager)
const createRating = async (req, res) => {
  try {
    const { eventId, talentId, rating, review, categories } = req.body;

    // Verify event exists and is completed
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate talents after event completion' });
    }

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
      talent: talentId,
      status: 'accepted'
    });

    if (!invitation) {
      return res.status(400).json({ message: 'Talent did not participate in this event' });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      event: eventId,
      talent: talentId,
      ratedBy: req.user._id
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this talent for this event' });
    }

    const newRating = await Rating.create({
      event: eventId,
      talent: talentId,
      ratedBy: req.user._id,
      rating,
      review,
      categories
    });

    const populatedRating = await Rating.findById(newRating._id)
      .populate('talent', 'name email')
      .populate('ratedBy', 'name')
      .populate('event', 'title eventDate');

    res.status(201).json(populatedRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a talent
// @route   GET /api/ratings/talent/:talentId
// @access  Public
const getTalentRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ talent: req.params.talentId })
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
  getTalentRatings,
  getEventRatings,
  updateRating
};
