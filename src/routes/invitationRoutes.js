const express = require('express');
const router = express.Router();
const {
  getTalents,
  sendInvitation,
  getEventInvitations,
  getMyInvitations,
  respondToInvitation,
  removeOrReplaceTalent
} = require('../controllers/invitationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/talents', protect, authorize('eventManager', 'eventOrganizer'), getTalents);
router.post('/', protect, authorize('eventManager'), sendInvitation);
router.get('/event/:eventId', protect, getEventInvitations);
router.get('/my-invitations', protect, authorize('talent'), getMyInvitations);
router.put('/:id/respond', protect, authorize('talent'), respondToInvitation);
router.put('/:id/remove', protect, authorize('eventManager'), removeOrReplaceTalent);

module.exports = router;
