import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'م';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'ك';
  }
  return num.toString();
}
