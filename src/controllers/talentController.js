const User = require('../models/User');
const Rating = require('../models/Rating');

// Utility: escape regex special chars for safe dynamic RegExp
const escapeRegExp = (s) => (typeof s === 'string' ? s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// @desc    Public list/search talents
// @route   GET /api/talents
// @access  Public
const listTalents = async (req, res) => {
  try {
    const { skill, skills, minRating } = req.query;
    const query = { isActive: true, role: 'talent' };

    // Accept skill (string) or skills (comma-separated or array)
    const raw = skills ?? skill;
    if (raw) {
      const normalize = (v) => (Array.isArray(v) ? v : String(v).split(',')).map(s => s.trim()).filter(Boolean);
      const tokens = normalize(raw);
      const regexes = tokens.map(s => new RegExp(`^${escapeRegExp(s)}$`, 'i'));
      query['skills.skill'] = { $in: regexes };
    }

    if (minRating) {
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
  listTalents,
  getTalentProfile,
  updateTalentProfile
};
