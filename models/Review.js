const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, ' review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tour',
      required: [true, 'review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'review must belong to an user']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/find/, async function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
