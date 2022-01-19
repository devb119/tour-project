import axios from 'axios';
import { showAlert } from './alert';

export const manipulateTour = async (data, id) => {
  try {
    const res = await axios({
      method: id ? 'PATCH' : 'POST',
      url: `/api/v1/tours${id ? `/${id}` : ''}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `Tour has been ${id ? 'updated' : 'created'} successfully!`
      );
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteTour = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/tours/${id}`,
    });

    if (res.status === 204) {
      showAlert('success', `Tour has been deleted successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
