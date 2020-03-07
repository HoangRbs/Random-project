const Tour = require('../models/Tour');

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filterQuery() {
    //  get localhost:3001/tours?rating=0
    //  get localhost:3001/tours?price[lt]=1000
    let queryObj = { ...this.queryString };

    const excludedFilterKeys = ['sort', 'fields', 'page', 'limit'];
    excludedFilterKeys.forEach(el => {
      delete queryObj[el];
    });

    let tmp_queryStr = JSON.stringify(queryObj);

    //  change to $lt to match mongoose rules
    tmp_queryStr = tmp_queryStr.replace(/(lt|gte|lte|gt)/g, match => {
      // do something with the match
      // return a different string
      return `$${match}`;
    });

    this.query = Tour.find(JSON.parse(tmp_queryStr));

    return this;
  }

  sortQuery() {
    // get localhost:3001/tours?sort=-price
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFieldsQuery() {
    //  get localhost:3001/tours?fields=name,price
    if (this.queryString.fields) {
      const fieldsLimit = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsLimit);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  async paginateQuery() {
    //  get localhost:3001/tours?page=2&limit=3
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
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

module.exports = APIFeatures;
