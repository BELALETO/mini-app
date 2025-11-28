const express = require('express');
const morgan = require('morgan');
const qs = require('qs');

const app = express();

// Middleware
app.set('query parser', (str) => qs.parse(str));
app.use(morgan('dev'));
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res, next) => {
  const err = new Error(`Can't reach ${req.originalUrl}`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'something went wrong';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
