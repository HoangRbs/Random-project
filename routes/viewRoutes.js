const express = require('express');
const viewControllers = require('../controllers/viewControllers');
const authControllers = require('../controllers/authControllers');
const bookingcontrollers = require('../controllers/bookingControllers');

const router = express.Router();

router.use(authControllers.isLoggedIn); // show user logged in info on header

router
  .route('/')
  .get(
    bookingcontrollers.createBookingFromCheckout,
    viewControllers.getOverview
  );
router.route('/tour/:tourName').get(viewControllers.getTour);
router.route('/login').get(viewControllers.Login);
router.route('/SignUp').get(viewControllers.SignUp);
router
  .route('/myTours')
  .get(authControllers.auth_protect, viewControllers.getMyTours);

module.exports = router;
