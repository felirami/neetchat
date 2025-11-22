/**
 * Utility functions for the app
 */

/**
 * Format wallet address for display
 */
export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Generate avatar initials from address
 */
export function getAvatarInitials(address: string): string {
  if (!address || address.length < 4) return "??";
  return address.slice(2, 4).toUpperCase();
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: Date | number): string {
  const now = Date.now();
  const time = typeof timestamp === "number" ? timestamp : timestamp.getTime();
  const diff = now - time;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

