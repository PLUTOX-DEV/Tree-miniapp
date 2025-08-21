// Welcome.jsx
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useAccount, useConnect, useDisconnect } from "wagmi";

// ✅ Reliable wallet logos
// ✅ Wallet logos (served from /public/logos)
const walletLogos = {
  MetaMask: "/metamask-icon.png",
  Bitkeep: "/bitkeep.png",
  Bitget: "/bitget.png",
};


export default function Welcome({ onConnect }) {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletError, setWalletError] = useState(null);

  const shortAddr = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  // ✅ Only allow MetaMask & Bitget
  const allowedWallets = ["MetaMask", "Bitget"];

  // ✅ Auto-connect MetaMask if Bitget is not installed
  useEffect(() => {
    const hasBitget =
      typeof window !== "undefined" && window.bitkeep; // Bitget injects window.bitkeep
    const hasMetamask =
      typeof window !== "undefined" && window.ethereum?.isMetaMask;

    if (!isConnected && !hasBitget && hasMetamask) {
      const metamaskConnector = connectors.find((c) => c.name === "MetaMask");
      if (metamaskConnector) {
        connect({ connector: metamaskConnector }).catch((err) =>
          console.error("Auto-connect MetaMask failed:", err)
        );
      }
    }
  }, [connectors, connect, isConnected]);

  // ✅ Fetch or create profile
  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchOrCreateProfile = async () => {
      try {
        const wallet = address.toLowerCase();

        let { data: existing, error: fetchErr } = await supabase
          .from("profiles")
          .select("*")
          .eq("wallet", wallet)
          .single();

        if (fetchErr && fetchErr.code !== "PGRST116") {
          console.error("Fetch profile error:", fetchErr.message);
          return;
        }

        let profileObj;
        if (existing) {
          profileObj = existing;
        } else {
          const { data, error: insertErr } = await supabase
            .from("profiles")
            .insert({
              wallet,
              points: 0,
              xp: 0,
              tap_power: 1,
              auto_level: 0,
              last_daily: null,
              total_taps: 0,
              soft_resets: 0,
            })
            .select()
            .single();

          if (insertErr) {
            console.error("Insert error:", insertErr.message);
            return;
          }

          profileObj = data;
        }

        onConnect(profileObj);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchOrCreateProfile();
  }, [isConnected, address, onConnect]);

  // ✅ Handle manual wallet connect
  const handleConnect = async (connector) => {
    try {
      await connect({ connector });
      setWalletError(null);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setWalletError(
        "Failed to connect wallet. Make sure MetaMask or Bitget is installed."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">
          Welcome to Tap-to-Grow Tree 🌳
        </h1>
        <p className="mb-6">Connect your wallet to continue playing.</p>

        {isConnected ? (
          <>
            <p className="mb-2 text-green-600 font-semibold">
              Connected: {shortAddr(address)}
            </p>
            <button
              onClick={() => {
                disconnect({ revoke: true });
                onConnect(null);
              }}
              className="px-6 py-2 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600"
            >
              Disconnect
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {connectors
              .filter((c) => allowedWallets.includes(c.name))
              .map((c) => (
                <button
                  key={c.uid || c.id}
                  onClick={() => handleConnect(c)}
                  disabled={isLoading && pendingConnector?.id === c.id}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold shadow-lg hover:bg-violet-700 disabled:opacity-50"
                >
                  {isLoading && pendingConnector?.id === c.id ? (
                    "Connecting..."
                  ) : (
                    <>
                    {walletLogos[c.name] && (
  <img
    src={walletLogos[c.name]}
    alt={c.name}
    className="w-6 h-6"
  />
)}

                      {`Connect with ${c.name}`}
                    </>
                  )}
                </button>
              ))}
          </div>
        )}

        {(error || walletError) && (
          <p className="text-red-500 mt-2">
            {error?.message || walletError}
          </p>
        )}
      </div>
    </div>
  );
}
