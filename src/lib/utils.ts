import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function shortenTxHash(hash: string, chars = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(" ") : "0m";
}

export function basisPointsToPercent(bp: number): string {
  return `${(bp / 100).toFixed(2)}%`;
}

export function formatPoolFeeTier(tier: number): string {
  const tiers: Record<number, string> = {
    100: "0.01% (Stablecoins)",
    500: "0.05% (Correlated)",
    3000: "0.30% (Standard)",
    10000: "1.00% (Exotic)",
  };
  return tiers[tier] || `${(tier / 10000).toFixed(2)}%`;
}
