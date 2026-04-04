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

// Default export for backward compatibility
export default papers;
