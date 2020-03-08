const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const {
  NotFoundUrl,
  globalErrHandler
} = require('./controllers/errorControllers');

const app = express();

app.use(cors());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

app.use(NotFoundUrl);
app.use(globalErrHandler);

module.exports = app;
