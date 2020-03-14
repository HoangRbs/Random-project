const mongoose = require('mongoose');
const Tour = require('../models/Tour');

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

reviewSchema.pre(/^find/, async function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

// for updating review
// reviewSchema.pre(/^findOneAnd/, async function(next) {
//   const review = await this;
//   console.log(review);
//   next();
// });

reviewSchema.statics.calAverageRating = async function(tourId) {
  // aggregate inside collection
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour', // group all the reviews that have the same tour:""
        nRatings: { $sum: 1 }, // number of ratings equal to number of reviews
        avgRatings: { $avg: '$rating' }
      }
    }
  ]);

  // update Tour
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRatings,
      ratingAverage: stats[0].avgRatings
    });
  }
};

reviewSchema.post('save', async function() {
  // use post to make review appear in collection (for aggregate)
  this.constructor.calAverageRating(this.tour);
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
