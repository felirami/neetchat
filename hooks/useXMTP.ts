"use client";

import { useEffect, useState, useRef } from "react";
import { Client } from "@xmtp/xmtp-js";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

// Cache clients by address to prevent re-initialization
const clientCache = new Map<string, Client>();

export function useXMTP() {
  const { address } = useAccount();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializingRef = useRef(false);
  const lastAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (!address) {
      setClient(null);
      lastAddressRef.current = null;
      return;
    }

    // Prevent re-initialization if already initializing or if client exists for this address
    if (initializingRef.current || lastAddressRef.current === address) {
      return;
    }

    // Check cache first
    const cachedClient = clientCache.get(address);
    if (cachedClient) {
      setClient(cachedClient);
      lastAddressRef.current = address;
      return;
    }

    // Don't auto-initialize - let user enable XMTP manually
    // This prevents repeated signature requests
    setError(null);
    setIsLoading(false);
  }, [address]);

  const initializeXMTP = async () => {
    if (!address || initializingRef.current) return;
    
    initializingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet provider found");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Try to create client (this will prompt for signature if not enabled)
      let xmtpClient: Client;
      try {
        xmtpClient = await Client.create(signer, { env: "production" });
      } catch (createErr: any) {
        // Handle user rejection gracefully
        if (createErr?.message?.includes("rejected") || createErr?.code === 4001) {
          setError(null);
          return;
        }
        throw createErr;
      }

      // Cache the client
      clientCache.set(address, xmtpClient);
      setClient(xmtpClient);
      lastAddressRef.current = address;
    } catch (err: any) {
      // Don't show error for user rejection
      if (err?.message?.includes("rejected") || err?.code === 4001) {
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : "Failed to initialize XMTP");
        console.error("XMTP initialization error:", err);
      }
    } finally {
      setIsLoading(false);
      initializingRef.current = false;
    }
  };

  const startConversation = async (address: string) => {
    if (!client || !address) return null;
    
    try {
      const conversation = await client.conversations.newConversation(address);
      return conversation;
    } catch (error) {
      console.error("Error starting conversation:", error);
      throw error;
    }
  };

  return { client, isLoading, error, initializeXMTP, startConversation };
}

