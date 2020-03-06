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
    StartDates: [{ Date }]
  },
  {
    timestamps: true
  }
);

const Tour = mongoose.model('tour', TourSchema);

module.exports = Tour;
