"use client";

import { useState } from "react";

interface MiniAppPanelProps {
  onAction: (action: string, data?: any) => void;
}

export function MiniAppPanel({ onAction }: MiniAppPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: "tip", label: "💸 Tip", description: "Send a tip to a friend" },
    { id: "swap", label: "🔄 Swap", description: "Swap tokens" },
    { id: "price", label: "💰 Price", description: "Check token prices" },
    { id: "roll", label: "🎲 Roll Dice", description: "Randomness game" },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 z-50 transform hover:scale-110 transition-all duration-200 flex items-center gap-2 font-semibold"
      >
        <span className="text-xl">⚡</span>
        <span>Actions</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl flex justify-between items-center">
        <h3 className="font-bold text-white">⚡ NeetChat Actions</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
        >
          ✕
        </button>
      </div>
      <div className="p-4 space-y-2 bg-gray-50 rounded-b-2xl">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              onAction(action.id);
              setIsOpen(false);
            }}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="font-semibold text-gray-800 text-lg">{action.label}</div>
            <div className="text-sm text-gray-500 mt-1">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

