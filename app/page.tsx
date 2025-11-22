"use client";

import Link from "next/link";
import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">NeetChat</h1>
        <p className="text-lg mb-8">Sovereign Cross-Chain Chat</p>
        <div className="flex flex-col items-center gap-4">
          <WalletConnect />
          <Link
            href="/chat"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Go to Chat
          </Link>
        </div>
      </div>
    </main>
  );
}

