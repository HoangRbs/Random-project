const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 8);

  // delete password confirm field
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.comparePassword = async function(
  inputPassword,
  userPassword
) {
  const result = await bcrypt.compare(inputPassword, userPassword);
  return result;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
