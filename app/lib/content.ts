import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkSmartypants from "remark-smartypants";
import getBlurDataURL from "./getBlurDataURL";

const posts = defineCollection({
	name: "posts",
	directory: "../../content",
	include: "**/*.{md,mdx}",
	exclude: [
		"papers/**/*.{md,mdx}",
		"resources/**/*.{md,mdx}",
		"links/**/*.{md,mdx}",
	],
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
		category: z.enum(["Anthropic", "DeepMind", "Google", "OpenAI", "Meta"]),
		url: z.string().optional(),
		abstract: z.string(),
		featured: z.boolean().default(true),
		order: z.number().optional(),
		date: z.coerce.date().optional(),
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

const resources = defineCollection({
	name: "resources",
	directory: "../../content/resources",
	include: "**/*.{md,mdx}",
	schema: (z) => ({
		title: z.string(),
		description: z.string().optional(),
		url: z.string().url(),
		category: z.enum([
			"Anthropic",
			"DeepMind",
			"Google",
			"OpenAI",
			"Meta",
			"Resources",
		]),
		image: z.string(),
		featured: z.boolean().default(false),
		order: z.number().optional(),
		date: z.coerce.date().optional(),
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

// Keep links collection for backward compatibility during migration
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
	collections: [posts, papers, resources, links],
});

function getReadingTime(content: string) {
	const words = content.split(/\s+/g).length;
	const minutes = Math.ceil(words / 200);
	return minutes;
}
