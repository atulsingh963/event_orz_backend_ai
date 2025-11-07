const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
  const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role,
      phone
    };

    // Talent-specific fields are added via profile update after registration

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.profileImage = req.body.profileImage || user.profileImage;

      // Helper to normalize incoming skills into the embedded schema shape
      const normalizeSkills = (skills) => {
        const toSkillObj = (item) => {
          if (typeof item === 'string') {
            const skill = item.trim();
            if (!skill) throw new Error('Skill name cannot be empty');
            return { skill, price: 0, currency: 'INR' };
          }
          if (item && typeof item === 'object') {
            const skill = (item.skill || item.name || '').toString().trim();
            const priceNum = Number(item.price ?? 0);
            const currency = (item.currency ?? 'INR').toString();
            if (!skill) throw new Error('Skill name is required');
            if (!Number.isFinite(priceNum) || priceNum < 0) throw new Error('Skill price must be a non-negative number');
            return { skill, price: priceNum, currency };
          }
          throw new Error('Invalid skill entry');
        };

        if (typeof skills === 'string') {
          return [toSkillObj(skills)];
        }
        if (Array.isArray(skills)) {
          return skills.map(toSkillObj);
        }
        throw new Error('Skills must be a string, an array of strings, or an array of objects');
      };

      if (user.role === 'talent') {
        if (typeof req.body.skills !== 'undefined') {
          try {
            user.skills = normalizeSkills(req.body.skills);
          } catch (e) {
            return res.status(400).json({ message: e.message });
          }
        }
        if (typeof req.body.bio !== 'undefined') {
          user.bio = req.body.bio;
        }
        if (typeof req.body.portfolio !== 'undefined') {
          user.portfolio = req.body.portfolio;
        }
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        skills: updatedUser.skills,
        bio: updatedUser.bio
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
