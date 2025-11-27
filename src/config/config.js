require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD
}
