import axios from 'axios';

exports.start_signUp = async (name, email, password, confirmPassword) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3001/api/users/SignUp',
      data: {
        name,
        email,
        password,
        confirmPassword
      }
    });

    if (res.data.status === 'success') {
      window.alert('Sign Up successfully');
      window.setTimeout(() => {
        window.location.assign('/');
      }, 500);
    }
  } catch (err) {
    window.alert(err.response.data.message);
  }
};
