require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  salt: process.env.SALT || 12,
  mongoURI: process.env.MONGO_URI,
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  sendGridEmail: process.env.SENDER_EMAIL
};
