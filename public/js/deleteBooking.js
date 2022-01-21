import axios from 'axios';
import { showAlert } from './alert';

export const deleteBooking = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/bookings/${id}`,
    });

    if (res.status === 204) {
      showAlert('success', `Booking has been deleted successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
