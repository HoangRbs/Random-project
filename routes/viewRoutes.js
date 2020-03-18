const express = require('express');
const viewControllers = require('../controllers/viewControllers');

const router = express.Router();

router.route('/').get(viewControllers.getOverview);
router.route('/tour/:tourName').get(viewControllers.getTour);
router.route('/login').get(viewControllers.Login);

module.exports = router;
