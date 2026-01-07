// TapToGrowTree.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Zap,
  Clock,
  Gift,
  Crown,
  LogOut,
  TreePine,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useDisconnect } from "wagmi";

/* =======================
   LEVEL DATA (NO EMOJI)
======================= */
const LEVELS = [
  { name: "Seed", xp: 0 },
  { name: "Sprout", xp: 100 },
  { name: "Sapling", xp: 300 },
  { name: "Young Tree", xp: 750 },
  { name: "Mature Oak", xp: 1500 },
  { name: "Ancient Guardian", xp: 3000 },
  { name: "Enchanted Willow", xp: 5000 },
  { name: "Crystal Tree", xp: 8000 },
  { name: "Tree of Eternity", xp: 12000 },
  { name: "Cosmic Sentinel", xp: 18000 },
  { name: "Legendary Phoenix Tree", xp: 25000 },
  { name: "Divine Redwood", xp: 35000 },
  { name: "Mythical Yggdrasil", xp: 50000 },
  { name: "Celestial Oak", xp: 70000 },
  { name: "Quantum Arbor", xp: 95000 },
  { name: "Nebula Grove", xp: 125000 },
  { name: "Galactic Nexus", xp: 160000 },
  { name: "Eternal Forest Lord", xp: 200000 },
  { name: "Dimensional Weaver", xp: 250000 },
  { name: "Void Tree", xp: 320000 },
  { name: "Reality Anchor", xp: 400000 },
  { name: "Multiverse Sage", xp: 500000 },
  { name: "Infinite Arborist", xp: 650000 },
  { name: "Chaos Tree", xp: 850000 },
  { name: "Harmony Weaver", xp: 1100000 },
  { name: "Time Lord Oak", xp: 1400000 },
  { name: "Soul Tree", xp: 1800000 },
  { name: "Dream Weaver", xp: 2300000 },
  { name: "Legend of the Forest", xp: 3000000 },
  { name: "Ultimate Tree of Power", xp: 4000000 },
  { name: "God Tree", xp: 5500000 },
  { name: "Supreme Arbor", xp: 7500000 },
  { name: "Transcendent Grove", xp: 10000000 },
  { name: "Omega Tree", xp: 15000000 },
  { name: "Final Arbiter", xp: 25000000 },
];

/* =======================
   LEVEL ICON MAP
======================= */
const LEVEL_ICONS = [
  Leaf, Leaf, TreePine, TreePine, TreePine,
  Sparkles, Sparkles, Crown, Crown, Crown,
  Trophy, Trophy, Trophy, Crown, Crown,
  Sparkles, Sparkles, Crown, Crown, Sparkles,
  Sparkles, Crown, Crown, Sparkles, Sparkles,
  Crown, Crown, Trophy, Trophy, Sparkles,
  Crown, Crown, Sparkles, Crown, Trophy,
];

const format = (n) => n.toLocaleString();

/* =======================
   COMPONENT
======================= */
export default function TapToGrowTree({
  profile: initialProfile,
  onLogout,
  goToProfile,
}) {
  const { disconnect } = useDisconnect();
  const [profile, setProfile] = useState(initialProfile);
  const [tapCost, setTapCost] = useState(50);
  const [autoCost, setAutoCost] = useState(150);
  const [leveledUp, setLeveledUp] = useState(null);

  /* =======================
     AUTO SAVE
  ======================= */
  useEffect(() => {
    if (!profile?.wallet) return;
    const t = setTimeout(async () => {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${profile.wallet}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
          }
        );
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-400">
        Loading…
      </div>
    );
  }

  const setField = (k, v) =>
    setProfile((p) => ({ ...p, [k]: typeof v === "function" ? v(p[k]) : v }));

  const {
    points,
    xp,
    tap_power,
    auto_level,
    total_taps,
    last_daily,
    soft_resets,
  } = profile;

  /* =======================
     LEVEL CALC
  ======================= */
  const levelIndex = useMemo(
    () => LEVELS.reduce((a, l, i) => (xp >= l.xp ? i : a), 0),
    [xp]
  );

  const currentLevel = LEVELS[levelIndex];
  const nextLevel = LEVELS[Math.min(levelIndex + 1, LEVELS.length - 1)];
  const maxed = levelIndex === LEVELS.length - 1;
  const progress = maxed
    ? 1
    : (xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp);

  const LevelIcon = LEVEL_ICONS[levelIndex] || TreePine;

  /* =======================
     LEVEL UP EFFECT
  ======================= */
  useEffect(() => {
    if (!maxed && xp >= nextLevel.xp) {
      setLeveledUp(nextLevel.name);
      setTimeout(() => setLeveledUp(null), 2500);
    }
  }, [xp]);

  /* =======================
     AUTO GROW
  ======================= */
  useEffect(() => {
    if (auto_level <= 0) return;
    const id = setInterval(() => {
      setField("points", (p) => p + auto_level);
      setField("xp", (x) => x + auto_level);
    }, 1000);
    return () => clearInterval(id);
  }, [auto_level]);

  /* =======================
     ACTIONS
  ======================= */
  const onTap = () => {
    setField("points", points + tap_power);
    setField("xp", xp + tap_power);
    setField("total_taps", total_taps + 1);
  };

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

  const canClaimDaily =
    !last_daily || Date.now() - new Date(last_daily).getTime() > 86400000;

  const claimDaily = () => {
    if (!canClaimDaily) return;
    const reward = 100 + levelIndex * 25 + soft_resets * 50;
    setField("points", points + reward);
    setField("xp", xp + Math.floor(reward / 2));
    setField("last_daily", new Date().toISOString());
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
            <TreePine className="text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wide">Tap To Grow</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={goToProfile}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            Profile
          </button>
          <button
            onClick={() => {
              disconnect();
              onLogout();
            }}
            className="p-2 rounded-xl bg-red-500/20 border border-red-400/30"
          >
            <LogOut />
          </button>
        </div>
      </div>

      {/* LEVEL UP */}
      <AnimatePresence>
        {leveledUp && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-2xl shadow-xl"
          >
            New Rank: {leveledUp}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat title="Points" value={format(points)} icon={Leaf} />
        <Stat title="Tap Power" value={`x${tap_power}`} icon={Zap} />
        <Stat title="Auto /s" value={auto_level} icon={Clock} />
      </div>

      {/* PROGRESS */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 mb-6">
        <div className="flex justify-between mb-3">
          <div className="flex items-center gap-3">
            <LevelIcon className="text-emerald-400" />
            <span className="font-semibold">{currentLevel.name}</span>
          </div>
          <span className="text-sm text-gray-400">
            {format(xp)} XP
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-blue-500"
            animate={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* TAP */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-3xl p-8 mb-6 text-center">
        <motion.div
          key={xp}
          animate={{ scale: [1, 1.15, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="w-28 h-28 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
            <LevelIcon className="w-14 h-14 text-emerald-400" />
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onTap}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 font-semibold shadow-xl"
        >
          <div className="flex justify-center gap-3">
            <Zap /> Grow +{tap_power} XP
          </div>
        </motion.button>
      </div>

      {/* UPGRADES */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Upgrade
          title="Tap Power"
          icon={Zap}
          cost={tapCost}
          onClick={buyTap}
          disabled={points < tapCost}
        />
        <Upgrade
          title="Auto Grow"
          icon={Clock}
          cost={autoCost}
          onClick={buyAuto}
          disabled={points < autoCost}
        />
      </div>

      {/* DAILY */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Gift className="text-amber-400" />
          <div>
            <p className="font-semibold">Daily Reward</p>
            <p className="text-xs text-gray-400">24h cooldown</p>
          </div>
        </div>
        <button
          onClick={claimDaily}
          disabled={!canClaimDaily}
          className={`px-6 py-2 rounded-xl font-semibold ${
            canClaimDaily
              ? "bg-amber-500 text-black"
              : "bg-slate-700 text-gray-400"
          }`}
        >
          Claim
        </button>
      </div>
    </div>
  );
}

/* =======================
   SMALL COMPONENTS
======================= */
const Stat = ({ title, value, icon: Icon }) => (
  <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4">
    <Icon className="text-emerald-400 mb-2" />
    <p className="text-xs text-gray-400">{title}</p>
    <p className="font-bold">{value}</p>
  </div>
);

const Upgrade = ({ title, icon: Icon, cost, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-4 rounded-2xl border transition ${
      disabled
        ? "bg-slate-800 border-slate-700 text-gray-500"
        : "bg-slate-900 border-emerald-400/30 hover:bg-slate-800"
    }`}
  >
    <Icon className="mb-2" />
    <p className="text-sm">{title}</p>
    <p className="font-bold">{format(cost)}</p>
  </button>
);
