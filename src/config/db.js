const mongoose = require('mongoose');
const { mongoURI, mongoUser, mongoPassword } = require('./config');

const connectDB = async () => {
  try {
    const uri = mongoURI
      .replace('<USER>', mongoUser)
      .replace('<PASSWORD>', mongoPassword);
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
