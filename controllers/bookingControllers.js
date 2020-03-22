const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/Booking');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${tour.id}&user=${
      req.user.id
    }`,
    cancel_url: `${req.protocol}://${req.get('host')}`,
    customer_email: req.user.email,
    line_items: [
      {
        name: tour.name,
        images: [`$https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  res.json({
    status: 'success',
    session
  });
});

exports.createBookingFromCheckout = catchAsync(async (req, res, next) => {
  const user = req.query.user;
  const tour = req.query.tour;

  if (!user || !tour) return next();

  await Booking.create({ user, tour });
  res.redirect(req.originalUrl.split('?')[0]);
});
