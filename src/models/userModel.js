const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { salt } = require('../config/config');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required']
    },
    birthday: {
      type: Date,
      required: [true, 'Birthday is required'],
      validate: {
        validator: (d) => validator.isDate(d),
        message: (props) => `${props.value} isn't a valid date`
      }
    },
    email: {
      type: String,
      required: [true, "User's email is required"],
      unique: true,
      validate: {
        validator: (e) => validator.isEmail(e),
        message: (props) => `${props.value} is not a valid email!`
      }
    },
    role: {
      type: String,
      enum: { values: ['Admin', 'User'], message: '{VALUE} is not supported' },
      default: 'User'
    },
    score: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      enum: {
        values: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        message: '{VALUE} is not supported'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'password has to be 8 charachters at least'],
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, "You've to confirm your password"],
      minLength: 8,
      validate: {
        validator: function (pass) {
          return this.password === pass;
        },
        message: "Passwords don't match!"
      }
    }
  },
  { toObject: { virtuals: true }, timestamps: true }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('age').get(function () {
  const today = new Date();

  let age = today.getFullYear() - this.birthday.getFullYear();
  const monthDiff = today.getMonth() - this.birthday.getMonth();
  const dayDiff = today.getDate() - this.birthday.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPasswords = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
