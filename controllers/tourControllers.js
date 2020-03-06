const Tour = require('../models/Tour');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filterQuery() {
    // filter by price
    let queryObj = { ...this.queryString };

    const excludedFilterKeys = ['sort', 'fields', 'page', 'limit'];
    excludedFilterKeys.forEach(el => {
      delete queryObj[el];
    });

    let tmp_queryStr = JSON.stringify(queryObj);

    // change to $lt to match mongoose rules
    tmp_queryStr = tmp_queryStr.replace(/(lt|gte|lte|gt)/g, match => {
      // do something with the match
      // return a different string
      return `$${match}`;
    });

    this.query = Tour.find(JSON.parse(tmp_queryStr));

    return this;
  }

  sortQuery() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFieldsQuery() {
    if (this.queryString.fields) {
      const fieldsLimit = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsLimit);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  async paginateQuery() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 2;
    const skip = (page - 1) * limit;

    const toursNum = await Tour.countDocuments();

    if (this.queryString.page) {
      if (skip >= toursNum)
        throw {
          message: 'page not exist'
        };
    }

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

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
