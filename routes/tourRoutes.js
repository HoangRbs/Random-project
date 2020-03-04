const express = require('express');
const tourRouter = express.Router();
const tourControllers = require('../controllers/tourControllers');

//tourRouter = /api/tours

tourRouter.param('id',tourControllers.checkID);

tourRouter.route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.checkBody,tourControllers.createTour)
 
tourRouter.route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour)

module.exports = tourRouter;