const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    ratingAverage: {
      type: Number,
      default: 0
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    imageCover: {
      type: String,
      required: true
    },
    images: [String],
    StartDates: [{ Date }],
    isSecret: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

TourSchema.virtual('VietNamDong_price').get(function() {
  return this.price * 23000;
});

TourSchema.pre(/find/, function(next) {
  //  only display none secret tours (false or null)
  this.find({ isSecret: { $ne: true } });
  next();
});

const Tour = mongoose.model('tour', TourSchema);

module.exports = Tour;
