import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alert';
import { signup } from './signup';
import { createReview } from './createReview';

// DOM ELEMENT
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('#login');
const signUpForm = document.querySelector('#signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

const cardContainer = document.querySelector('.card-container');

const overlay = document.querySelector('.overlay');
const editTourForm = document.querySelector('.tour-form');
const closeBtn = document.querySelector('.btn-close');

// REVIEWS
const reviewForm = document.querySelector('.reviews_box');
const discardRvBtn = document.querySelector('.btn--discard-rv');
const saveRvBtn = document.querySelector('.btn--save-rv');
// VALUES

// FUNCTIONS
const hideForm = () => {
  overlay.classList.add('hidden');
  if (editTourForm) editTourForm.classList.add('hidden');
  if (reviewForm) reviewForm.classList.add('hidden');
};

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('login');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const savePasswordBtn = document.querySelector('.btn--save-password');
    savePasswordBtn.textContent = 'Updating...';
    savePasswordBtn.style.backgroundColor = '#555555';
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    );
    savePasswordBtn.textContent = 'Save password';
    savePasswordBtn.style.backgroundColor = '#55c57a';
    document.getElementById('password-current').value =
      document.getElementById('password').value =
      document.getElementById('password-confirm').value =
        '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    e.target.style.backgroundColor = '#555555';
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
    bookBtn.textContent = 'BOOK TOUR NOW!';
    bookBtn.style.backgroundColor = '#55c57a';
  });
}

// Show edit tour/review
let reviewTourId;
if (cardContainer) {
  cardContainer.addEventListener('click', (e) => {
    const reviewBtn = e.target.closest('.review');
    const editTourBtn = e.target.closest('.edit-tour');
    if (reviewBtn) {
      const [tourId, name, imageCover] = reviewBtn.dataset.tour.split(',');
      console.log(tourId, name, imageCover);
      reviewTourId = tourId;
      reviewForm.querySelector(
        '.card__picture-img'
      ).src = `/img/tours/${imageCover}`;
      reviewForm.querySelector('span').textContent = name;
      reviewForm.classList.remove('hidden');
      overlay.classList.remove('hidden');
    }
    if (editTourBtn) {
      const tour = JSON.parse(editTourBtn.dataset.tour);
      console.log(tour);
      editTourForm.querySelector('#tourName').value = tour.name;
      editTourForm.querySelector('#duration').value = tour.duration;
      editTourForm.querySelector('#maxGroupSize').value = tour.maxGroupSize;
      editTourForm.querySelector('#difficulty').value = tour.difficulty;
      editTourForm.querySelector('#ratingsAverage').value = tour.ratingsAverage;
      editTourForm.querySelector('#ratingsQuantity').value =
        tour.ratingsQuantity;
      editTourForm.querySelector('#price').value = tour.price;
      editTourForm.querySelector('#priceDiscount').value = tour.priceDiscount;
      editTourForm.querySelector('#summary').value = tour.summary;
      editTourForm.querySelector('#description').value = tour.description;
      editTourForm.querySelector(
        '#startCoordinate'
      ).value = `${tour.startLocation.coordinates[0]}, ${tour.startLocation.coordinates[1]}`;
      editTourForm.querySelector('#startAddress').value =
        tour.startLocation.address;
      editTourForm.querySelector('#startDescription').value =
        tour.startLocation.description;
      overlay.classList.remove('hidden');
      editTourForm.classList.remove('hidden');
    }
  });
}

if (overlay) {
  overlay.addEventListener('click', hideForm);
}

if (closeBtn) {
  closeBtn.addEventListener('click', hideForm);
}

// Review
if (discardRvBtn) {
  discardRvBtn.addEventListener('click', hideForm);
}

if (saveRvBtn) {
  saveRvBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const review = reviewForm.querySelector('#reviews_text').value;
    const rating = reviewForm.querySelector('input[name="rate"]:checked').value;
    const tour = reviewTourId;
    console.log(review, rating);
    await createReview(review, rating, tour);
    hideForm();
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 8);

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    console.log(name, email, password, passwordConfirm);
    signup(name, email, password, passwordConfirm);
  });
}
