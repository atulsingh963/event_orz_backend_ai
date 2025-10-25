const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'replaced'],
    default: 'pending'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  respondedAt: {
    type: Date
  },
  replacedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  compensation: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
invitationSchema.index({ event: 1, talent: 1 });
invitationSchema.index({ talent: 1, status: 1 });

module.exports = mongoose.model('Invitation', invitationSchema);
