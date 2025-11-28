const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error = new Error(message);
  error.statusCode = 400;
  error.status = 'fail';
  error.isOperational = true;
  return error;
};

const sendErrorDev = (err, res) => {
  if (err.name === 'CastError') err = handleCastErrorDB(err);
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
      message: 'Something went badly wrong💥'
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  console.log('err :>> ', err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'something went wrong';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
