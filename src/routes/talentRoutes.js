const express = require('express');
const router = express.Router();
const {
  listTalents,
  getTalentProfile,
  updateTalentProfile
} = require('../controllers/talentController');
const { protect, authorize } = require('../middleware/auth');

// Public listing/search endpoint
router.get('/', listTalents);

router.get('/:id', getTalentProfile);
router.put('/profile', protect, authorize('talent'), updateTalentProfile);

module.exports = router;
