const express = require('express');
const reviewControllers = require('../controllers/reviewControllers');
const authControllers = require('../controllers/authControllers');

// reviewRouter = '/api/tours/:id/reviews'
const reviewRouter = express.Router({ mergeParams: true }); // user mergeParams to get parent route parameters

reviewRouter
  .route('/')
  .get(
    authControllers.auth_protect,
    reviewControllers.setTourUserIds,
    reviewControllers.getAllReviews
  )
  .post(
    authControllers.auth_protect,
    reviewControllers.setTourUserIds,
    reviewControllers.createReview
  );

module.exports = reviewRouter;
