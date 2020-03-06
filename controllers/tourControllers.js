const Tour = require('../models/Tour');
const APIFeatures = require('../utils/APIFeatures');

exports.checkID = (req, res, next, val) => {
  //  console.log(`requested id is ${val}`);
  next();
};

exports.aliasFiveTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,ratingQuantity';
  next();
};

//  get localhost:3001/tours?rating=0
//  get localhost:3001/tours?price[lt]=1000&sort=-price,ratingAverage&fields=name,price
//                          ?page=2&limit=3
exports.getAllTours = async (req, res) => {
  try {
    const features = await new APIFeatures(Tour.find(), req.query)
      .filterQuery()
      .sortQuery()
      .limitFieldsQuery()
      .paginateQuery();

    const tours = await features.query;

    res.json({
      status: 'success',
      results: tours.length,
      tours
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.json({
      status: 'success',
      tour
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      error: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.json({
      status: 'success',
      tour
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      status: 'success',
      tour
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      tour: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      error: err
    });
  }
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
      message: 'pls provide name and price'
    });
  }
  next();
};
