/*eslint-disable*/
import axios from 'axios';

export const start_login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/users/Login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      window.alert('logged in successfully');
      window.setTimeout(() => {
        window.location.assign('/');
      }, 500);
    }
  } catch (err) {
    window.alert(err.response.data.message);
  }
};

export const start_logout = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/users/Logout'
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    window.alert('err logging out');
  }
};
