const express = require('express');
const router = express.Router();
const {
  createRating,
  getUserRatings,
  getTalentRatings,
  getEventRatings,
  updateRating
} = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('eventOrganizer', 'talent'), createRating);
router.get('/user/:userId', getUserRatings);
router.get('/talent/:talentId', getTalentRatings);
router.get('/event/:eventId', protect, getEventRatings);
router.put('/:id', protect, updateRating);

module.exports = router;
