"use client";

import { useEffect, useState } from "react";
import { Conversation } from "@xmtp/xmtp-js";
import { useXMTP } from "@/hooks/useXMTP";
import { XMTPStatus } from "./XMTPStatus";
import { ENSInput } from "./ENSInput";
import { useENS } from "@/hooks/useENS";
import { formatAddressOrENS } from "@/lib/ens";

interface ChatListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation?: Conversation;
}

export function ChatList({ onSelectConversation, selectedConversation }: ChatListProps) {
  const { client, startConversation } = useXMTP();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    if (!client) return;

    async function loadConversations() {
      setIsLoading(true);
      try {
        const convos = await client.conversations.list();
        setConversations(convos);
      } catch (err) {
        console.error("Error loading conversations:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, [client]);

  if (!client) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="text-gray-400 text-sm">XMTP not initialized</div>
        <XMTPStatus />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <div className="text-gray-500 text-sm mt-2">Loading conversations...</div>
      </div>
    );
  }

  const handleStartConversation = async (address: string) => {
    if (!startConversation) return;
    
    try {
      const conversation = await startConversation(address);
      if (conversation) {
        setConversations((prev) => [conversation, ...prev]);
        onSelectConversation(conversation);
        setShowNewChat(false);
      }
    } catch (error: any) {
      console.error("Failed to start conversation:", error);
      alert(error.message || "Failed to start conversation. Make sure the address has XMTP enabled.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">💬 Conversations</h2>
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="text-white hover:text-gray-200 text-xl"
            title="New chat"
          >
            +
          </button>
        </div>
      </div>
      
      {showNewChat && client && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <ENSInput
            onAddressResolved={handleStartConversation}
            placeholder="Enter ENS name (e.g., vitalik.eth) or address..."
          />
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">👋</div>
            <div className="text-gray-500 text-sm">No conversations yet</div>
            <div className="text-gray-400 text-xs mt-1">Start a new chat to begin</div>
          </div>
        ) : (
          conversations.map((conversation) => {
            const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
              const { ensName } = useENS(conversation.peerAddress);
              return (
                <button
                  key={conversation.topic}
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                    selectedConversation?.topic === conversation.topic
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {conversation.peerAddress.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {formatAddressOrENS(conversation.peerAddress, ensName)}
                      </div>
                      <div className="text-xs text-gray-500">Click to chat</div>
                    </div>
                  </div>
                </button>
              );
            };
            return <ConversationItem key={conversation.topic} conversation={conversation} />;
          })
        )}
      </div>
    </div>
  );
}

