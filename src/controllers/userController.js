const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const NodeCache = require('node-cache');

const userCache = new NodeCache({ stdTTL: 60 });

const getAllUsers = catchAsync(async (req, res, next) => {
  const key = `users-${JSON.stringify(req.query)}`;
  const cachedData = userCache.get(key);
  if (cachedData) {
    console.log("It's already exist");
    return res.status(200).json({
      status: 'success',
      data: cachedData
    });
  }

  const queryObj = { ...req.query };
  const excludedFields = ['fields', 'sort', 'page', 'limit'];
  excludedFields.forEach((q) => delete queryObj[q]);

  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  let parsedQuery = JSON.parse(queryString);

  // Convert numbers
  for (const key in parsedQuery) {
    if (typeof parsedQuery[key] === 'object') {
      for (const op in parsedQuery[key]) {
        const val = parsedQuery[key][op];
        parsedQuery[key][op] = !isNaN(val) ? Number(val) : val;
      }
    }
  }

  let query = User.find(parsedQuery);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const numUsers = await User.countDocuments(parsedQuery);
    if (skip >= numUsers) {
      return next(new AppError('This page does not exist', 404));
    }
  }

  const users = await query;
  userCache.set(
    key,
    users.map((u) => u.toObject())
  );

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
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
