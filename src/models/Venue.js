const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide venue name'],
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Please specify venue capacity']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please provide price per day']
  },
  amenities: [{
    type: String
  }],
  availableAddOns: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ['catering', 'equipment', 'decoration', 'service', 'entertainment', 'other'],
      default: 'other'
    }
  }],
  images: [{
    type: String
  }],
  description: {
    type: String,
    maxlength: 1000
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venue', venueSchema);
