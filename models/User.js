const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const emailValidator = function(val) {
  return validator.isEmail(val);
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide an user name']
  },
  email: {
    type: String,
    required: [true, 'please provide an email'],
    unique: true,
    lowercase: true,
    validate: [emailValidator, `email is invalid`]
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'super_user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 5,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'please comfirm your password'],
    validate: [
      function(val) {
        return this.password === val;
      },
      'passwords do not match'
    ]
  },
  passwordResetToken: String,
  passwordResetExpired: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // password = 12345

  this.password = await bcrypt.hash(this.password, 8); // password = sfer2342r%%%$####

  // delete password confirm field
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePassword = async function(
  inputPassword,
  userEncryptedPassword
) {
  const result = await bcrypt.compare(inputPassword, userEncryptedPassword);
  return result;
};

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpired = Date.now() + 10 * 60 * 1000; // last 10 mins

  await this.save({
    validateBeforeSave: false
  });

  return resetToken; // return a resolve value of a promise (async function)
};

const User = mongoose.model('user', userSchema);

module.exports = User;
