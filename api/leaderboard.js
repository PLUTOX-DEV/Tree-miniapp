const mongoose = require('mongoose');

// User Schema (same as backend/models/User.js)
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

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
      });
    }

    const users = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select('wallet xp points farcaster_username');

    return res.status(200).json(users);

  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}