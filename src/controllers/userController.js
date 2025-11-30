const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const NodeCache = require('node-cache');

const userCache = new NodeCache({ stdTTL: 60 });

const getAllUsers = catchAsync(async (req, res, next) => {
  const key = 'users';
  const cachedData = userCache.get(key);
  if (cachedData) {
    console.log("It's allready exist");
    return res.status(200).json({
      status: 'success',
      data: cachedData
    });
  }

  console.log("I'll cache it");
  const users = await User.find();
  userCache.set(key, users);
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const key = `user-${req.params.id}`;
  const cachedData = userCache.get(key);
  if (cachedData) {
    return res.status(200).json({
      status: 'success',
      data: { user: cachedData }
    });
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  userCache.set(key, user);
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
