"use client";

import { useEffect, useState, useRef } from "react";
import { Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import { useAccount } from "wagmi";

interface MessageViewProps {
  conversation: Conversation | null;
}

export function MessageView({ conversation }: MessageViewProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      setIsLoading(true);
      try {
        const msgs = await conversation.messages();
        setMessages(msgs);
      } catch (err) {
        console.error("Error loading messages:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();

    const stream = conversation.streamMessages();
    stream.then(async (stream) => {
      for await (const message of stream) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      stream.then((s) => s.return?.());
    };
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!conversation || !newMessage.trim()) return;

    try {
      await conversation.send(newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold">
          {conversation.peerAddress.slice(0, 6)}...
          {conversation.peerAddress.slice(-4)}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-gray-500">Loading messages...</div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderAddress.toLowerCase() === address?.toLowerCase();
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isMe
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.sent).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

