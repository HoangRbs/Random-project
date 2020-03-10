const express = require('express');
const tourControllers = require('../controllers/tourControllers');
const authControllers = require('../controllers/authControllers');

const tourRouter = express.Router();

//  tourRouter = /api/tours

tourRouter.param('id', tourControllers.checkID);

tourRouter.route('/tourStat').get(tourControllers.getTourStat);

tourRouter
  .route('/top-5-cheap')
  .get(tourControllers.aliasFiveTopTours, tourControllers.getAllTours);

tourRouter
  .route('/')
  .get(authControllers.auth_protect, tourControllers.getAllTours)
  .post(tourControllers.checkBody, tourControllers.createTour);

tourRouter
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authControllers.auth_protect,
    authControllers.auth_allow('super_user', 'admin'),
    tourControllers.deleteTour
  );

module.exports = tourRouter;
