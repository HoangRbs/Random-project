const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({});

  res.render('overview', {
    title: 'all tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ name: req.params.tourName }).populate(
    'reviews'
  );

  res.render('tour', {
    tour
  });
});
