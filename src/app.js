const express = require('express');
const morgan = require('morgan');
const qs = require('qs');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHandler');

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
  next(new AppError(`Can't reach ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
