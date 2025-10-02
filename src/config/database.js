const mongoose = require('mongoose');

const url =
  'mongodb+srv://shubhamagarwal0312:lIfQoHjwPcAL2Xe2@namastenode.brzow.mongodb.net/devTinder';

const connectDb = async () => {
  return await mongoose.connect(url);
};

module.exports = connectDb;
