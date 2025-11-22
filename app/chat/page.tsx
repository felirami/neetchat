"use client";

import { useState } from "react";
import { Conversation } from "@xmtp/xmtp-js";
import { ChatList } from "@/components/ChatList";
import { MessageView } from "@/components/MessageView";
import { MiniAppPanel } from "@/components/MiniAppPanel";
import { ActionModal } from "@/components/ActionModal";
import { PriceDisplay } from "@/components/PriceDisplay";
import { TipAction } from "@/components/TipAction";
import { SelfVerification } from "@/components/SelfVerification";
import { useAccount } from "wagmi";
import { WalletConnect } from "@/components/WalletConnect";

export default function ChatPage() {
  const { isConnected } = useAccount();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleAction = (action: string) => {
    setCurrentAction(action);
    // TODO: Implement action handlers
    console.log("Action triggered:", action);
  };

  if (!isConnected) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 md:p-24">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NeetChat
          </h1>
          <p className="text-xl text-gray-700">Connect your wallet to start chatting</p>
          <WalletConnect />
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100vh-4rem)] relative bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-20 left-4 z-30 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {showSidebar ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-20 flex flex-col w-64 bg-white border-r border-gray-200 shadow-lg md:shadow-sm transition-transform duration-300`}
      >
        <ChatList
          onSelectConversation={(conv) => {
            setSelectedConversation(conv);
            setShowSidebar(false);
          }}
          selectedConversation={selectedConversation || undefined}
        />
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <SelfVerification />
        </div>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <MessageView conversation={selectedConversation} />
      <MiniAppPanel onAction={handleAction} />
      
      {currentAction === "price" && (
        <ActionModal
          isOpen={true}
          onClose={() => setCurrentAction(null)}
          title="Token Prices"
        >
          <PriceDisplay />
        </ActionModal>
      )}
      
      {currentAction === "tip" && (
        <TipAction
          recipientAddress={selectedConversation?.peerAddress || ""}
          onClose={() => setCurrentAction(null)}
        />
      )}
    </main>
  );
}

