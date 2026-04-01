import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkSmartypants from "remark-smartypants";
import getBlurDataURL from "./getBlurDataURL";

const posts = defineCollection({
	name: "posts",
	directory: "../../content",
	include: "**/*.{md,mdx}",
	exclude: ["papers/**/*.{md,mdx}"],
	schema: (z) => ({
		title: z.string(),
		date: z.coerce.date(),
		summary: z.string(),
		cover: z.string(),
		coverAlt: z.string(),
		category: z.enum(["blog", "notes", "app"]).default("blog"),
	}),
	transform: async (document, context) => {
		const mdx = await compileMDX(context, document, {
			remarkPlugins: [[remarkSmartypants, { dashes: true }]],
		});
		return {
			...document,
			mdx,
			readingTime: getReadingTime(document.content),
			blurDataURL: await getBlurDataURL(document.cover),
		};
	},
});

const papers = defineCollection({
	name: "papers",
	directory: "../../content/papers",
	include: "**/*.{md,mdx}",
	schema: (z) => ({
		title: z.string(),
		authors: z.array(z.string()),
		venue: z.string(),
		year: z.number(),
		category: z.enum(["Anthropic", "DeepMind"]),
		url: z.string().optional(),
		abstract: z.string(),
		order: z.number().optional(),
	}),
	transform: async (document, context) => {
		const mdx = await compileMDX(context, document, {
			remarkPlugins: [[remarkSmartypants, { dashes: true }]],
		});
		return {
			...document,
			mdx,
		};
	},
});

const links = defineCollection({
	name: "links",
	directory: "../../content/links",
	include: "**/*.mdx",
	schema: (z) => ({
		images: z.array(
			z.object({
				filename: z.string(),
				url: z.string().url().optional(),
			}),
		),
	}),
	transform: async (document, context) => {
		// Create a lookup map for images
		const imageMap = new Map(
			document.images.map((img) => [img.filename, img.url]),
		);

		return {
			...document,
			imageMap,
		};
	},
});

export default defineConfig({
	collections: [posts, papers, links],
});

function getReadingTime(content: string) {
	const words = content.split(/\s+/g).length;
	const minutes = Math.ceil(words / 200); // 200 words per minute
	return minutes;
}
