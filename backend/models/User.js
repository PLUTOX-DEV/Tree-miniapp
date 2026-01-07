const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  points: {
    type: Number,
    default: 0
  },
  xp: {
    type: Number,
    default: 0
  },
  tap_power: {
    type: Number,
    default: 1
  },
  auto_level: {
    type: Number,
    default: 0
  },
  last_daily: {
    type: Date,
    default: null
  },
  total_taps: {
    type: Number,
    default: 0
  },
  soft_resets: {
    type: Number,
    default: 0
  },
  farcaster_username: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);