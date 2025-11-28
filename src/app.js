const express = require('express');
const morgan = require('morgan');
const qs = require('qs');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

const app = express();

// Middleware
app.set('query parser', (str) => qs.parse(str));
app.use(morgan('dev'));
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't reach ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
