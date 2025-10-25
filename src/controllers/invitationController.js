const Invitation = require('../models/Invitation');
const User = require('../models/User');
const Event = require('../models/Event');

// @desc    Get all talents (for Event Manager to browse)
// @route   GET /api/talents
// @access  Private (Event Manager)
const getTalents = async (req, res) => {
  try {
    const { skills, minRating, role } = req.query;
    let query = { isActive: true };

    // If role is specified, use it, otherwise default to 'talent'
    if (role) {
      query.role = role;
    } else {
      query.role = 'talent';
    }

    if (skills && query.role === 'talent') {
      query.skills = { $in: skills.split(',') };
    }
    if (minRating && query.role === 'talent') {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-averageRating');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send invitation to talent
// @route   POST /api/invitations
// @access  Private (Event Manager)
const sendInvitation = async (req, res) => {
  try {
    const { eventId, talentId, skill, message, expiryDate, compensation } = req.body;

    // Verify event and that user is the manager
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.eventManager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send invitations for this event' });
    }

    // Verify talent exists
    const talent = await User.findById(talentId);
    if (!talent || talent.role !== 'talent') {
      return res.status(400).json({ message: 'Invalid talent' });
    }

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({
      event: eventId,
      talent: talentId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'Invitation already sent to this talent' });
    }

    const invitation = await Invitation.create({
      event: eventId,
      talent: talentId,
      invitedBy: req.user._id,
      skill,
      message,
      expiryDate,
      compensation
    });

    const populatedInvitation = await Invitation.findById(invitation._id)
      .populate('talent', 'name email skills averageRating')
      .populate('event', 'title eventDate');

    res.status(201).json(populatedInvitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get invitations for an event
// @route   GET /api/invitations/event/:eventId
// @access  Private (Event Manager/Organizer)
const getEventInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({ event: req.params.eventId })
      .populate('talent', 'name email skills averageRating profileImage')
      .populate('invitedBy', 'name email')
      .sort('-createdAt');

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get invitations for talent
// @route   GET /api/invitations/my-invitations
// @access  Private (Talent)
const getMyInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      talent: req.user._id,
      status: { $in: ['pending', 'accepted'] }
    })
      .populate('event', 'title description eventDate startTime endTime')
      .populate('invitedBy', 'name email phone')
      .sort('-createdAt');

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to invitation (Accept/Reject)
// @route   PUT /api/invitations/:id/respond
// @access  Private (Talent)
const respondToInvitation = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.talent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation already responded to' });
    }

    // Check if invitation expired
    if (new Date() > new Date(invitation.expiryDate)) {
      return res.status(400).json({ message: 'Invitation has expired' });
    }

    invitation.status = status;
    invitation.respondedAt = new Date();
    await invitation.save();

    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove/Replace talent from event
// @route   PUT /api/invitations/:id/remove
// @access  Private (Event Manager)
const removeOrReplaceTalent = async (req, res) => {
  try {
    const { replacementTalentId } = req.body;

    const invitation = await Invitation.findById(req.params.id)
      .populate('event');

    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.invitedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (replacementTalentId) {
      invitation.status = 'replaced';
      invitation.replacedBy = replacementTalentId;
    } else {
      invitation.status = 'cancelled';
    }

    await invitation.save();
    res.json(invitation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTalents,
  sendInvitation,
  getEventInvitations,
  getMyInvitations,
  respondToInvitation,
  removeOrReplaceTalent
};
