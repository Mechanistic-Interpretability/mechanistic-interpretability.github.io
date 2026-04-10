/**
 * Shared venue color utility
 *
 * Replaces duplicate getVenueColor implementations in:
 * - PaperCard.tsx
 * - FeaturedPapers.tsx
 *
 * Provides consistent venue badge styling across the application.
 */

export interface VenueColorConfig {
	/** Light mode classes */
	light: string;
	/** Dark mode classes */
	dark: string;
}

export const VENUE_COLORS: Record<string, VenueColorConfig> = {
	NeurIPS: {
		light: "bg-amber-500/20 text-amber-700 border-amber-500/30",
		dark: "dark:bg-amber-500/20 dark:text-amber-300",
	},
	ICML: {
		light: "bg-blue-500/20 text-blue-700 border-blue-500/30",
		dark: "dark:bg-blue-500/20 dark:text-blue-300",
	},
	ICLR: {
		light: "bg-purple-500/20 text-purple-700 border-purple-500/30",
		dark: "dark:bg-purple-500/20 dark:text-purple-300",
	},
	Nature: {
		light: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
		dark: "dark:bg-emerald-500/20 dark:text-emerald-300",
	},
	Science: {
		light: "bg-red-500/20 text-red-700 border-red-500/30",
		dark: "dark:bg-red-500/20 dark:text-red-300",
	},
	arXiv: {
		light: "bg-slate-500/20 text-slate-700 border-slate-500/30",
		dark: "dark:bg-slate-500/20 dark:text-slate-300",
	},
};

export const DEFAULT_VENUE_COLOR: VenueColorConfig = {
	light: "bg-violet-500/20 text-violet-700 border-violet-500/30",
	dark: "dark:bg-violet-500/20 dark:text-violet-300",
};

/**
 * Get venue badge color classes
 * @param venue - The venue name (e.g., "NeurIPS", "ICML")
 * @returns Combined light and dark mode Tailwind classes
 */
export function getVenueColor(venue: string): string {
	const config = VENUE_COLORS[venue] || DEFAULT_VENUE_COLOR;
	return `${config.light} ${config.dark}`;
}

/**
 * Get all available venues
 */
export function getAvailableVenues(): string[] {
	return Object.keys(VENUE_COLORS);
}

/**
 * Check if a venue has a predefined color
 */
export function hasVenueColor(venue: string): boolean {
	return venue in VENUE_COLORS;
}
