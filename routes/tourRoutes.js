const express = require('express');
const tourControllers = require('../controllers/tourControllers');

const tourRouter = express.Router();

//  tourRouter = /api/tours

tourRouter.param('id', tourControllers.checkID);

tourRouter
  .route('/top-5-cheap')
  .get(tourControllers.aliasFiveTopTours, tourControllers.getAllTours);

tourRouter
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.checkBody, tourControllers.createTour);

tourRouter
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = tourRouter;
