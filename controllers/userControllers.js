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

// exports.createUser = catchAsync(async (req, res) => {
//   let user = await new User(req.body);
//   user = await user.save();

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

//   res.json({
//     status: 'success',
//     token,
//     user
//   });
// });

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
