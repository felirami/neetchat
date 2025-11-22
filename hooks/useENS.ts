"use client";

import { useEffect, useState } from "react";
import { resolveENS, lookupAddress } from "@/lib/ens";

export function useENS(addressOrName: string | null) {
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!addressOrName) {
      setResolvedAddress(null);
      setEnsName(null);
      return;
    }

    async function resolve() {
      setIsLoading(true);
      setError(null);

      try {
        // Check if it's an address or ENS name
        const isAddress = /^0x[a-fA-F0-9]{40}$/.test(addressOrName);
        
        if (isAddress) {
          // It's an address, look up ENS name
          setResolvedAddress(addressOrName);
          const name = await lookupAddress(addressOrName);
          setEnsName(name);
        } else {
          // It's likely an ENS name, resolve to address
          const address = await resolveENS(addressOrName);
          if (address) {
            setResolvedAddress(address);
            setEnsName(addressOrName);
          } else {
            setError("Could not resolve ENS name");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to resolve ENS");
        console.error("ENS resolution error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    resolve();
  }, [addressOrName]);

  return { resolvedAddress, ensName, isLoading, error };
}

