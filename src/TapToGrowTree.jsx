// TapToGrowTree.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Zap,
  Clock,
  Gift,
  RefreshCcw,
  Crown,
  LogOut,
  TreePine,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useDisconnect } from "wagmi";

const LEVELS = [
  { name: "Seed", xp: 0, icon: "🌱" },
  { name: "Sprout", xp: 100, icon: "🌿" },
  { name: "Sapling", xp: 300, icon: "🌳" },
  { name: "Young Tree", xp: 750, icon: "🌲" },
  { name: "Mature Oak", xp: 1500, icon: "🌳" },
  { name: "Ancient Guardian", xp: 3000, icon: "🦉" },
  { name: "Enchanted Willow", xp: 5000, icon: "✨" },
  { name: "Crystal Tree", xp: 8000, icon: "💎" },
  { name: "Tree of Eternity", xp: 12000, icon: "🌟" },
  { name: "Cosmic Sentinel", xp: 18000, icon: "🌌" },
  { name: "Legendary Phoenix Tree", xp: 25000, icon: "🔥" },
  { name: "Divine Redwood", xp: 35000, icon: "🌲" },
  { name: "Mythical Yggdrasil", xp: 50000, icon: "🌍" },
  { name: "Celestial Oak", xp: 70000, icon: "⭐" },
  { name: "Quantum Arbor", xp: 95000, icon: "⚛️" },
  { name: "Nebula Grove", xp: 125000, icon: "🌠" },
  { name: "Galactic Nexus", xp: 160000, icon: "🌀" },
  { name: "Eternal Forest Lord", xp: 200000, icon: "👑" },
  { name: "Dimensional Weaver", xp: 250000, icon: "🌈" },
  { name: "Void Tree", xp: 320000, icon: "🕳️" },
  { name: "Reality Anchor", xp: 400000, icon: "🎯" },
  { name: "Multiverse Sage", xp: 500000, icon: "🌌" },
  { name: "Infinite Arborist", xp: 650000, icon: "♾️" },
  { name: "Chaos Tree", xp: 850000, icon: "🌪️" },
  { name: "Harmony Weaver", xp: 1100000, icon: "🎵" },
  { name: "Time Lord Oak", xp: 1400000, icon: "⏰" },
  { name: "Soul Tree", xp: 1800000, icon: "👻" },
  { name: "Dream Weaver", xp: 2300000, icon: "💭" },
  { name: "Legend of the Forest", xp: 3000000, icon: "🏆" },
  { name: "Ultimate Tree of Power", xp: 4000000, icon: "⚡" },
  { name: "God Tree", xp: 5500000, icon: "👼" },
  { name: "Supreme Arbor", xp: 7500000, icon: "👑" },
  { name: "Transcendent Grove", xp: 10000000, icon: "✨" },
  { name: "Omega Tree", xp: 15000000, icon: "🌀" },
  { name: "Final Arbiter", xp: 25000000, icon: "⚖️" },
];

const format = (n) => n.toLocaleString();

export default function TapToGrowTree({
  profile: initialProfile,
  onLogout,
  goToProfile,
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [tapCost, setTapCost] = useState(50);
  const [autoCost, setAutoCost] = useState(150);
  const [leveledUp, setLeveledUp] = useState(null);

  // 🔄 auto-save
  useEffect(() => {
    if (!profile?.wallet) return;
    const save = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/users/${profile.wallet}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            points: profile.points,
            xp: profile.xp,
            tap_power: profile.tap_power,
            auto_level: profile.auto_level,
            last_daily: profile.last_daily
              ? new Date(profile.last_daily).toISOString()
              : null,
            total_taps: profile.total_taps,
            soft_resets: profile.soft_resets,
          }),
        });
      } catch (error) {
        console.error('Save error:', error);
      }
    };
    const t = setTimeout(save, 600);
    return () => clearTimeout(t);
  }, [profile]);

  if (!profile) return <div className="p-6 text-center">Loading tree… 🌱</div>;

  // 🧩 helpers
  const setField = (field, val) =>
    setProfile((p) => ({
      ...p,
      [field]: typeof val === "function" ? val(p[field]) : val,
    }));

  const {
    points,
    xp,
    tap_power,
    auto_level,
    last_daily,
    total_taps,
    soft_resets,
  } = profile;

  // ✅ level
  const levelIndex = useMemo(
    () => LEVELS.reduce((acc, lvl, i) => (xp >= lvl.xp ? i : acc), 0),
    [xp]
  );
  const currentLevel = LEVELS[levelIndex];
  const nextLevel = LEVELS[Math.min(levelIndex + 1, LEVELS.length - 1)];
  const maxed = levelIndex === LEVELS.length - 1;
  const progress = maxed
    ? 1
    : (xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp);

  // 🎉 detect level up
  useEffect(() => {
    if (xp >= nextLevel.xp && !maxed) {
      setLeveledUp(nextLevel.name);
      setTimeout(() => setLeveledUp(null), 3000);
    }
  }, [xp]);

  // ✅ auto grow
  useEffect(() => {
    if (auto_level <= 0) return;
    const id = setInterval(() => {
      setField("points", (p) => p + auto_level);
      setField("xp", (p) => p + auto_level);
    }, 1000);
    return () => clearInterval(id);
  }, [auto_level]);

  // ✅ tap
  const onTap = () => {
    setField("points", points + tap_power);
    setField("xp", xp + tap_power);
    setField("total_taps", total_taps + 1);
  };

  // ✅ upgrades
  const buyTap = () => {
    if (points < tapCost) return;
    setField("points", points - tapCost);
    setField("tap_power", tap_power + 1);
    setTapCost(Math.ceil(tapCost * 1.7));
  };
  const buyAuto = () => {
    if (points < autoCost) return;
    setField("points", points - autoCost);
    setField("auto_level", auto_level + 1);
    setAutoCost(Math.ceil(autoCost * 1.8));
  };

  // ✅ daily reward
  const millisInDay = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const canClaimDaily =
    !last_daily || now - new Date(last_daily).getTime() > millisInDay;

  const claimDaily = () => {
    if (!canClaimDaily) return;
    const reward = 100 + Math.floor(levelIndex * 25 + soft_resets * 50);
    setField("points", points + reward);
    setField("xp", xp + Math.floor(reward / 2));
    setField("last_daily", new Date().toISOString());
  };

  // ✅ prestige
  const softReset = () => {
    if (xp < 500) return;
    const bonus = 1 + Math.floor(xp / 1500);
    setProfile({
      ...profile,
      points: 0,
      xp: 0,
      auto_level: 0,
      tap_power: 1 + bonus + soft_resets,
      total_taps: 0,
      soft_resets: soft_resets + 1,
      last_daily: null,
    });
    setTapCost(50);
    setAutoCost(150);
  };
  // inside TapToGrowTree component
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* 🔝 top navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
            <TreePine className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            TAP TO GROW
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg">
            <span className="text-sm text-gray-300">Prestige: <span className="text-yellow-400 font-semibold">{soft_resets}</span></span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              disconnect();
              onLogout();
            }}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm flex items-center gap-2 shadow-lg hover:shadow-red-500/25 transition-all duration-300"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToProfile}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            👤 Profile
          </motion.button>
        </div>
      </motion.div>

      {/* 🎉 level up popup */}
      <AnimatePresence>
        {leveledUp && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-2xl shadow-lg font-bold"
          >
            🎉 Leveled up! Welcome to {leveledUp}!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-lg relative z-10">
        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl shadow-xl"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Points</div>
            <div className="font-bold text-xl text-green-400">{format(points)}</div>
            <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl shadow-xl"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tap Power</div>
            <div className="font-bold flex items-center text-yellow-400">
              <Zap className="w-5 h-5 mr-2" /> x{tap_power}
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl shadow-xl"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Auto Grow</div>
            <div className="font-bold flex items-center text-blue-400">
              <Clock className="w-5 h-5 mr-2" /> {auto_level}/s
            </div>
            <div className="w-full h-1 bg-slate-700 rounded-full mt-2">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-2xl mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">{currentLevel.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Taps</div>
              <div className="font-semibold text-purple-400">{format(total_taps)}</div>
            </div>
          </div>
          <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full shadow-lg"
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="text-sm text-gray-300">
            {maxed
              ? "🎉 Max level reached! You are the ultimate grower!"
              : `${format(xp - currentLevel.xp)} / ${format(
                  nextLevel.xp - currentLevel.xp
                )} XP to ${nextLevel.name}`}
          </div>
        </motion.div>

        {/* tap area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 p-8 rounded-3xl shadow-2xl text-center mb-6 relative overflow-hidden"
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-3xl"></div>

          <motion.div
            key={xp}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.3 }}
            className="text-8xl mb-6 relative z-10"
          >
            {currentLevel.icon}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTap}
            className="relative px-8 py-4 bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl hover:shadow-green-500/25 font-bold text-lg transition-all duration-300 overflow-hidden group"
          >
            <span className="flex items-center gap-3 relative z-10">
              <Zap className="w-5 h-5" />
              GROW +{tap_power} XP
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>

        {/* upgrades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: points >= tapCost ? 1.05 : 1 }}
            whileTap={{ scale: points >= tapCost ? 0.95 : 1 }}
            onClick={buyTap}
            disabled={points < tapCost}
            className={`relative p-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
              points >= tapCost
                ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-xl hover:shadow-yellow-500/25"
                : "bg-slate-800/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex flex-col items-center gap-2 relative z-10">
              <Zap className="w-6 h-6" />
              <span className="text-sm">Tap Power</span>
              <span className="text-lg font-bold">{format(tapCost)}</span>
            </div>
            {points >= tapCost && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: points >= autoCost ? 1.05 : 1 }}
            whileTap={{ scale: points >= autoCost ? 0.95 : 1 }}
            onClick={buyAuto}
            disabled={points < autoCost}
            className={`relative p-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
              points >= autoCost
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl hover:shadow-blue-500/25"
                : "bg-slate-800/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex flex-col items-center gap-2 relative z-10">
              <Clock className="w-6 h-6" />
              <span className="text-sm">Auto Grow</span>
              <span className="text-lg font-bold">{format(autoCost)}</span>
            </div>
            {points >= autoCost && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            )}
          </motion.button>
        </motion.div>

        {/* daily reward */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-white">Daily Reward</div>
              <div className="text-sm text-gray-400">Claim your bonus!</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: canClaimDaily ? 1.05 : 1 }}
            whileTap={{ scale: canClaimDaily ? 0.95 : 1 }}
            onClick={claimDaily}
            disabled={!canClaimDaily}
            animate={
              canClaimDaily
                ? {
                    scale: [1, 1.1, 1],
                    transition: { repeat: Infinity, duration: 2 },
                  }
                : {}
            }
            className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-300 overflow-hidden ${
              canClaimDaily
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl hover:shadow-amber-500/25"
                : "bg-slate-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center gap-2 relative z-10">
              {canClaimDaily ? <Sparkles className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
              {canClaimDaily ? "Claim" : "Claimed"}
            </span>
            {canClaimDaily && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            )}
          </motion.button>
        </motion.div>

        {/* leaderboard placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
              <Crown className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-white">Global Leaderboard</h2>
              <p className="text-sm text-gray-400">Coming Soon - Compete Worldwide!</p>
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
            <div className="flex items-center justify-center gap-3 text-gray-500">
              <Trophy className="w-8 h-8" />
              <span className="text-lg">Be the first to claim the throne!</span>
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
