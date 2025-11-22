"use client";

import { useState } from "react";
import { useENS } from "@/hooks/useENS";
import { formatAddressOrENS } from "@/lib/ens";

interface ENSInputProps {
  onAddressResolved: (address: string) => void;
  placeholder?: string;
}

export function ENSInput({ onAddressResolved, placeholder = "Enter ENS name or address..." }: ENSInputProps) {
  const [input, setInput] = useState("");
  const { resolvedAddress, ensName, isLoading, error } = useENS(input);

  const handleSubmit = () => {
    if (resolvedAddress) {
      onAddressResolved(resolvedAddress);
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={placeholder}
          className="input-field flex-1"
        />
        <button
          onClick={handleSubmit}
          disabled={!resolvedAddress || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "..." : "Go"}
        </button>
      </div>
      
      {isLoading && (
        <div className="text-sm text-gray-500">Resolving ENS...</div>
      )}
      
      {resolvedAddress && (
        <div className="text-sm text-green-600">
          ✓ {formatAddressOrENS(resolvedAddress, ensName)}
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}

