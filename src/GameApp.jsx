// GameApp.jsx
import React, { useState } from "react";
import TapToGrowTree from "./TapToGrowTree";
import ProfilePage from "./ProfilePage";
import { TreePine, User } from "lucide-react";

export default function GameApp({ profile, onLogout }) {
  const [tab, setTab] = useState("game");

  return (
    <div className="relative min-h-screen">
      {tab === "game" ? (
        <TapToGrowTree profile={profile} onLogout={onLogout} />
      ) : (
        <ProfilePage profile={profile} />
      )}

      {/* bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-2">
        <button
          onClick={() => setTab("game")}
          className={`flex flex-col items-center text-sm ${
            tab === "game" ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <TreePine className="w-5 h-5" />
          Game
        </button>
        <button
          onClick={() => setTab("profile")}
          className={`flex flex-col items-center text-sm ${
            tab === "profile" ? "text-emerald-600 font-bold" : "text-slate-500"
          }`}
        >
          <User className="w-5 h-5" />
          Profile
        </button>
      </div>
    </div>
  );
}
