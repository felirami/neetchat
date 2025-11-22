"use client";

import { useXMTP } from "@/hooks/useXMTP";
import { useAccount } from "wagmi";

export function XMTPStatus() {
  const { address } = useAccount();
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

  if (error && !error.includes("rejected") && !error.includes("cancelled")) {
    return (
      <div className="text-sm text-yellow-600">
        XMTP not enabled. Click to enable.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">
        Initializing...
      </div>
    );
  }

  return (
    <button
      onClick={initializeXMTP}
      className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Enable XMTP
    </button>
  );
}

