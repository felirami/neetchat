"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="card flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-xs text-gray-500">Connected</p>
            <p className="font-mono text-sm font-semibold text-gray-800">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Prioritize WalletConnect for mobile-first
  const sortedConnectors = [...connectors].sort((a, b) => {
    if (a.name.toLowerCase().includes("walletconnect")) return -1;
    if (b.name.toLowerCase().includes("walletconnect")) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {sortedConnectors.map((connector) => {
        const isWalletConnect = connector.name.toLowerCase().includes("walletconnect");
        return (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className={`btn-primary w-full ${isWalletConnect ? "ring-2 ring-purple-400 ring-offset-2" : ""}`}
          >
            {isWalletConnect ? "📱" : "🔗"} Connect {connector.name}
            {isWalletConnect && <span className="ml-2 text-xs opacity-75">(Mobile)</span>}
          </button>
        );
      })}
    </div>
  );
}

