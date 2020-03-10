const crypto = require('crypto');
const nodemailer = require('nodemailer');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { sendEmail } = require('../utils/email');

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError('please provide an email', 404);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('user not exist for requested email', 404);
  }

  const resetToken = await user.createPasswordResetToken();
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

  const message = `click the link to reset yout password ${resetURL}`;

  try {
    sendEmail({
      receiverMail: user.email,
      subject:
        'this is your link to reset your password (take effect in 10 mins)',
      message: message
    });

    res.json({
      status: 'success',
      message: 'reset password request has been sent to your email'
    });
  } catch (err) {
    user.passwordResetExpired = undefined;
    user.passwordResetToken = undefined;
    await user.save({
      validateBeforeSave: false
    });
    next(new AppError('having error while sending email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;

  const { password, confirmPassword } = req.body;

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpired: { $gt: Date.now() }
  });
  if (!user) {
    throw new AppError('invalid token or token has expired', 404);
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  await user.save();

  res.json({
    status: 'success',
    message: 'password has changed'
  });
});
