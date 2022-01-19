import axios from 'axios';
import { showAlert } from './alert';

export const deleteUser = async (id) => {
  try {
    const res = await axios({
      url: `/api/v1/users/${id}`,
      method: 'DELETE',
    });
    console.log(res);
    if (res.status === 204) {
      showAlert('success', 'User has been removed');
      window.setTimeout(() => location.reload(true), 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const addUser = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `User has been created successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateUser = async (data, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${id}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `User has been updated successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
