import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { sepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "demo";

if (!projectId || projectId === "demo") {
  console.warn("WalletConnect projectId not set. Get one at https://cloud.reown.com");
}

// Define networks — Sepolia only for now (contracts deployed there)
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  sepolia,
];

// Create wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
