"use client";

import { useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

export function useXMTP() {
  const { address } = useAccount();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setClient(null);
      return;
    }

    async function initXMTP() {
      setIsLoading(true);
      setError(null);
      try {
        if (typeof window === "undefined" || !window.ethereum) {
          throw new Error("No wallet provider found");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const xmtpClient = await Client.create(signer, { env: "production" });
        setClient(xmtpClient);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize XMTP");
        console.error("XMTP initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initXMTP();
  }, [address]);

  return { client, isLoading, error };
}

