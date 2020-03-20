/*eslint-disable*/
import { start_login, start_logout } from './Login';

const form_login_el = document.getElementById('form_login');
const logout_el = document.querySelector('.nav__el--logout');

if (form_login_el)
  form_login_el.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('input_login_email').value;
    const password = document.getElementById('input_login_password').value;

    start_login(email, password);
  });

if (logout_el)
  logout_el.addEventListener('click', e => {
    e.preventDefault();
    start_logout();
  });
