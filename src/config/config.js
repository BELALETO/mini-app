require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  salt: process.env.SALT || 12,
  mongoURI: process.env.MONGO_URI,
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD
};
