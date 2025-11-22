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
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white">
        <div className="text-center space-y-4">
          <div className="text-6xl">💬</div>
          <div className="text-xl font-semibold text-gray-700">Select a conversation</div>
          <div className="text-sm text-gray-500">Choose a chat from the sidebar to start messaging</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-semibold text-sm">
            {conversation.peerAddress.slice(2, 4).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-white">
              {conversation.peerAddress.slice(0, 6)}...
              {conversation.peerAddress.slice(-4)}
            </h2>
            <div className="text-xs text-blue-100">Active now</div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <div className="text-gray-500 mt-2">Loading messages...</div>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderAddress.toLowerCase() === address?.toLowerCase();
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    {message.senderAddress.slice(2, 4).toUpperCase()}
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    isMe
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                    {new Date(message.sent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {isMe && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    {address?.slice(2, 4).toUpperCase()}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="input-field flex-1"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

