// App.jsx
import { useState } from "react";
import Welcome from "./Welcome";
import TapToGrowTree from "./TapToGrowTree";
import ProfilePage from "./ProfilePage";

// wagmi v2 imports
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";
import { useDisconnect } from "wagmi";

// ✅ wagmi v2 config
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(), // default RPC
  },
  connectors: [
    injected({ chains: [mainnet] }),
    metaMask({ chains: [mainnet] }),
  ],
  autoConnect: true,
});

const queryClient = new QueryClient();

export default function App() {
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("game"); // "game" | "profile"

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent
          profile={profile}
          setProfile={setProfile}
          page={page}
          setPage={setPage}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// ✅ Inner component so we can use wagmi hooks
function AppContent({ profile, setProfile, page, setPage }) {
  const { disconnect } = useDisconnect();

  const handleLogout = () => {
    disconnect({ revoke: true });
    setProfile(null);
    setPage("game");
  };

  if (!profile) {
    return (
      <Welcome
        onConnect={(profileObj) => {
          console.log("Profile loaded:", profileObj);
          setProfile(profileObj);
          setPage("game");
        }}
      />
    );
  }

  if (page === "game") {
    return (
      <TapToGrowTree
        profile={profile}
        onLogout={handleLogout}
        goToProfile={() => setPage("profile")}
      />
    );
  }

  return (
    <ProfilePage
      profile={profile}
      goBack={() => setPage("game")}
      onLogout={handleLogout}
    />
  );
}
