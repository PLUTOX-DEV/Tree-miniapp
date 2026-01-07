// ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { Crown, RefreshCcw, Award, ArrowLeft, LogOut, User, Trophy, TrendingUp, Users, Star } from "lucide-react";

const format = (n) => n.toLocaleString();

export default function ProfilePage({ profile, goBack, onLogout }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading profile...</p>
      </div>
    </div>
  );

  const { wallet, points, xp, tap_power, auto_level, total_taps, soft_resets, farcaster_username } = profile;

  const shortAddr = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
    : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <button
          onClick={goBack}
          className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-xl flex items-center gap-2 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          <span>Back to Game</span>
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-red-500/25 transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Player Profile
              </h1>
              {farcaster_username && (
                <p className="text-purple-400 font-semibold">@{farcaster_username}</p>
              )}
              <p className="text-gray-400 font-mono text-sm">{shortAddr}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400 uppercase">Points</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{format(points)}</p>
            </div>
            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400 uppercase">XP</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">{format(xp)}</p>
            </div>
            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400 uppercase">Tap Power</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">x{tap_power}</p>
            </div>
            <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCcw className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400 uppercase">Auto Level</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{auto_level}/s</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Achievements
            </h3>
            <div className="space-y-3">
              {total_taps >= 100 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400">💪 Tap Rookie (100 taps)</span>
                </div>
              )}
              {total_taps >= 1000 && (
                <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-orange-400">🔥 Tap Master (1000 taps)</span>
                </div>
              )}
              {soft_resets >= 1 && (
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-blue-400">🔄 First Prestige</span>
                </div>
              )}
              {soft_resets >= 5 && (
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-purple-400">👑 Prestige Veteran</span>
                </div>
              )}
              {total_taps < 100 && (
                <div className="text-center text-gray-400 py-4">
                  Keep tapping to unlock achievements! 🌱
                </div>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-green-400" />
              Game Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                <span className="text-gray-400">Total Taps</span>
                <span className="font-bold text-white">{format(total_taps)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                <span className="text-gray-400">Prestige Resets</span>
                <span className="font-bold text-purple-400">{soft_resets}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl">
                <span className="text-gray-400">Account Age</span>
                <span className="font-bold text-blue-400">New Player</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-400" />
            Global Leaderboard
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div
                  key={player._id || index}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                    player.wallet === wallet
                      ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/50'
                      : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-slate-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {player.farcaster_username ? `@${player.farcaster_username}` : `${player.wallet.slice(0, 6)}...${player.wallet.slice(-4)}`}
                      </p>
                      <p className="text-sm text-gray-400">{format(player.xp)} XP</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">{format(player.points)}</p>
                    <p className="text-xs text-gray-400">points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Be the first to claim the throne!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
