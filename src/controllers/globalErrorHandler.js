const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error = new AppError(message, 400);
  return error;
};

const handleValidationError = (err) => {
  let message = '';
  for (const key in err.errors) {
    const errorObj = err.errors[key];
    message += `${errorObj.message} `;
  }
  const error = new AppError(message, 400);
  return error;
};

const handleDuplicateFields = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `${field} is a duplicate field`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('Error💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong💥'
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  console.log('error :>> ', JSON.parse(JSON.stringify(error)));
  error.message = err.message;
  error.name = err.name;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFields(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);

  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  } else {
    sendErrorDev(error, res);
  }
};

module.exports = globalErrorHandler;
