const catchAsync = require('../utils/catchAsync');
const Review = require('../models/Review');

exports.setTourUserIds = catchAsync(async (req, res, next) => {
  req.tourId = req.params.id;
  req.userId = req.user._id;
  next();
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;

  const newReview = await Review.create({
    review,
    rating,
    tour: req.tourId,
    user: req.userId
  });

  res.status(200).json({
    status: 'success',
    newReview
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    tour: req.tourId
  });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    reviews
  });
});
