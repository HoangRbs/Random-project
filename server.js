require('dotenv').config({
  path: `./config.env`
});
const mongoose = require('mongoose');

const DB_URL =
  process.env.NODE_ENV === 'development'
    ? 'mongodb://localhost/random-project'
    : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-ju1lb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true
  })
  .then(() => console.log('database connected'));

const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`listening on port ${port}!`));
