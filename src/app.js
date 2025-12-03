const express = require('express');
const morgan = require('morgan');
const qs = require('qs');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const { disconnectDB } = require('./config/db');
const sendEmail = require('./utils/email');

const app = express();

// Middleware
app.set('query parser', (str) => qs.parse(str));
app.use(morgan('dev'));
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/send-email', async (req, res) => {
  try {
    await sendEmail({
      to: 'belalsryo@gmail.com',
      subject: 'Test Email from SendGrid',
      text: 'This is a test email sent using SendGrid SMTP.'
    });
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to send email', error: error.message });
  }
});

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
