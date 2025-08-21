import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "./supabaseClient";

export default function WalletAuth({ onLogin }) {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);

    // Optional: link wallet to Supabase profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert([{ user_id: user.id, wallet_address: address }]);
    }

    if (onLogin) onLogin(address);
  };

  return (
    <div className="p-4">
      {wallet ? (
        <div>Connected wallet: {wallet}</div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 rounded bg-emerald-600 text-white"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
