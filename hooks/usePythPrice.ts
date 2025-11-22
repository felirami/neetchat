"use client";

import { useState, useEffect } from "react";

export interface PriceData {
  price: string;
  priceId: string;
  symbol: string;
  timestamp: number;
}

export function usePythPrice(priceId: string, symbol: string) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!priceId) return;

    const fetchPrice = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Pyth Hermes API endpoint for pull oracle
        // Using Hermes to fetch price data
        const response = await fetch(
          `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${priceId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch price from Pyth");
        }

        const data = await response.json();

        // Parse Pyth price data
        if (data.parsed && data.parsed.length > 0) {
          const priceInfo = data.parsed[0];
          const price = priceInfo.price?.price || "0";
          
          setPriceData({
            price,
            priceId,
            symbol,
            timestamp: Date.now(),
          });
        } else {
          throw new Error("No price data available");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch price");
        console.error("Pyth price fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    
    return () => clearInterval(interval);
  }, [priceId, symbol]);

  return { priceData, isLoading, error };
}

// Common price IDs for popular tokens
export const PYTH_PRICE_IDS = {
  ETH: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  BTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  USDC: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
  USDT: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53",
} as const;

