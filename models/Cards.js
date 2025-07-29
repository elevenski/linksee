const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;
