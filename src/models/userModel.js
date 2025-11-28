const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxLength: 50
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxLength: 50
    },
    birthday: {
      type: Date,
      required: [true, 'Birthday is required'],
      validate: {
        validator: (d) => d instanceof Date && !isNaN(d.getTime()),
        message: (props) => `${props.value} isn't a valid date`
      }
    },
    email: {
      type: String,
      required: [true, "User's email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (e) => validator.isEmail(e),
        message: (props) => `${props.value} is not a valid email`
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
      },
      default: 'Bronze'
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, 'You must confirm your password'],
      minLength: 8,
      validate: {
        validator: function (pass) {
          return this.password === pass;
        },
        message: 'Passwords do not match'
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
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  return;
});

userSchema.methods.correctPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
