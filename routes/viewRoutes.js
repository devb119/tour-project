const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Read message
router.use(viewsController.alert);

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get(
  '/search/:key',
  authController.isLoggedIn,
  viewsController.searchTour
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);

router.get('/me', authController.protect, viewsController.getAccount);

router.get('/my-tours', authController.protect, viewsController.getMyTours);

router.get(
  '/dashboard',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getDashboard
);

router.get(
  '/user',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getUser
);

router.get(
  '/user/:key',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.searchUser
);

router.get(
  '/tour-mng',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.updateTour
);

router.get(
  '/booking',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getBooking
);
// Old way to update via form
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );
module.exports = router;
