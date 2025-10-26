const Event = require('../models/Event');
const Venue = require('../models/Venue');
const User = require('../models/User');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Event Organizer)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      venue,
      eventDate,
      startTime,
      endTime,
      requiredSkills,
      addOns,
      category,
      attendees,
      isPublic
    } = req.body;

    // Get venue details for pricing
    const venueData = await Venue.findById(venue);
    if (!venueData) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const event = await Event.create({
      title,
      description,
      organizer: req.user._id,
      venue,
      eventDate,
      startTime,
      endTime,
      requiredSkills,
      addOns: addOns || [],
      category,
      attendees,
      isPublic: isPublic || false,
      budget: {
        venuePrice: venueData.pricePerDay
      },
      status: 'draft'
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events for organizer
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'eventOrganizer') {
      query.organizer = req.user._id;
    } else if (req.user.role === 'eventManager') {
      query.eventManager = req.user._id;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .populate('eventManager', 'name email')
      .populate('venue', 'name location')
      .sort('-createdAt');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email phone')
      .populate('eventManager', 'name email phone')
      .populate('venue');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Event Organizer)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('venue');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Event Organizer)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Invite event manager to event
// @route   POST /api/events/:id/invite-manager
// @access  Private (Event Organizer)
const inviteEventManager = async (req, res) => {
  try {
    const { managerId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== 'eventManager') {
      return res.status(400).json({ message: 'Invalid event manager' });
    }

    event.eventManager = managerId;
    event.status = 'recruiting';
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add add-ons to event
// @route   POST /api/events/:id/addons
// @access  Private (Event Organizer)
const addEventAddOns = async (req, res) => {
  try {
    const { addOns } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    event.addOns = [...event.addOns, ...addOns];
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event status (for event manager)
// @route   PUT /api/events/:id/status
// @access  Private (Event Manager)
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the event manager
    if (!event.eventManager || event.eventManager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized. Only the event manager can update event status.' });
    }

    // Validate status transitions
    const validTransitions = {
      'confirmed': ['ongoing'],
      'ongoing': ['completed']
    };

    if (!validTransitions[event.status] || !validTransitions[event.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${event.status} to ${status}`
      });
    }

    event.status = status;
    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name email phone')
      .populate('eventManager', 'name email phone')
      .populate('venue');

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  inviteEventManager,
  addEventAddOns,
  updateEventStatus
};
