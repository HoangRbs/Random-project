const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./models/Tour');

mongoose
  .connect('mongodb://localhost/random-project', {
    useNewUrlParser: true
  })
  .then(() => console.log('database connected'));

let datas = fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`);
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
