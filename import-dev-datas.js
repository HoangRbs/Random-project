const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./models/Tour');

require('dotenv').config({
  path: `./config.env`
});

const DB_URL =
  process.env.NODE_ENV === 'development'
    ? 'mongodb://localhost/random-project'
    : `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-ju1lb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-ju1lb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log('database connected'));

let datas = fs.readFileSync(`${__dirname}/dev-data/tours.json`);
datas = JSON.parse(datas);

const importDatas = async () => {
  try {
    await Tour.create(datas);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteDatas = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importDatas();
} else if (process.argv[2] === '--delete') {
  deleteDatas();
}
