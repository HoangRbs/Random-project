const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.generateToken = async userId => {
  return await jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY);
};

exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new AppError('please provide email or password', 404);
    return next(err);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('wrong email or password', 404));
  }

  const token = await this.generateToken(user._id);

  res.json({
    status: 'success',
    token
  });
});

exports.userSignIn = catchAsync(async (req, res, next) => {
  let user = await new User(req.body);
  user = await user.save();

  const token = this.generateToken(user._id);

  res.json({
    status: 'success',
    token,
    user
  });
});
