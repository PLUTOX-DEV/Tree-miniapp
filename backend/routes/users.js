const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get or create user profile
router.get('/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    let user = await User.findOne({ wallet });

    if (!user) {
      user = new User({
        wallet,
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

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { wallet },
      updateData,
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select('wallet xp points');

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;