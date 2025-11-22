import { WalletConnect } from "@/components/WalletConnect";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">NeetChat</h1>
        <p className="text-lg mb-8">Sovereign Cross-Chain Chat</p>
        <WalletConnect />
      </div>
    </main>
  );
}

