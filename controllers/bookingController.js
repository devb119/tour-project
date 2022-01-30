const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    // success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({
    tour,
    user,
    price,
  });
  console.log('Creating');
  // Hide sensitive data
  res.redirect(`${req.originalUrl.split('?')[0]}?alert=booking`);
});

// On deployed website, using this
// const createBookingCheckout = async (session) => {
//   const tour = session.client_reference_id;
//   const user = (await User.findOne({ email: session.customer_email })).id;
//   const price = session.amount_total / 100;
//   await Booking.create({
//     tour,
//     user,
//     price,
//   });
// };

// exports.webhookCheckout = (req, res, next) => {
//   const signature = req.headers['stripe-signature'];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
//     createBookingCheckout(session);
//   }
//   res.status(200).json({ received: true });
// };

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

exports.getBookingStats = catchAsync(async (req, res, next) => {
  const back6months = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
  const back6monthsString = `${back6months.getFullYear()}-${back6months.getMonth()}-${back6months.getDate()}`;
  let stats = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(back6monthsString),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        sales: { $sum: '$price' },
        year: { $push: '$createdAt' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  stats = stats.map((el) => {
    el.year = new Date(el.year[0]).getFullYear();
    return el;
  });

  const thisYear = stats.filter(
    (el) => el.year === new Date(Date.now()).getFullYear()
  );

  const lastYear = stats.filter(
    (el) => el.year === new Date(Date.now()).getFullYear() - 1
  );

  let topTour = await Booking.aggregate([
    {
      $group: {
        _id: '$tour',
        bookingTimes: { $sum: 1 },
      },
    },
    {
      $sort: { bookingTimes: -1 },
    },
    {
      $limit: 6,
    },
  ]);

  const topTourName = await Promise.all(
    topTour.map(async (el) => {
      el._id = await Tour.findById(el._id);
      return el;
    })
  );
  res.status(200).json({
    status: 'success',
    data: {
      thisYear,
      lastYear,
      topTour,
    },
  });
});
