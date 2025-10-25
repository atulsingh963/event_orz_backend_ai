const User = require('../models/User');
const Rating = require('../models/Rating');

// @desc    Get talent profile
// @route   GET /api/talents/:id
// @access  Public
const getTalentProfile = async (req, res) => {
  try {
    const talent = await User.findById(req.params.id).select('-password');

    if (!talent || talent.role !== 'talent') {
      return res.status(404).json({ message: 'Talent not found' });
    }

    // Get ratings
    const ratings = await Rating.find({ talent: req.params.id })
      .populate('ratedBy', 'name')
      .populate('event', 'title eventDate')
      .sort('-createdAt')
      .limit(10);

    res.json({
      talent,
      ratings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update talent skills and profile
// @route   PUT /api/talents/profile
// @access  Private (Talent)
const updateTalentProfile = async (req, res) => {
  try {
    const { skills, bio, portfolio, profileImage } = req.body;

    const talent = await User.findById(req.user._id);

    if (talent.role !== 'talent') {
      return res.status(403).json({ message: 'Only talents can update this profile' });
    }

    if (skills) talent.skills = skills;
    if (bio) talent.bio = bio;
    if (portfolio) talent.portfolio = portfolio;
    if (profileImage) talent.profileImage = profileImage;

    const updatedTalent = await talent.save();

    res.json(updatedTalent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTalentProfile,
  updateTalentProfile
};
