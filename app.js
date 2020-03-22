const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const testRouter = require('./routes/testRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const {
  NotFoundUrl,
  globalErrHandler
} = require('./controllers/errorControllers');

const app = express();

app.use(cors());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'pug'); // for render in views folder
app.use(express.static(path.join(__dirname, 'public'))); // for serving css, js file inside pug

// app.use('/test', testRouter);
app.use('/', viewRouter);
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);

app.use(NotFoundUrl);
app.use(globalErrHandler);

module.exports = app;
