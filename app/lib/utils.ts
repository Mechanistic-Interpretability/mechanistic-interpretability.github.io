import { type ClassValue, clsx } from "clsx";

/**
 * Combines multiple class values into a single string
 * Uses clsx for conditional classes
 * Note: This simplified version doesn't deduplicate Tailwind classes
 * For full deduplication, install tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}
