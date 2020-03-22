require('dotenv').config({
  path: `./config.env`
});
const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
  })
  .then(() => console.log('database connected'));

const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`listening on port ${port}!`));
