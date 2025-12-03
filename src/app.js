const express = require('express');
const morgan = require('morgan');
const qs = require('qs');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const { disconnectDB } = require('./config/db');
const sendEmail = require('./utils/email');
const catchAsync = require('./utils/catchAsync');

const app = express();

// Middleware
app.set('query parser', (str) => qs.parse(str));
app.use(morgan('dev'));
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post(
  '/send-test-email',
  catchAsync(async (req, res, next) => {
    const { to, subject, text, html } = req.body;
    if (!to || !subject || !text) {
      return next(new AppError('Missing required email parameters', 400));
    }
    await sendEmail({ to, subject, text, html });
    res
      .status(200)
      .json({ status: 'success', message: 'Email sent successfully' });
  })
);

// Routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't reach ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

//TODO: change this to graceful shutdown
process.on('uncaughtException', async (err) => {
  console.error(err);
  await disconnectDB();
  console.log('shutting down the server...');
  process.exit(1);
});

//TODO: change this to graceful shutdown
process.on('unhandledRejection', (reason, promise) => {
  console.error(`unhandled Rejection at ${promise} because of ${reason}`);
  console.log('shutting down the server...');
  process.exit(1);
});

module.exports = app;
