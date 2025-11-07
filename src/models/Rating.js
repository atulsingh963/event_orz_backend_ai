const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  ratedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Legacy field for backward compatibility
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['talent'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 1000
  },
  categories: {
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    skillLevel: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

// Ensure one rating per user per event per rater
ratingSchema.index({ event: 1, ratedUser: 1, ratedBy: 1 }, { unique: true });

// Update user's average rating after saving
ratingSchema.post('save', async function() {
  const User = mongoose.model('User');
  const Rating = mongoose.model('Rating');

  const stats = await Rating.aggregate([
    { $match: { ratedUser: this.ratedUser } },
    { $group: {
      _id: '$ratedUser',
      averageRating: { $avg: '$rating' },
      totalRatings: { $sum: 1 }
    }}
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(this.ratedUser, {
      averageRating: stats[0].averageRating,
      totalRatings: stats[0].totalRatings
    });
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
