/*eslint-disable*/
import { start_login, start_logout } from './Login';
import { start_signUp } from './SignUp';

const form_login_el = document.getElementById('form_login');
const logout_el = document.querySelector('.nav__el--logout');
const form_signUp_el = document.getElementById('form_signUp');

if (form_login_el)
  form_login_el.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('input_login_email').value;
    const password = document.getElementById('input_login_password').value;

    start_login(email, password);
  });

if (form_signUp_el) {
  form_signUp_el.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('input_signUp_name').value;
    const email = document.getElementById('input_signUp_email').value;
    const password = document.getElementById('input_signUp_password').value;
    const confirmPassword = document.getElementById(
      'input_signUp_confirm_password'
    ).value;

    start_signUp(name, email, password, confirmPassword);
  });
}

if (logout_el)
  logout_el.addEventListener('click', e => {
    e.preventDefault();
    start_logout();
  });
