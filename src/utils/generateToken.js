const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/config');
const { promisify } = require('util');

const sign = promisify(jwt.sign);

const generateToken = async (payload) => {
  return await sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
};

module.exports = generateToken;
