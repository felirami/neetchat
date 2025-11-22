"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { walletConnect, injected, metaMask } from "wagmi/connectors";
import { useState } from "react";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const config = createConfig({
  chains: [base],
  connectors: [
    // WalletConnect first for mobile-first approach
    ...(projectId
      ? [
          walletConnect({
            projectId,
            metadata: {
              name: "NeetChat",
              description: "Sovereign Cross-Chain Chat",
              url: typeof window !== "undefined" ? window.location.origin : "https://neetchat.xyz",
              icons: [],
            },
            showQrModal: true,
          }),
        ]
      : []),
    injected(),
    metaMask(),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

