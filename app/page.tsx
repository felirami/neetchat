"use client";

import Link from "next/link";
import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 md:p-24">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            NeetChat
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Sovereign Cross-Chain Chat
          </p>
          <p className="text-gray-600 max-w-lg mx-auto">
            Chat, verify identity, and execute DeFi actions seamlessly with XMTP, Self Protocol, and Pyth Network.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="card text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold text-gray-800">XMTP Chat</h3>
            <p className="text-sm text-gray-600 mt-1">Decentralized messaging</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🔐</div>
            <h3 className="font-semibold text-gray-800">Self Protocol</h3>
            <p className="text-sm text-gray-600 mt-1">ZK identity verification</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-800">DeFi Actions</h3>
            <p className="text-sm text-gray-600 mt-1">Tips, swaps & more</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <WalletConnect />
          <Link
            href="/chat"
            className="btn-primary inline-block"
          >
            Go to Chat →
          </Link>
        </div>
      </div>
    </main>
  );
}

