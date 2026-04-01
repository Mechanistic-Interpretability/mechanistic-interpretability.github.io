import allPosts from "@/lib/posts";

export interface SearchItem {
	id: string;
	title: string;
	description?: string;
	content?: string;
	href: string;
	type: "page" | "post" | "project" | "external";
	tags?: string[];
	priority?: number;
	icon?: string;
}

// Static search index built at runtime
export const searchIndex: SearchItem[] = [
	// Main pages
	{
		id: "home",
		title: "Home",
		description: "MI",
		href: "/",
		type: "page",
		priority: 10,
		icon: "🏠",
	},

	{
		id: "blog",
		title: "Blog",
		description: "Blog posts and writings",
		href: "/blog",
		type: "page",
		priority: 8,
		icon: "📝",
	},
	{
		id: "books",
		title: "Books",
		description: "Reading list and recommendations",
		href: "/books",
		type: "page",
		priority: 6,
		icon: "📚",
	},

	// Blog posts
	...allPosts.map((post) => ({
		id: `post-${post._meta.path}`,
		title: post.title,
		description: post.summary,
		content: post.content,
		href: `/blog/${post._meta.path}`,
		type: "post" as const,
		priority: 4,
		icon: "📰",
		tags: [post._meta.path.split("-")[0]],
	})),

	// Projects from CV page

	// External links
	{
		id: "email",
		title: "Email",
		description: "allenleexyz@gmail.com",
		href: "mailto:allenleexyz@gmail.com",
		type: "external",
		priority: 8,
		icon: "📧",
	},

	// Orbit links
	{
		id: "orbit-instagram",
		title: "Instagram",
		description: "allen.35mm on Instagram",
		href: "https://www.instagram.com/allen.35mm/",
		type: "external",
		priority: 6,
		icon: "📸",
		tags: ["instagram", "social", "photo"],
	},
	{
		id: "orbit-github",
		title: "GitHub",
		description: "allenv0 on GitHub",
		href: "https://github.com/allenv0",
		type: "external",
		priority: 7,
		icon: "💻",
		tags: ["github", "code", "repo"],
	},
	{
		id: "orbit-airposture",
		title: "AirPosture",
		description: "AirPods as an AI Posture Coach",
		href: "https://www.airposture.pro/",
		type: "external",
		priority: 7,
		icon: "🧘",
		tags: ["airposture", "air8", "ios", "app"],
	},
	{
		id: "orbit-twitter",
		title: "X/Twitter",
		description: "allenleexyz on X",
		href: "https://x.com/allenleexyz",
		type: "external",
		priority: 7,
		icon: "𝕏",
		tags: ["twitter", "x", "social"],
	},

	// Additional project links
];

// Fuzzy search implementation
export function searchItems(
	query: string,
	items: SearchItem[] = searchIndex,
): SearchItem[] {
	if (!query.trim()) {
		return items
			.filter((item) => item.priority && item.priority >= 7)
			.sort((a, b) => (b.priority || 0) - (a.priority || 0))
			.slice(0, 8);
	}

	const queryLower = query.toLowerCase();

	return items
		.map((item) => {
			const titleScore = calculateScore(item.title, queryLower);
			const descScore = calculateScore(
				item.description || "",
				queryLower,
			);
			const tagScore = Math.max(
				...(item.tags || []).map((tag) =>
					calculateScore(tag, queryLower),
				),
			);

			const contentScore = calculateScore(item.content || "", queryLower);

			const maxScore = Math.max(
				titleScore,
				descScore,
				tagScore,
				contentScore,
			);

			return {
				item,
				score: maxScore * (item.priority || 1),
			};
		})
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score)
		.map(({ item }) => item)
		.slice(0, 10);
}

function calculateScore(text: string, query: string): number {
	const textLower = text.toLowerCase();

	// Exact match
	if (textLower === query) return 100;

	// Starts with
	if (textLower.startsWith(query)) return 80;

	// Contains
	if (textLower.includes(query)) return 60;

	// Fuzzy match (only if no exact match found in any field)
	return 0;
}
