"use client";

import { useState } from "react";
import { Conversation } from "@xmtp/xmtp-js";
import { ChatList } from "@/components/ChatList";
import { MessageView } from "@/components/MessageView";
import { MiniAppPanel } from "@/components/MiniAppPanel";
import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/WalletConnect";

export default function ChatPage() {
  const { isConnected } = useAccount();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setCurrentAction(action);
    // TODO: Implement action handlers
    console.log("Action triggered:", action);
  };

  if (!isConnected) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">NeetChat</h1>
          <p className="text-lg mb-8">Connect your wallet to start chatting</p>
          <WalletConnect />
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen relative">
      <ChatList
        onSelectConversation={setSelectedConversation}
        selectedConversation={selectedConversation || undefined}
      />
      <MessageView conversation={selectedConversation} />
      <MiniAppPanel onAction={handleAction} />
    </main>
  );
}

