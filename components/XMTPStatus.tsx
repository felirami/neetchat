"use client";

import { useXMTP } from "@/hooks/useXMTP";
import { useAccount, useWalletClient } from "wagmi";

export function XMTPStatus() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { client, isLoading, error, initializeXMTP } = useXMTP();

  if (!address) return null;

  if (client) {
    return (
      <div className="text-sm text-green-600 flex items-center gap-2">
        <span>✓</span>
        <span>XMTP Enabled</span>
      </div>
    );
  }

  if (!walletClient) {
    return (
      <div className="text-sm text-yellow-600">
        Waiting for wallet connection...
      </div>
    );
  }

  if (error && !error.includes("rejected") && !error.includes("cancelled")) {
    return (
      <button
        onClick={initializeXMTP}
        className="text-sm px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Enable XMTP (Error: {error})
      </button>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span className="animate-spin">⏳</span>
        <span>Initializing XMTP...</span>
      </div>
    );
  }

  return (
    <button
      onClick={initializeXMTP}
      className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!walletClient}
    >
      Enable XMTP
    </button>
  );
}

