const express = require('express');
const viewControllers = require('../controllers/viewControllers');

const router = express.Router();

router.route('/').get(viewControllers.getOverview);
router.route('/tour/:tourName').get(viewControllers.getTour);

module.exports = router;
