const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addEventAddOns,
  updateEventStatus
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getEvents)
  .post(protect, authorize('eventOrganizer'), createEvent);

router.route('/:id')
  .get(protect, getEventById)
  .put(protect, authorize('eventOrganizer'), updateEvent)
  .delete(protect, authorize('eventOrganizer'), deleteEvent);

router.post('/:id/addons', protect, authorize('eventOrganizer'), addEventAddOns);
router.put('/:id/status', protect, authorize('eventOrganizer'), updateEventStatus);

module.exports = router;
