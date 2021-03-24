const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
  name: String,
  login: String,
  password: String,
  photo: {type: String, default: ''},
  followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
  following: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
});

module.exports = new mongoose.model('User', userScheme);