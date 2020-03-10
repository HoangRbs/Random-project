const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await User.find();

  res.json({
    status: 'success',
    users
  });
});

exports.getUser = catchAsync(async (req, res) => {});

exports.updateUser = catchAsync((req, res) => {
  res.json({
    status: 'success'
  });
});

exports.deleteUser = catchAsync((req, res) => {
  res.json({
    status: 'success'
  });
});
