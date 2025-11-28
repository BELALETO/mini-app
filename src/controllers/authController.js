const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');

exports.register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, birthday, email, password, confirmPassword } =
    req.body;

  const newUser = await User.create({
    firstName,
    lastName,
    birthday,
    email,
    password,
    confirmPassword
  });

  const token = await generateToken({ id: newUser._id });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateToken({ id: user._id });

  res.status(200).json({
    status: 'success',
    token
  });
});
