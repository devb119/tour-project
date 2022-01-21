const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alert = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check it in MY BOOKINGS. If it doesn't show up here immediately, please wait a few minutes";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.searchTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.find({
    name: { $regex: req.params.key, $options: 'i' },
  });
  res.status(200).render('overview', {
    title: Tour,
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour, including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) return next(new AppError('No tour found with that name!', 404));
  // 2) Build the template
  // 3) Render template using the data from 1)
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings

  // Using populate to find tour
  // NOTE: If we use populate like this we have to disable the tour populate in
  // query middleware of booking model (populating 2 times)
  // const bookings = await Booking.find({ user: req.user.id }).populate('tour');
  // const tours = bookings.map((b) => b.tour);

  // Find tour IDs and use $in operator
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((booking) => booking.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
    review: true,
  });
});

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     { new: true, runValidators: true }
//   );
//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// });

exports.getDashboard = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  const users = await User.find();
  const bookingStats = await Booking.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$price' },
        totalBookings: { $sum: 1 },
      },
    },
  ]);

  const salesStats = {
    totalTours: tours.length,
    totalUsers: users.length,
    totalSales: bookingStats[0].totalSales,
    totalBookings: bookingStats[0].totalBookings,
  };

  res.status(200).render('dashboard', {
    title: 'Dashboard',
    salesStats,
  });
});

exports.searchUser = catchAsync(async (req, res, next) => {
  const users = await User.find({
    name: { $regex: req.params.key, $options: 'i' },
    _id: { $ne: req.user._id },
  });

  res.status(200).render('userManagement', {
    title: 'User Management',
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user._id } });

  res.status(200).render('userManagement', {
    title: 'User Management',
    users,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  const users = await User.find({
    role: 'guide',
  });

  res.status(200).render('overview', {
    title: 'Tour Management',
    tours,
    users,
    update: true,
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).render('booking', {
    title: 'Booking',
    bookings,
  });
});
