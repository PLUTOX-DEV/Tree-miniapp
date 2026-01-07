// Welcome.jsx
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { motion } from "framer-motion";
import { Wallet, Sparkles, Shield, Zap } from "lucide-react";
import sdk from "@farcaster/frame-sdk";

// ✅ Reliable wallet logos
const walletLogos = {
  MetaMask: "/metamask-icon.png",
  "Coinbase Wallet": "/coinbase.svg", // Using MetaMask icon as fallback for now
  BitKeep: "/bitkeep.png",
  Bitget: "/bitget.png",
  Farcaster: "/Farcaster.png", // Using tree icon for Farcaster
  "Injected": "/metamask-icon.png", // fallback for injected wallets
};


export default function Welcome({ onConnect }) {
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletError, setWalletError] = useState(null);
  const [farcasterUser, setFarcasterUser] = useState(null);
  const [farcasterLoading, setFarcasterLoading] = useState(false);

  const shortAddr = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  // ✅ Allow popular EVM wallets + Farcaster
  const allowedWallets = ["MetaMask", "Coinbase Wallet", "BitKeep", "Bitget", "Farcaster"];

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

        // First try to get existing profile
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${wallet}`);
        let profileObj;

        if (response.ok) {
          profileObj = await response.json();
          // Update with Farcaster username if available and not set
          if (farcasterUser?.username && !profileObj.farcaster_username) {
            const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${wallet}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                farcaster_username: farcasterUser.username
              }),
            });
            if (updateResponse.ok) {
              profileObj = await updateResponse.json();
            }
          }
        } else {
          // Create new profile
          const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${wallet}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              farcaster_username: farcasterUser?.username || null
            }),
          });

          if (!createResponse.ok) {
            console.error("Create profile error:", createResponse.statusText);
            return;
          }

          profileObj = await createResponse.json();
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
      if (connector.name === "Farcaster") {
        setFarcasterLoading(true);
        setWalletError(null);

        // Try to get Farcaster context if not available
        let user = farcasterUser;
        if (!user) {
          try {
            const context = await sdk.context;
            if (context?.user) {
              user = context.user;
              setFarcasterUser(user);
            }
          } catch (err) {
            console.log("Failed to get Farcaster context:", err);
          }
        }

        if (user) {
          console.log("Farcaster user found:", user);
          // Create a virtual wallet address for Farcaster user
          const farcasterWallet = `farcaster-${user.fid}`;
          console.log("Creating Farcaster profile for wallet:", farcasterWallet);

          try {
            // Make API call to create/retrieve Farcaster profile
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/${farcasterWallet}`;
            console.log("Making API call to:", apiUrl);

            const response = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                farcaster_username: user.username
              }),
            });

            console.log("API response status:", response.status);

            if (!response.ok) {
              const errorText = await response.text();
              console.error("API error response:", errorText);
              throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            const profileObj = await response.json();
            console.log("Farcaster profile created/retrieved:", profileObj);

            setFarcasterLoading(false);
            onConnect(profileObj);
          } catch (apiError) {
            console.error("Farcaster profile creation error:", apiError);
            setFarcasterLoading(false);
            setWalletError(`Failed to create Farcaster profile: ${apiError.message}`);
          }
        } else {
          console.log("No Farcaster user found");
          setFarcasterLoading(false);
          setWalletError("Unable to connect to Farcaster. Please make sure you're logged in and try again.");
        }
        return;
      }

      await connect({ connector });
      setWalletError(null);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setWalletError(
        "Failed to connect wallet. Make sure the wallet is installed."
      );
      setFarcasterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden px-4 py-8">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-6 sm:p-8 rounded-3xl shadow-2xl text-center w-full max-w-sm sm:max-w-md relative z-10 mx-4"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Connect Wallet
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm px-2">Choose your preferred Web3 wallet to enter the forest</p>
        </motion.div>

        {isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-left">
                <p className="text-green-400 font-semibold text-sm">Connected</p>
                <p className="text-gray-300 text-xs font-mono">{shortAddr(address)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onConnect({ wallet: address.toLowerCase() })}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Continue
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  disconnect();
                  onConnect(null);
                }}
                className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 rounded-xl transition-all duration-300"
              >
                <Shield className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {/* Wallet Options */}
            <div className="space-y-3">
              {[
                ...connectors.filter((c) => allowedWallets.includes(c.name)),
                ...(farcasterUser ? [{ name: "Farcaster", id: "farcaster", uid: "farcaster" }] : [])
              ].map((c) => (
                  <motion.button
                    key={c.uid || c.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConnect(c)}
                    disabled={isLoading && pendingConnector?.id === c.id && c.name !== "Farcaster" || farcasterLoading && c.name === "Farcaster"}
                    className="w-full flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 border border-slate-600/50 rounded-2xl text-white font-semibold shadow-lg hover:shadow-purple-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group text-sm sm:text-base"
                  >
                    {isLoading && pendingConnector?.id === c.id ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </>
                    ) : farcasterLoading && c.name === "Farcaster" ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting to Farcaster...</span>
                      </>
                    ) : c.name === "Farcaster" ? (
                      <>
                        <img
                          src={walletLogos[c.name]}
                          alt={c.name}
                          className="w-7 h-7 group-hover:scale-110 transition-transform"
                        />
                        <span>Continue with {c.name}</span>
                        <Sparkles className="w-4 h-4 text-purple-400 group-hover:animate-pulse" />
                      </>
                    ) : (
                      <>
                        {walletLogos[c.name] && (
                          <img
                            src={walletLogos[c.name]}
                            alt={c.name}
                            className="w-7 h-7 group-hover:scale-110 transition-transform"
                          />
                        )}
                        <span>Connect {c.name}</span>
                        <Zap className="w-4 h-4 text-yellow-400 group-hover:animate-pulse" />
                      </>
                    )}
                  </motion.button>
                ))}
            </div>

            {/* Info */}
            <div className="text-center pt-4 border-t border-slate-700/50">
              <p className="text-xs text-gray-400 mb-2">Secure Web3 Connection</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  Non-custodial
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {(error || walletError) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p className="text-red-400 text-sm">
              {error?.message || walletError}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
