import React, { useEffect, useState } from "react";
import {
  Crown,
  RefreshCcw,
  Award,
  ArrowLeft,
  LogOut,
  User,
  Trophy,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

/* =========================
   Coinbase Icon (Icon Only)
========================= */
function CoinbaseIcon({ size = 64 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,82,255,0.6)]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #0052FF, #2A7FFF)",
      }}
    >
      <div
        className="bg-white rounded-full"
        style={{
          width: size * 0.6,
          height: size * 0.6,
          maskImage:
            "radial-gradient(circle at center, black 55%, transparent 56%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 55%, transparent 56%)",
        }}
      />
    </div>
  );
}

const format = (n = 0) => n.toLocaleString();

export default function ProfilePage({ profile, goBack, onLogout }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/leaderboard`
        );
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (e) {
        console.error("Leaderboard error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const {
    wallet,
    points,
    xp,
    tap_power,
    auto_level,
    total_taps,
    soft_resets,
    farcaster_username,
  } = profile;

  const shortAddr = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Nav */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <button
          onClick={goBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Profile Header */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-6 mb-6">
            <CoinbaseIcon size={72} />

            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Player Profile
              </h1>
              {farcaster_username && (
                <p className="text-purple-400 font-semibold">
                  @{farcaster_username}
                </p>
              )}
              <p className="text-gray-400 font-mono text-sm">{shortAddr}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Stat icon={<Star />} label="Points" value={format(points)} color="text-green-400" />
            <Stat icon={<TrendingUp />} label="XP" value={format(xp)} color="text-blue-400" />
            <Stat icon={<Award />} label="Tap Power" value={`x${tap_power}`} color="text-purple-400" />
            <Stat icon={<RefreshCcw />} label="Auto Level" value={`${auto_level}/s`} color="text-green-400" />
          </div>
        </div>

        {/* Achievements & Stats */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card title="Achievements" icon={<Trophy className="text-yellow-400" />}>
            {total_taps >= 100 && <Badge text="💪 Tap Rookie (100 taps)" color="yellow" />}
            {total_taps >= 1000 && <Badge text="🔥 Tap Master (1000 taps)" color="orange" />}
            {soft_resets >= 1 && <Badge text="🔄 First Prestige" color="blue" />}
            {soft_resets >= 5 && <Badge text="👑 Prestige Veteran" color="purple" />}
            {total_taps < 100 && (
              <p className="text-center text-gray-400">Keep tapping 🌱</p>
            )}
          </Card>

          <Card title="Game Stats" icon={<Users className="text-green-400" />}>
            <Row label="Total Taps" value={format(total_taps)} />
            <Row label="Prestige Resets" value={soft_resets} />
            <Row label="Account Age" value="New Player" />
          </Card>
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
            <Crown className="text-yellow-400" /> Global Leaderboard
          </h3>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : leaderboard.length ? (
            leaderboard.map((p, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-4 rounded-2xl mb-3 border ${
                  p.wallet === wallet
                    ? "bg-blue-500/20 border-blue-500"
                    : "bg-slate-800/40 border-slate-700"
                }`}
              >
                <div>
                  <p className="font-semibold">
                    {p.farcaster_username
                      ? `@${p.farcaster_username}`
                      : `${p.wallet.slice(0, 6)}...${p.wallet.slice(-4)}`}
                  </p>
                  <p className="text-sm text-gray-400">{format(p.xp)} XP</p>
                </div>
                <p className="font-bold text-green-400">
                  {format(p.points)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">No players yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   Small UI Helpers
========================= */

const Stat = ({ icon, label, value, color }) => (
  <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700">
    <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
      {icon} {label}
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const Card = ({ title, icon, children }) => (
  <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-3xl p-6 shadow-xl space-y-3">
    <h3 className="text-xl font-bold flex items-center gap-3">
      {icon} {title}
    </h3>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between bg-slate-800/40 p-3 rounded-xl">
    <span className="text-gray-400">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const Badge = ({ text, color }) => (
  <div
    className={`p-3 rounded-xl border bg-${color}-500/10 border-${color}-500/30 text-${color}-400`}
  >
    {text}
  </div>
);
