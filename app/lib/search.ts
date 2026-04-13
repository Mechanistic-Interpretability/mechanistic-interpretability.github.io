import allPosts from "@/lib/posts";

export interface SearchResult {
	post: (typeof allPosts)[0];
	score: number;
}

const SCORE_WEIGHTS = {
	exactTitleMatch: 100,
	titleStartsWith: 80,
	titleContains: 60,
	summaryContains: 40,
	fuzzyMatch: 10,
} as const;

const MAX_RESULTS = 8;

/**
 * Search blog posts with fuzzy matching and relevance scoring
 */
export function searchPosts(query: string): SearchResult[] {
	if (!query.trim()) return [];

	const queryLower = query.toLowerCase();

	return allPosts
		.map((post) => {
			const titleLower = post.title.toLowerCase();
			const summaryLower = post.summary.toLowerCase();

			let score = 0;

			// Exact title match (highest priority)
			if (titleLower === queryLower) {
				score += SCORE_WEIGHTS.exactTitleMatch;
			}
			// Title starts with query
			else if (titleLower.startsWith(queryLower)) {
				score += SCORE_WEIGHTS.titleStartsWith;
			}
			// Title contains query
			else if (titleLower.includes(queryLower)) {
				score += SCORE_WEIGHTS.titleContains;
			}

			// Summary contains query
			if (summaryLower.includes(queryLower)) {
				score += SCORE_WEIGHTS.summaryContains;
			}

			// Fuzzy match for title
			if (score === 0) {
				const fuzzyScore = calculateFuzzyScore(queryLower, titleLower);
				score += fuzzyScore * SCORE_WEIGHTS.fuzzyMatch;
			}

			return { post, score };
		})
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, MAX_RESULTS);
}

/**
 * Calculate fuzzy match score using character sequence matching
 */
function calculateFuzzyScore(query: string, text: string): number {
	let textIndex = 0;
	let score = 0;

	for (const char of query) {
		const foundIndex = text.indexOf(char, textIndex);
		if (foundIndex === -1) {
			return 0;
		}
		score += 1;
		textIndex = foundIndex + 1;
	}

	return score / query.length;
}

/**
 * Get relevance indicator based on score
 */
export function getRelevanceIndicator(score: number): string {
	if (score >= 80) return "★★★";
	if (score >= 60) return "★★☆";
	return "★☆☆";
}

/**
 * Format search result for terminal display
 */
export function formatSearchResult(
	result: SearchResult,
	index: number,
	maxSummaryLength = 60,
): {
	title: string;
	summary: string;
	href: string;
} {
	const relevance = getRelevanceIndicator(result.score);
	const summary =
		result.post.summary.slice(0, maxSummaryLength) +
		(result.post.summary.length > maxSummaryLength ? "..." : "");

	return {
		title: `  [${index + 1}] ${result.post.title} ${relevance}`,
		summary: `      ${summary}`,
		href: `/blog/${result.post._meta.path}`,
	};
}
