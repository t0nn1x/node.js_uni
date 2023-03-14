const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
    },
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password should not contain the word "password"');
      }
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


// // create a new user object
// const user = new User({
//     name: '   Andrew   ',
//     age: 27,
//     email: 'AAnn@gmail.com',
//     password: 'phone098!'
//     });

// // save the user to the database
// user
//     .save()
//     .then(() => console.log('User saved to database'))
//     .catch((err) => console.error(err));


