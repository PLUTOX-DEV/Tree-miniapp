// TapToGrowTree.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Zap,
  Clock,
  Gift,
  RefreshCcw,
  Crown,
  LogOut,
} from "lucide-react";
import { useDisconnect } from "wagmi";

const LEVELS = [
  { name: "Seed", xp: 0, icon: "🌱" },
  { name: "Sprout", xp: 50, icon: "🌿" },
  { name: "Sapling", xp: 150, icon: "🌳" },
  { name: "Tree", xp: 400, icon: "🌲" },
  { name: "Big Tree", xp: 1000, icon: "🎄" },
  { name: "Magical Tree", xp: 2500, icon: "✨" },
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
      await supabase.from("profiles").upsert({
        id: profile.id,
        wallet: profile.wallet.toLowerCase(),
        points: profile.points,
        xp: profile.xp,
        tap_power: profile.tap_power,
        auto_level: profile.auto_level,
        last_daily: profile.last_daily
          ? new Date(profile.last_daily).toISOString()
          : null,
        total_taps: profile.total_taps,
        soft_resets: profile.soft_resets,
      });
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
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-200 via-emerald-50 to-emerald-100 text-slate-800 p-4 sm:p-6">
      {/* 🔝 top navbar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">🌳 Tap-to-Grow</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Resets: {soft_resets}</span>
          <button
            onClick={() => {
              disconnect(); // ✅ disconnect wallet session
              onLogout(); // ✅ clear profile in App.jsx
            }}
            className="px-2 py-1 rounded-xl bg-red-500 text-white text-xs flex items-center gap-1"
          >
            <LogOut size={14} /> Logout
          </button>

          <button
            onClick={goToProfile}
            className="px-3 py-1 rounded-xl bg-emerald-500 text-white text-sm"
          >
            👤 Profile
          </button>
        </div>
      </div>

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

      <div className="mx-auto max-w-lg">
        {/* stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white p-3 rounded-xl shadow">
            <div className="text-xs text-slate-500">Points</div>
            <div className="font-bold text-lg">{format(points)}</div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow">
            <div className="text-xs text-slate-500">Tap Power</div>
            <div className="font-bold flex items-center">
              <Zap className="w-4 h-4 mr-1 text-emerald-500" /> x{tap_power}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl shadow">
            <div className="text-xs text-slate-500">Auto</div>
            <div className="font-bold flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" /> {auto_level}/s
            </div>
          </div>
        </div>

        {/* progress */}
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">{currentLevel.name}</span>
            <span className="text-xs text-slate-500">
              Taps: {format(total_taps)}
            </span>
          </div>
          <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-green-500"
              animate={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-slate-600">
            {maxed
              ? "Max level reached!"
              : `${format(xp - currentLevel.xp)} / ${format(
                  nextLevel.xp - currentLevel.xp
                )} → ${nextLevel.name}`}
          </div>
        </div>

        {/* tap area */}
        <div className="bg-white p-6 rounded-xl shadow text-center mb-4">
          <motion.div
            key={xp}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.2 }}
            className="text-7xl"
          >
            {currentLevel.icon}
          </motion.div>
          <button
            onClick={onTap}
            className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow hover:bg-emerald-700 font-bold"
          >
            GROW 🌱 +{tap_power}
          </button>
        </div>

        {/* upgrades */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={buyTap}
            disabled={points < tapCost}
            className={`p-3 rounded-xl shadow font-semibold ${
              points >= tapCost
                ? "bg-emerald-500 text-white"
                : "bg-slate-300 text-white"
            }`}
          >
            <Zap className="inline w-4 h-4 mr-1" />
            Tap Power ({format(tapCost)})
          </button>
          <button
            onClick={buyAuto}
            disabled={points < autoCost}
            className={`p-3 rounded-xl shadow font-semibold ${
              points >= autoCost
                ? "bg-blue-500 text-white"
                : "bg-slate-300 text-white"
            }`}
          >
            <Clock className="inline w-4 h-4 mr-1" />
            Auto ({format(autoCost)})
          </button>
        </div>

        {/* daily reward */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <span className="font-semibold">Daily Reward</span>
          </div>
          <motion.button
            onClick={claimDaily}
            disabled={!canClaimDaily}
            animate={
              canClaimDaily
                ? {
                    scale: [1, 1.1, 1],
                    transition: { repeat: Infinity, duration: 1.5 },
                  }
                : {}
            }
            className={`px-3 py-1 rounded-2xl font-semibold ${
              canClaimDaily
                ? "bg-amber-500 text-white"
                : "bg-slate-300 text-white"
            }`}
          >
            Claim
          </motion.button>
        </div>

        {/* leaderboard placeholder */}
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="text-yellow-500 w-5 h-5" />
            <h2 className="font-bold">Leaderboard (Coming Soon)</h2>
          </div>
          <p className="text-sm text-slate-500">
            Compete with other players to grow the biggest tree!
          </p>
        </div>
      </div>
    </div>
  );
}
