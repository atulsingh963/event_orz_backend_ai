const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: 2000
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  eventDate: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  requiredSkills: [{
    skill: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 1
    },
    description: String
  }],
  addOns: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  budget: {
    venuePrice: Number,
    addOnsPrice: Number,
    totalPrice: Number
  },
  status: {
    type: String,
    enum: ['draft', 'planning', 'recruiting', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  attendees: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['conference', 'concert', 'wedding', 'corporate', 'party', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Normalize requiredSkills (case-insensitive matching) and calculate total price before saving
eventSchema.pre('save', function(next) {
  // Normalize requiredSkills.skill to lowercase for consistent matching
  if (Array.isArray(this.requiredSkills)) {
    this.requiredSkills = this.requiredSkills.map(rs => ({
      ...rs,
      skill: typeof rs.skill === 'string' ? rs.skill.trim().toLowerCase() : rs.skill
    }));
  }

  // Recompute budget totals when relevant fields change
  if (this.isModified('addOns') || this.isModified('budget.venuePrice')) {
    const addOnsTotal = this.addOns.reduce((total, addon) => {
      return total + (addon.price * addon.quantity);
    }, 0);

    this.budget = {
      venuePrice: this.budget?.venuePrice || 0,
      addOnsPrice: addOnsTotal,
      totalPrice: (this.budget?.venuePrice || 0) + addOnsTotal
    };
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
