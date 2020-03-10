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
    throw new AppError('please provide a token', 401);
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

// authen, authorize
exports.auth_protect = catchAsync(async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return next(new AppError('please provide a token', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    throw new AppError('user not exist', 404);
  }

  // grant access
  req.user = currentUser;
  next();
});

exports.auth_allow = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // roles == ['super_user','admin']    user.role == 'user'(from auth_protect)
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'you do not have permission to perform this action',
        401
      );
    }

    next();
  });
};
