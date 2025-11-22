"use client";

import { usePythPrice, PYTH_PRICE_IDS } from "@/hooks/usePythPrice";
import { useState } from "react";

export function PriceDisplay() {
  const [selectedToken, setSelectedToken] = useState<keyof typeof PYTH_PRICE_IDS>("ETH");
  const { priceData, isLoading, error } = usePythPrice(
    PYTH_PRICE_IDS[selectedToken],
    selectedToken
  );

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h3 className="font-semibold mb-3">Token Prices (Pyth)</h3>
      
      <div className="mb-3">
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value as keyof typeof PYTH_PRICE_IDS)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {Object.keys(PYTH_PRICE_IDS).map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading price...</div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : priceData ? (
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            ${parseFloat(priceData.price).toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {priceData.symbol} / USD
          </div>
          <div className="text-xs text-gray-400">
            Updated: {new Date(priceData.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ) : null}
    </div>
  );
}

