const express = require('express');

const testControllers = require('../controllers/testControllers');

const testRoute = express.Router();

testRoute.route('/').get(testControllers.test);

module.exports = testRoute;
