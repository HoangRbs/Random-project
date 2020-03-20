const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const userRouter = express.Router();

// userRouter = "/api/users"
userRouter.route('/').get(userControllers.getAllUser);
userRouter.route('/SignUp').post(authControllers.userSignIn);
userRouter.route('/Login').post(authControllers.userLogin);
userRouter.route('/Logout').get(authControllers.userLogout);
userRouter.route('/forgotPassword').post(userControllers.forgotPassword);
userRouter
  .route('/resetPassword/:resetToken')
  .patch(userControllers.resetPassword);

userRouter.use(authControllers.auth_protect); // user auth_ptotect for the reset of the below routes

userRouter.route('/updatePassword').patch(userControllers.updatePassword);

userRouter
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = userRouter;
