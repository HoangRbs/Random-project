const express = require('express');
const userRouter = express.Router();
const userControllers = require('../controllers/userController');

//userRouter = "/api/users"

userRouter.route('/')
.get(userControllers.getAllUser)
.post(userControllers.createUser)

userRouter.route('/:id')
.get(userControllers.getUser)
.patch(userControllers.updateUser)
.delete(userControllers.deleteUser)

module.exports = userRouter;
