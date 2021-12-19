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

    if (res.data.status === 'success') {
      showAlert('success', 'Your review has been saved.');
      window.setTimeout(() => location.reload(true), 2000);
    }
  } catch (err) {
    showAlert('error', error.response.data.message);
  }
};
