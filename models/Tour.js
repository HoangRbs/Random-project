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
    },
    startLocation: {
      description: String,
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String
    },
    locations: [
      {
        description: String,
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // want the virtual field to be displayed on client side
    toObject: { virtuals: true } // want the virtual field to be displayed on client side
  }
);

// want the virtual field to be displayed on client side
TourSchema.virtual('VietNamDong_price').get(function() {
  return this.price * 23000;
});

// populate virtual
TourSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'tour',
  localField: '_id'
});

TourSchema.pre(/find/, function(next) {
  //  only display none secret tours (false or null)
  this.find({ isSecret: { $ne: true } });
  next();
});

TourSchema.pre(/find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  });
  next();
});

// TourSchema.pre('save', async function(next) {
//   // return an async == return a Promise -> await an async == value
//   // return async array == return Promises array -> await promise array == value array

//   const guidesPromises = this.guides.map(async userId => {
//     const user = await User.findById(userId); // return async of (users) == return Promises Array of (users)
//     return user;
//   });

//   this.guides = await Promise.all(guidesPromises); // await Promises Array of (users) == users
//   next();
// });

const Tour = mongoose.model('tour', TourSchema);

module.exports = Tour;
