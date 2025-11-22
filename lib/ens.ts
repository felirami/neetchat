import { ethers } from "ethers";

/**
 * Resolve ENS name to Ethereum address
 */
export async function resolveENS(name: string): Promise<string | null> {
  try {
    if (!name) return null;
    
    // If it's already an address, return it
    if (ethers.isAddress(name)) {
      return name;
    }

    // Check if it's an ENS name (ends with .eth)
    if (!name.endsWith(".eth")) {
      return null;
    }

    // Use public RPC endpoint (you can use your own provider)
    const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
    const address = await provider.resolveName(name);
    
    return address;
  } catch (error) {
    console.error("Error resolving ENS:", error);
    return null;
  }
}

/**
 * Resolve Ethereum address to ENS name
 */
export async function lookupAddress(address: string): Promise<string | null> {
  try {
    if (!address || !ethers.isAddress(address)) {
      return null;
    }

    // Use public RPC endpoint
    const provider = new ethers.JsonRpcProvider("https://eth.llamarpc.com");
    const name = await provider.lookupAddress(address);
    
    return name;
  } catch (error) {
    console.error("Error looking up ENS:", error);
    return null;
  }
}

/**
 * Format address or ENS name for display
 */
export function formatAddressOrENS(address: string, ensName?: string | null): string {
  if (ensName) {
    return ensName;
  }
  if (!address) return "";
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

