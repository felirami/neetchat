"use client";

import { useEffect, useState } from "react";
import { Conversation } from "@xmtp/xmtp-js";
import { useXMTP } from "@/hooks/useXMTP";

interface ChatListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation?: Conversation;
}

export function ChatList({ onSelectConversation, selectedConversation }: ChatListProps) {
  const { client } = useXMTP();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="p-6 text-center">
        <div className="text-gray-400 text-sm">Connect wallet to see conversations</div>
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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <h2 className="font-bold text-white text-lg">💬 Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">👋</div>
            <div className="text-gray-500 text-sm">No conversations yet</div>
            <div className="text-gray-400 text-xs mt-1">Start a new chat to begin</div>
          </div>
        ) : (
          conversations.map((conversation) => (
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
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {conversation.peerAddress.slice(0, 6)}...
                    {conversation.peerAddress.slice(-4)}
                  </div>
                  <div className="text-xs text-gray-500">Click to chat</div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

