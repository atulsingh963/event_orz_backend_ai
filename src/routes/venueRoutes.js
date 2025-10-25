const express = require('express');
const router = express.Router();
const {
  getVenues,
  getVenueById,
  createVenue
} = require('../controllers/venueController');

router.route('/')
  .get(getVenues)
  .post(createVenue);

router.get('/:id', getVenueById);

module.exports = router;
