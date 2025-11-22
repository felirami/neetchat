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
        className="fixed bottom-4 right-4 px-6 py-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 z-50"
      >
        ⚡ NeetChat Actions
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold">NeetChat Actions</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="p-4 space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              onAction(action.id);
              setIsOpen(false);
            }}
            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{action.label}</div>
            <div className="text-sm text-gray-500">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

