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
  const { wallet } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  try {
    // Connect to MongoDB if not connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
      });
    }

    const walletLower = wallet.toLowerCase();

    if (req.method === 'GET') {
      // Get or create user profile
      let user = await User.findOne({ wallet: walletLower });

      if (!user) {
        user = new User({
          wallet: walletLower,
          points: 0,
          xp: 0,
          tap_power: 1,
          auto_level: 0,
          last_daily: null,
          total_taps: 0,
          soft_resets: 0
        });
        await user.save();
      }

      return res.status(200).json(user);

    } else if (req.method === 'PUT') {
      // Update user profile
      const updateData = req.body;
      const user = await User.findOneAndUpdate(
        { wallet: walletLower },
        updateData,
        { new: true, upsert: true }
      );

      return res.status(200).json(user);

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}