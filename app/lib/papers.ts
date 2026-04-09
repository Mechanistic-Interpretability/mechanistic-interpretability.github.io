import { allPapers, allResources } from "./.content-collections/generated";
import type { Paper, Resource } from "./.content-collections/generated";

// Re-export types
export type { Paper, Resource };

// Export sorted papers (by year, descending)
export const papers = allPapers.sort(
	(a: Paper, b: Paper) => (b.year || 0) - (a.year || 0),
);

// Resources are loaded from content-collections
// Filter by category: researchers are categorized by org, resources by "Resources"
export const people = allResources.filter(
	(r: Resource) => r.category !== "Resources",
);

export const resources = allResources.filter(
	(r: Resource) => r.category === "Resources",
);

// Get featured papers (with featured: true), sorted by date, limited to 2
export const featuredPapers = allPapers
	.filter((p: Paper) => p.featured !== false) // Default to featured unless explicitly false
	.sort((a: Paper, b: Paper) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateB - dateA; // Most recent first
	})
	.slice(0, 2);

// Get featured resources (with featured: true), sorted by date, limited to 2
export const featuredResources = resources
	.filter((r: Resource) => r.featured === true)
	.sort((a: Resource, b: Resource) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateB - dateA; // Most recent first
	})
	.slice(0, 2);

// Combined featured items type
export type FeaturedItem =
	| ({ type: "paper" } & Paper)
	| ({ type: "resource" } & Resource);

// Get combined featured items (2 papers + 2 resources), sorted by date
export const featuredItems: FeaturedItem[] = [
	...featuredPapers.map((p) => ({ ...p, type: "paper" as const })),
	...featuredResources.map((r) => ({ ...r, type: "resource" as const })),
]
	.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateB - dateA; // Most recent first
	})
	.slice(0, 4);

// Default export for backward compatibility
export default papers;
