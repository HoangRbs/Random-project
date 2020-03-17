const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
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
// app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'pug'); // for render in views folder
app.use(express.static(path.join(__dirname, 'public'))); // for serving css file inside pug

app.get('/', (req, res) => {
  res.render('index', {
    title: 'index'
  });
});

app.get('/overview', (req, res) => {
  res.render('overview', {
    title: 'all tours'
  });
});

app.get('/tour', (req, res) => {
  res.render('tour', {
    title: 'detailed tour info'
  });
});

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

app.use(NotFoundUrl);
app.use(globalErrHandler);

module.exports = app;
