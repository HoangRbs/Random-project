const start_login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3001/api/users/Login',
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

document.getElementById('form_login').addEventListener('submit', e => {
  e.preventDefault();

  const email = document.getElementById('input_login_email').value;
  const password = document.getElementById('input_login_password').value;

  start_login(email, password);
});
