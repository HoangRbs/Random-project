const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/Booking');

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

exports.Login = catchAsync(async (req, res, next) => {
  res.render('login');
});

exports.SignUp = catchAsync(async (req, res, next) => {
  res.render('signup');
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIds = bookings.map(booking => {
    return booking.tour.id;
  });

  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.render('overview', {
    title: 'my bookings',
    tours
  });
});
