const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const userRouter = express.Router();

// userRouter = "/api/users"
userRouter.route('/SignUp').post(authControllers.userSignIn);
userRouter.route('/Login').post(authControllers.userLogin);

userRouter.route('/').get(userControllers.getAllUser);

userRouter
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = userRouter;
