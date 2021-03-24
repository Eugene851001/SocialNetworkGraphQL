const mongoose = require('mongoose');

const postScheme = new mongoose.Schema({
  date: Date,
  description: {type: String, default: ''},
  author: {type: mongoose.Schema.ObjectId, ref: 'User'},
  image: {type: String, default: 'NoImage.png'},
  likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
});

module.exports = new mongoose.model('Post', postScheme); 