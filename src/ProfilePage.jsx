// ProfilePage.jsx
import React from "react";
import { Crown, RefreshCcw, Award, ArrowLeft, LogOut } from "lucide-react";

const format = (n) => n.toLocaleString();

export default function ProfilePage({ profile, goBack, onLogout }) {
  if (!profile) return <div className="p-6">Loading profile...</div>;

  const { wallet, points, xp, tap_power, auto_level, total_taps, soft_resets } =
    profile;

  const shortAddr = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 p-6 text-slate-800">
      {/* Top bar with Back + Logout */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goBack}
          className="px-3 py-1 bg-gray-200 rounded-xl flex items-center gap-1 hover:bg-gray-300"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-xl flex items-center gap-1 hover:bg-red-600"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">👤 Player Profile</h2>

        <div className="mb-6">
          <p className="text-sm text-slate-500">Wallet</p>
          <p className="font-mono">{shortAddr}</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-xl shadow-inner">
            <p className="text-xs text-slate-500">Points</p>
            <p className="font-bold text-lg">{format(points)}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl shadow-inner">
            <p className="text-xs text-slate-500">XP</p>
            <p className="font-bold text-lg">{format(xp)}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl shadow-inner">
            <p className="text-xs text-slate-500">Tap Power</p>
            <p className="font-bold text-lg">x{tap_power}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl shadow-inner">
            <p className="text-xs text-slate-500">Auto Level</p>
            <p className="font-bold text-lg">{auto_level}/s</p>
          </div>
        </div>

        {/* achievements */}
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Achievements
        </h3>
        <ul className="list-disc pl-5 mb-6 text-sm">
          {total_taps >= 100 && <li>💪 Tap Rookie (100 taps)</li>}
          {total_taps >= 1000 && <li>🔥 Tap Master (1000 taps)</li>}
          {soft_resets >= 1 && <li>🔄 First Prestige</li>}
          {soft_resets >= 5 && <li>👑 Prestige Veteran</li>}
          {total_taps < 100 && <li>Keep tapping to unlock more!</li>}
        </ul>

        {/* reset history */}
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <RefreshCcw className="w-4 h-4 text-blue-500" /> Reset History
        </h3>
        <p className="text-sm text-slate-600">
          Prestiges: <span className="font-bold">{soft_resets}</span>
        </p>

        {/* leaderboard placeholder */}
        <div className="mt-6 bg-emerald-50 p-4 rounded-xl">
          <h3 className="flex items-center gap-2 font-semibold mb-1">
            <Crown className="w-4 h-4 text-yellow-500" /> Leaderboard
          </h3>
          <p className="text-sm text-slate-500">
            Coming soon: compare your growth with other players!
          </p>
        </div>
      </div>
    </div>
  );
}
