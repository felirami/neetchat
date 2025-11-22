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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">💰</span>
        <h3 className="font-bold text-lg text-gray-800">Pyth Network Prices</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Token</label>
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value as keyof typeof PYTH_PRICE_IDS)}
          className="input-field"
        >
          {Object.keys(PYTH_PRICE_IDS).map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <div className="text-gray-500 mt-2">Loading price...</div>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-red-600 text-sm font-medium">{error}</div>
        </div>
      ) : priceData ? (
        <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${parseFloat(priceData.price).toFixed(2)}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {priceData.symbol} / USD
            </div>
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <span>🔄</span>
              <span>Updated: {new Date(priceData.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

