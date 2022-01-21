import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { displayChart } from './displayChart';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alert';
import { signup } from './signup';
import { createReview } from './createReview';
import { addUser, deleteUser, updateUser } from './manipulateUser';
import { manipulateTour, deleteTour } from './manipulateTour';
import { deleteBooking } from './deleteBooking';

// DOM ELEMENT
const mapBox = document.getElementById('map');
const chart1 = document.getElementById('my-chart');

const loginForm = document.querySelector('#login');
const signUpForm = document.querySelector('#signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

const cardContainer = document.querySelector('.card-container');

const overlay = document.querySelector('.overlay');
const tourForm = document.querySelector('#tour-form');
const closeBtn = document.querySelector('.btn-close');

// REVIEWS
const reviewForm = document.querySelector('.reviews_box');
const discardRvBtn = document.querySelector('.btn--discard-rv');
const saveRvBtn = document.querySelector('.btn--save-rv');
// VALUES

// USERS
const editUserForm = document.querySelector('#edit-user-form');
const addUserForm = document.querySelector('#add-user-form');
const addUserBtn = document.querySelector('#addNewUser');
const confirmBox = document.querySelector('.confirm_box');
const searchTourInput = document.querySelector('#search-tour');
const searchUserInput = document.querySelector('#search-user');

// TOUR
const showAddFormBtn = document.getElementById('add-tour-btn');
const addTourBtn = document.querySelector('#add-tour');
const updateTourBtn = document.querySelector('#update-tour');

// FUNCTIONS
const toggleForm = (type) => {
  if (type === 'hide') {
    overlay.classList.add('hidden');
    if (tourForm) tourForm.classList.add('hidden');
    if (reviewForm) reviewForm.classList.add('hidden');
    if (addUserForm) addUserForm.classList.add('hidden');
    if (confirmBox) confirmBox.classList.add('hidden');
    if (editUserForm) editUserForm.classList.add('hidden');
  }
  if (type === 'show') {
    overlay.classList.remove('hidden');
    if (tourForm) tourForm.classList.remove('hidden');
    if (reviewForm) reviewForm.classList.remove('hidden');
    if (addUserForm) addUserForm.classList.remove('hidden');
  }
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
let editTourId;
if (cardContainer) {
  cardContainer.addEventListener('click', (e) => {
    const reviewBtn = e.target.closest('.review');
    const editTourBtn = e.target.closest('.edit-tour');
    const deleteTourBtn = e.target.closest('.delete-tour-btn');
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
      updateTourBtn.classList.remove('hidden');
      addTourBtn.classList.add('hidden');
      const tour = JSON.parse(editTourBtn.dataset.tour);
      editTourId = tour._id;
      tourForm.querySelector('#tourName').value = tour.name;
      tourForm.querySelector('#duration').value = tour.duration;
      tourForm.querySelector('#maxGroupSize').value = tour.maxGroupSize;
      tourForm.querySelector('#difficulty').value = tour.difficulty;
      tourForm.querySelector('#ratingsAverage').value = tour.ratingsAverage;
      tourForm.querySelector('#ratingsQuantity').value = tour.ratingsQuantity;
      tourForm.querySelector('#price').value = tour.price;
      tourForm.querySelector('#summary').value = tour.summary;
      tourForm.querySelector('#description').value = tour.description;
      tourForm.querySelector('#startDate1').value = new Date(tour.startDates[0])
        .toISOString()
        .split('T')[0];
      tourForm.querySelector('#startDate2').value = new Date(tour.startDates[1])
        .toISOString()
        .split('T')[0];
      tourForm.querySelector('#startDate3').value = new Date(tour.startDates[2])
        .toISOString()
        .split('T')[0];
      tourForm.querySelector('#guide1').value = tour.guides[0]._id;
      tourForm.querySelector('#guide2').value = tour.guides[1]._id;
      tourForm.querySelector('#guide3').value = tour.guides[2]
        ? tour.guides[2]._id
        : '';
      tourForm.querySelector(
        '#startCoordinate'
      ).value = `${tour.startLocation.coordinates[0]}, ${tour.startLocation.coordinates[1]}`;
      tourForm.querySelector('#startAddress').value =
        tour.startLocation.address;
      tourForm.querySelector('#startDescription').value =
        tour.startLocation.description;
      tourForm.querySelector(
        '#locationCoordinate1'
      ).value = `${tour.locations[0].coordinates[0]}, ${tour.locations[0].coordinates[1]}`;
      tourForm.querySelector('#locationDescription1').value =
        tour.locations[1].description;
      tourForm.querySelector(
        '#locationCoordinate2'
      ).value = `${tour.locations[1].coordinates[0]}, ${tour.locations[1].coordinates[1]}`;

      tourForm.querySelector('#locationDescription2').value =
        tour.locations[2].description;
      tourForm.querySelector(
        '#locationCoordinate3'
      ).value = `${tour.locations[2].coordinates[0]}, ${tour.locations[2].coordinates[1]}`;

      tourForm.querySelector('#locationDescription3').value =
        tour.locations[2].description;

      overlay.classList.remove('hidden');
      tourForm.classList.remove('hidden');
    }
    if (deleteTourBtn) {
      const { tourId } = deleteTourBtn.dataset;
      confirmBox.classList.remove('hidden');
      overlay.classList.remove('hidden');
      const cancel = document.getElementById('cancel');
      const confirm = document.getElementById('confirm');
      cancel.addEventListener('click', () => toggleForm('hide'));
      confirm.addEventListener('click', () => deleteTour(tourId));
    }
  });
}

if (overlay) {
  overlay.addEventListener('click', () => toggleForm('hide'));
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => toggleForm('hide'));
}

// Review
if (discardRvBtn) {
  discardRvBtn.addEventListener('click', () => toggleForm('hide'));
}

if (saveRvBtn) {
  saveRvBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const review = reviewForm.querySelector('#reviews_text').value;
    const rating = reviewForm.querySelector('input[name="rate"]:checked').value;
    const tour = reviewTourId;
    console.log(review, rating, tour);
    await createReview(review, rating, tour);
    toggleForm('hide');
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

if (addUserBtn) {
  addUserBtn.addEventListener('click', () => {
    toggleForm('show');
    addUserForm.classList.remove('hidden');
    const saveBtn = addUserForm.querySelector('#add-user');
    if (saveBtn) {
      saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.target.textContent = 'Processing...';
        e.target.style.backgroundColor = '#555555';
        const data = {
          name: addUserForm.querySelector('#name').value,
          email: addUserForm.querySelector('#email').value,
          role: addUserForm.querySelector('#role').value,
        };
        await addUser(data);
        e.target.textContent = 'SAVE';
        e.target.style.backgroundColor = '#55c57a';
      });
    }
  });
}

// Handle edit/delete user
const userTable = document.querySelector('#user-management');
if (userTable)
  userTable.addEventListener('click', function (e) {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');
    if (editBtn) {
      console.dir(editUserForm);
      const user = JSON.parse(editBtn.dataset.user);
      editUserForm.querySelector('#nameU').value = user.name;
      editUserForm.querySelector('#emailU').value = user.email;
      editUserForm.querySelector('#roleU').value = user.role;
      editUserForm.classList.remove('hidden');
      overlay.classList.remove('hidden');
      const saveBtn = editUserForm.querySelector('#update-user');
      saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.target.textContent = 'Processing...';
        e.target.style.backgroundColor = '#555555';
        const data = {
          role: editUserForm.querySelector('#roleU').value,
        };
        await updateUser(data, user._id);
        e.target.textContent = 'SAVE';
        e.target.style.backgroundColor = '#55c57a';
      });
    }
    if (deleteBtn) {
      const { userId } = deleteBtn.dataset;
      console.log(userId);
      confirmBox.classList.remove('hidden');
      overlay.classList.remove('hidden');
      const cancel = document.getElementById('cancel');
      const confirm = document.getElementById('confirm');
      cancel.addEventListener('click', () => toggleForm('hide'));
      confirm.addEventListener('click', () => deleteUser(userId));
    }
  });

if (searchTourInput) {
  searchTourInput.addEventListener('submit', function (e) {
    e.preventDefault();
    const key = e.target.querySelector('.search_box_input').value.trim();
    console.log(key);
    window.location.replace(`/search/${key}`);
  });
}

if (searchUserInput) {
  searchUserInput.addEventListener('submit', (e) => {
    e.preventDefault();
    const key = e.target.querySelector('.search_box_input').value;
    window.location.replace(`/user/${key}`);
  });
}

if (showAddFormBtn) {
  showAddFormBtn.addEventListener('click', (e) => {
    toggleForm('show');
    addTourBtn.classList.remove('hidden');
    updateTourBtn.classList.add('hidden');
    if (tourForm) {
      tourForm.querySelector('#tourName').value = '';
      tourForm.querySelector('#duration').value = '';
      tourForm.querySelector('#maxGroupSize').value = '';
      tourForm.querySelector('#difficulty').value = '';
      tourForm.querySelector('#ratingsAverage').value = '';
      tourForm.querySelector('#ratingsQuantity').value = '';
      tourForm.querySelector('#price').value = '';
      tourForm.querySelector('#summary').value = '';
      tourForm.querySelector('#description').value = '';
      tourForm.querySelector('#startCoordinate').value = '';
      tourForm.querySelector('#startAddress').value = '';
      tourForm.querySelector('#startDescription').value = '';
      tourForm.querySelector('#guide1').value = '';
      tourForm.querySelector('#guide2').value = '';
      tourForm.querySelector('#guide3').value = '';
      tourForm.querySelector('#locationCoordinate1').value = '';
      tourForm.querySelector('#locationDescription1').value = '';
      tourForm.querySelector('#locationCoordinate2').value = '';
      tourForm.querySelector('#locationDescription2').value = '';
      tourForm.querySelector('#locationCoordinate3').value = '';
      tourForm.querySelector('#locationDescription3').value = '';
    }
  });
}

if (addTourBtn) {
  addTourBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', tourForm.querySelector('#tourName').value);
    console.log(tourForm.querySelector('#tourName').value);
    form.append('duration', tourForm.querySelector('#duration').value);
    form.append('maxGroupSize', tourForm.querySelector('#maxGroupSize').value);
    form.append('difficulty', tourForm.querySelector('#difficulty').value);
    form.append('price', tourForm.querySelector('#price').value);
    form.append('summary', tourForm.querySelector('#summary').value);
    form.append('description', tourForm.querySelector('#description').value);
    form.append('imageCover', tourForm.querySelector('#imageCover').files[0]);
    form.append(
      'ratingsAverage',
      tourForm.querySelector('#ratingsAverage').value
    );
    form.append(
      'ratingsQuantity',
      tourForm.querySelector('#ratingsQuantity').value
    );
    const startDates = [];
    for (let i = 0; i < 3; i++) {
      form.append('images', tourForm.querySelector(`#image${i + 1}`).files[0]);
      startDates.push(
        new Date(
          tourForm.querySelector(`#startDate${i + 1}`).value
        ).toISOString()
      );
      console.log(tourForm.querySelector(`#startDate${i + 1}`).value);
    }
    const guides = [
      tourForm.querySelector('#guide1').value,
      tourForm.querySelector('#guide2').value,
      tourForm.querySelector('#guide3').value,
    ];
    form.append('guides', JSON.stringify(guides));
    form.append('startDates', JSON.stringify(startDates));
    const startLocation = JSON.stringify({
      description: tourForm.querySelector('#startDescription').value,
      type: 'Point',
      coordinates: tourForm.querySelector('#startCoordinate').value.split(','),
      address: tourForm.querySelector('#startAddress').value,
    });
    console.log(startLocation);
    const locations = JSON.stringify([
      {
        description: tourForm.querySelector('#locationDescription1').value,
        type: 'Point',
        coordinates: tourForm
          .querySelector('#locationCoordinate1')
          .value.split(','),
      },
      {
        description: tourForm.querySelector('#locationDescription2').value,
        type: 'Point',
        coordinates: tourForm
          .querySelector('#locationCoordinate2')
          .value.split(','),
      },
      {
        description: tourForm.querySelector('#locationDescription3').value,
        type: 'Point',
        coordinates: tourForm
          .querySelector('#locationCoordinate3')
          .value.split(','),
      },
    ]);
    form.append('startLocation', startLocation);
    form.append('locations', locations);
    manipulateTour(form);
  });
}

if (updateTourBtn) {
  updateTourBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', tourForm.querySelector('#tourName').value);
    console.log(tourForm.querySelector('#tourName').value);
    form.append('duration', tourForm.querySelector('#duration').value);
    form.append('maxGroupSize', tourForm.querySelector('#maxGroupSize').value);
    form.append('difficulty', tourForm.querySelector('#difficulty').value);
    form.append('price', tourForm.querySelector('#price').value);
    form.append('summary', tourForm.querySelector('#summary').value);
    console.log(tourForm.querySelector('#summary').value);
    form.append('description', tourForm.querySelector('#description').value);
    form.append('imageCover', tourForm.querySelector('#imageCover').files[0]);
    form.append(
      'ratingsAverage',
      tourForm.querySelector('#ratingsAverage').value
    );
    form.append(
      'ratingsQuantity',
      tourForm.querySelector('#ratingsQuantity').value
    );
    const startDates = [];
    for (let i = 0; i < 3; i++) {
      form.append('images', tourForm.querySelector(`#image${i + 1}`).files[0]);
      startDates.push(
        new Date(
          tourForm.querySelector(`#startDate${i + 1}`).value
        ).toISOString()
      );
    }
    const guides = [
      tourForm.querySelector('#guide1').value,
      tourForm.querySelector('#guide2').value,
      tourForm.querySelector('#guide3').value,
    ];
    form.append('guides', JSON.stringify(guides));
    form.append('startDates', JSON.stringify(startDates));
    const startLocation = JSON.stringify({
      description: tourForm.querySelector('#startDescription').value,
      type: 'Point',
      coordinates: tourForm.querySelector('#startCoordinate').value.split(','),
      address: tourForm.querySelector('#startAddress').value,
    });
    console.log(startLocation);
    const locations = JSON.stringify([
      {
        description: tourForm.querySelector('#locationDescription1').value,
        type: 'Point',
        coordinates: tourForm
          .querySelector('#locationCoordinate1')
          .value.split(','),
      },
      {
        description: tourForm.querySelector('#locationDescription2').value,
        type: 'Point',
        coordinates: tourForm
          .querySelector('#locationCoordinate2')
          .value.split(','),
      },
      {
        description: tourForm.querySelector('#locationDescription3').value,
        type: 'Point',
        coordinates: tourForm
          .querySelector('#locationCoordinate3')
          .value.split(','),
      },
    ]);
    form.append('startLocation', startLocation);
    form.append('locations', locations);
    manipulateTour(form, editTourId);
  });
}

///////////////////BOOKING///////////////////////////////
const bookingsTable = document.querySelector('#booking');
if (bookingsTable) {
  bookingsTable.addEventListener('click', (e) => {
    e.preventDefault();
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      const { bookingId } = deleteBtn.dataset;
      confirmBox.classList.remove('hidden');
      overlay.classList.remove('hidden');
      const cancel = document.getElementById('cancel');
      const confirm = document.getElementById('confirm');
      cancel.addEventListener('click', () => toggleForm('hide'));
      confirm.addEventListener('click', () => deleteBooking(bookingId));
    }
  });
}

////////////////////////DASHBOARD//////////////////////////
if (chart1) {
  displayChart();
}
