const express = require('express');
const router = express.Router();
const {
  getTalentProfile,
  updateTalentProfile
} = require('../controllers/talentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:id', getTalentProfile);
router.put('/profile', protect, authorize('talent'), updateTalentProfile);

module.exports = router;
