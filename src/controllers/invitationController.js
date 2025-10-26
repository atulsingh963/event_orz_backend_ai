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
      status: { $in: ['pending', 'accepted', 'cancelled'] }
    })
      .populate('event', 'title description eventDate startTime endTime')
      .populate('invitedBy', 'name email phone')
      .sort('-createdAt');

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to check if all required talents are confirmed
const checkAndUpdateEventStatus = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) return;

    // Get all invitations for this event
    const invitations = await Invitation.find({ event: eventId });

    // Check each required skill
    let allSkillsFilled = true;
    for (const requiredSkill of event.requiredSkills) {
      const acceptedForSkill = invitations.filter(
        inv => inv.skill === requiredSkill.skill && inv.status === 'accepted'
      ).length;

      if (acceptedForSkill < requiredSkill.count) {
        allSkillsFilled = false;
        break;
      }
    }

    // Update event status if all skills are filled
    if (allSkillsFilled && event.status === 'recruiting') {
      event.status = 'confirmed';
      await event.save();
    }
  } catch (error) {
    console.error('Error checking event status:', error);
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

    // If accepting, check if the skill slot is still available
    if (status === 'accepted') {
      const event = await Event.findById(invitation.event);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Find the required skill
      const requiredSkill = event.requiredSkills.find(s => s.skill === invitation.skill);
      if (!requiredSkill) {
        return res.status(400).json({ message: 'Skill not required for this event' });
      }

      // Count accepted invitations for this skill
      const acceptedCount = await Invitation.countDocuments({
        event: invitation.event,
        skill: invitation.skill,
        status: 'accepted'
      });

      // Check if skill is already filled
      if (acceptedCount >= requiredSkill.count) {
        return res.status(400).json({
          message: `This ${invitation.skill} position has already been filled. The invitation is no longer available.`
        });
      }
    }

    invitation.status = status;
    invitation.respondedAt = new Date();
    await invitation.save();

    // If accepted, auto-cancel other pending invitations if skill is now filled
    if (status === 'accepted') {
      const event = await Event.findById(invitation.event);
      const requiredSkill = event.requiredSkills.find(s => s.skill === invitation.skill);

      // Count accepted invitations for this skill (including the one just accepted)
      const acceptedCount = await Invitation.countDocuments({
        event: invitation.event,
        skill: invitation.skill,
        status: 'accepted'
      });

      // If skill is now filled, cancel all other pending invitations for this skill
      if (acceptedCount >= requiredSkill.count) {
        await Invitation.updateMany(
          {
            event: invitation.event,
            skill: invitation.skill,
            status: 'pending',
            _id: { $ne: invitation._id } // Exclude the current invitation
          },
          {
            status: 'cancelled',
            respondedAt: new Date(),
            cancellationReason: `This ${invitation.skill} position has been filled by another talent.`
          }
        );
      }

      // Check if all talents are now confirmed and update event status
      await checkAndUpdateEventStatus(invitation.event);
    }

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
