const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
