const Tour = require('../models/Tour');

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
    let queryObj = { ...req.query };

    const excludedFilterKeys = ['sort', 'fields', 'page', 'limit'];
    excludedFilterKeys.forEach(el => {
      delete queryObj[el];
    });

    let queryString = JSON.stringify(queryObj);

    // using $lt, $gte in mongoose query
    queryString = queryString.replace(/(lt|gte|lte|gt)/g, match => {
      // do something with the match
      // return a different string
      return `$${match}`;
    });

    let query = Tour.find(JSON.parse(queryString));

    // sort query
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // limit field query
    if (req.query.fields) {
      const fieldsLimit = req.query.fields.split(',').join(' ');
      query = query.select(fieldsLimit);
    } else {
      query = query.select('-__v');
    }

    // page and limit query
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 2;
    const skip = (page - 1) * limit;

    const toursNum = await Tour.countDocuments();

    if (req.query.page) {
      if (skip >= toursNum)
        throw {
          message: 'page not exist'
        };
    }

    query = query.skip(skip).limit(limit);

    const tours = await query;

    res.json({
      status: 'success',
      results: tours.length,
      tours
    });
  } catch (err) {
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
