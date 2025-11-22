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
      <div className="p-4 text-gray-500">Connect wallet to see conversations</div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading conversations...</div>;
  }

  return (
    <div className="border-r border-gray-200 w-64 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm">No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.topic}
              onClick={() => onSelectConversation(conversation)}
              className={`w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 ${
                selectedConversation?.topic === conversation.topic
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
            >
              <div className="text-sm font-medium">
                {conversation.peerAddress.slice(0, 6)}...
                {conversation.peerAddress.slice(-4)}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

