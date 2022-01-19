// const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = catchAsync(async (req, res, next) => {
  const oldReview = await Review.findOne({
    tour: req.body.tour,
    user: req.body.user,
  });
  let updatedReview, newReview;
  console.log('old review: ', oldReview);
  if (oldReview) {
    updatedReview = await Review.findByIdAndUpdate(oldReview._id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log('updated review: ', updatedReview);
  } else {
    newReview = await Review.create(req.body);
    console.log('new review: ', newReview);
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: oldReview ? updatedReview : newReview,
    },
  });
});

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
