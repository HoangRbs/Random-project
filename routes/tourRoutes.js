const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authControllers = require('../controllers/authControllers');
const reviewRouter = require('./reviewRoutes');

const tourRouter = express.Router();

//  tourRouter = /api/tours
//  reviews of a tour api/tours/:id/reviews
tourRouter.use('/:id/reviews', reviewRouter);

tourRouter.param('id', tourControllers.checkID);

tourRouter.route('/tourStat').get(tourControllers.getTourStat);

tourRouter
  .route('/top-5-cheap')
  .get(tourControllers.aliasFiveTopTours, tourControllers.getAllTours);

tourRouter
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    tourControllers.checkBody,
    authControllers.auth_allow('admin'),
    tourControllers.createTour
  );

tourRouter
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authControllers.auth_protect,
    authControllers.auth_allow('guide', 'admin'),
    tourControllers.updateTour
  )
  .delete(
    authControllers.auth_protect,
    authControllers.auth_allow('guide', 'admin'),
    tourControllers.deleteTour
  );

module.exports = tourRouter;
