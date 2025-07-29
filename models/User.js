const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
  }],
  verified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  password2: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: false
  },
  facebook: {
    type: String,
    required: false
  },
  instagram: {
    type: String,
    required: false
  },
  twitter: {
    type: String,
    required: false
  },
  youtube: {
    type: String,
    required: false
  },
  github: {
    type: String,
    required: false
  },
  website: {
    type: String,
    required: false
  },
  discord: {
    type: String,
    required: false
  },
  linkedin: {
    type: String,
    required: false
  },
  twitch: {
    type: String,
    required: false
  },
  mail: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
