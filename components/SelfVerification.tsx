"use client";

import { useSelfProtocol } from "@/hooks/useSelfProtocol";
import { useAccount } from "wagmi";

export function SelfVerification() {
  const { address } = useAccount();
  const { proof, isVerifying, error, verifyIdentity } = useSelfProtocol();

  if (!address) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500">Connect wallet to verify identity</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="font-semibold mb-3">Self Protocol Verification</h3>
      
      {proof?.verified ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <span>✓</span>
            <span className="font-medium">Identity Verified</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Proof Type: {proof.publicInputs[1]}</p>
            <p className="text-xs mt-1 font-mono break-all">
              Proof: {proof.proof.slice(0, 20)}...
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Adult (18+)"}
            </button>
            <button
              onClick={() => verifyIdentity("unique")}
              disabled={isVerifying}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Unique Human"}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

