import { type ClassValue, clsx } from "clsx";

/**
 * Utility for merging class names.
 * Uses clsx for conditional class joining.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
