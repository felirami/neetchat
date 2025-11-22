import { Client } from "@xmtp/xmtp-js";
import { Signer } from "ethers";

/**
 * Create or get XMTP client
 */
export async function createXmtp(signer: Signer) {
  const xmtp = await Client.create(signer, {
    env: "production",
  });
  return xmtp;
}

/**
 * Check if address can message
 */
export async function canMessage(address: string): Promise<boolean> {
  try {
    return await Client.canMessage(address);
  } catch (error) {
    console.error("Error checking if can message:", error);
    return false;
  }
}

