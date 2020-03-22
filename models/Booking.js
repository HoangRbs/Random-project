const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tour',
      required: [true, 'booking must belong to a tour']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'booking must belong to an user']
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.pre(/^find/, function(next) {
  // this is a query in this situation
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });
  next();
});

const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;
