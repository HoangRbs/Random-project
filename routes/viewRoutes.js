const express = require('express');
const viewControllers = require('../controllers/viewControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.use(authControllers.isLoggedIn); // user logged in

router.route('/').get(viewControllers.getOverview);
router.route('/tour/:tourName').get(viewControllers.getTour);
router.route('/login').get(viewControllers.Login);

module.exports = router;
