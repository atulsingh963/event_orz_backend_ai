const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  inviteEventManager,
  addEventAddOns
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getEvents)
  .post(protect, authorize('eventOrganizer'), createEvent);

router.route('/:id')
  .get(protect, getEventById)
  .put(protect, authorize('eventOrganizer'), updateEvent)
  .delete(protect, authorize('eventOrganizer'), deleteEvent);

router.post('/:id/invite-manager', protect, authorize('eventOrganizer'), inviteEventManager);
router.post('/:id/addons', protect, authorize('eventOrganizer'), addEventAddOns);

module.exports = router;
