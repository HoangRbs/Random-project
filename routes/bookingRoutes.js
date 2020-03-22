const express = require('express');

const { auth_protect } = require('../controllers/authControllers');
const { getCheckoutSession } = require('../controllers/bookingControllers');

const bookingRouter = express.Router();

bookingRouter
  .route('/checkout-session/:tourId')
  .get(auth_protect, getCheckoutSession);
module.exports = bookingRouter;
