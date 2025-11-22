"use client";

import { useSelfProtocol } from "@/hooks/useSelfProtocol";
import { useAccount } from "wagmi";

export function SelfVerification() {
  const { address } = useAccount();
  const { proof, isVerifying, error, verifyIdentity } = useSelfProtocol();

  if (!address) {
    return (
      <div className="card bg-gray-50">
        <p className="text-sm text-gray-500 text-center">Connect wallet to verify identity</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
        <span>🔐</span>
        <span>Self Protocol</span>
      </h3>
      
      {proof?.verified ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <span className="text-xl">✓</span>
            <span className="font-semibold">Identity Verified</span>
          </div>
          <div className="text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-700">
              Proof Type: <span className="text-purple-600">{proof.publicInputs[1]}</span>
            </p>
            <p className="text-xs font-mono text-gray-500 break-all">
              {proof.proof.slice(0, 20)}...
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Verify your identity using Self Protocol ZK proofs
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => verifyIdentity("adult")}
              disabled={isVerifying}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none font-medium"
            >
              {isVerifying ? "⏳ Verifying..." : "🔞 Verify Adult (18+)"}
            </button>
            <button
              onClick={() => verifyIdentity("unique")}
              disabled={isVerifying}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none font-medium"
            >
              {isVerifying ? "⏳ Verifying..." : "👤 Verify Unique Human"}
            </button>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

