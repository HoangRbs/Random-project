const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.generateToken = async userId => {
  const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY);
  return token;
};

exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new AppError('please provide email or password', 400);
    return next(err);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    throw new AppError('wrong password or wrong email', 400);
  }

  const token = await this.generateToken(user._id);

  // saving token inside cookie
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.COOKIE_TOKEN_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // user http
    secure: process.env.NODE_ENV === 'production' // use https
  };
  res.cookie('token', token, cookieOption);

  res.json({
    status: 'success',
    token
  });
});

exports.userLogout = (req, res) => {
  res.cookie('token', 'userLogout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success'
  });
};

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
  let token = null;

  if (req.header('Authorization')) token = req.header('Authorization');
  else if (req.cookies) token = req.cookies.token;

  if (!token) return next(new AppError('please provide a token', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decoded) throw new AppError('invalid token', 404);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    throw new AppError('user not exist', 404);
  }

  // grant access
  req.user = currentUser;
  next();
});

// for client side, no logging error, just for views rendering
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);

      if (!decoded) return next();

      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // grant access for all views (template)
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};

exports.auth_allow = (...roles) => {
  return catchAsync(async (req, res, next) => {
    // roles == ['super_user','admin']    req.user.role == 'user'(from auth_protect)
    // have to execute after auth_protect to get REQ.USER
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'you do not have permission to perform this action',
        401
      );
    }

    next();
  });
};
