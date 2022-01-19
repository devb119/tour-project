import axios from 'axios';
import { showAlert } from './alert';

export const createReview = async (review, rating, tour) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tour}/reviews`,
      data: {
        review,
        rating,
      },
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Your review has been saved.');
      window.setTimeout(() => location.reload(true), 2000);
    } else {
      showAlert('error', 'You have already reviewed about this tour');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
