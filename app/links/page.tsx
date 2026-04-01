import { promises as fs } from "fs";
import path from "path";
import mergeMetadata from "@/lib/mergeMetadata";
import MasonryGrid from "./MasonryGrid";

export const metadata = mergeMetadata({
	title: "Links",
	description:
		"A curated collection of projects, people, and resources focused on mechanistic interpretability.",
});

// Supported image extensions
const imageExtensions = [
	".jpg",
	".jpeg",
	".png",
	".gif",
	".webp",
	".JPG",
	".JPEG",
	".PNG",
	".GIF",
	".WEBP",
];

interface LinkImage {
	filename: string;
	url?: string;
	category?: string;
}

interface ImageWithLink {
	filename: string;
	category?: string;
	url?: string;
}

async function parseLinksMDX(): Promise<LinkImage[]> {
	try {
		const contentPath = path.join(
			process.cwd(),
			"content",
			"links",
			"index.mdx",
		);
		const content = await fs.readFile(contentPath, "utf-8");

		// Extract frontmatter
		const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatterMatch) return [];

		const yaml = frontmatterMatch[1];
		const images: LinkImage[] = [];

		// Parse images array from YAML
		const lines = yaml.split("\n");
		let inImagesBlock = false;
		let currentImage: Partial<LinkImage> = {};

		for (const line of lines) {
			const trimmed = line.trim();

			if (trimmed === "images:") {
				inImagesBlock = true;
				continue;
			}

			if (!inImagesBlock) continue;

			// Check if we've exited the images block
			if (
				!trimmed.startsWith("-") &&
				!trimmed.startsWith("filename:") &&
				!trimmed.startsWith("url:") &&
				!trimmed.startsWith("category:")
			) {
				// Push last image if exists
				if (currentImage.filename) {
					images.push(currentImage as LinkImage);
				}
				break;
			}

			// New image entry
			if (trimmed.startsWith("-")) {
				// Save previous image
				if (currentImage.filename) {
					images.push(currentImage as LinkImage);
				}
				currentImage = {};

				// Extract inline values
				const inlineMatch = trimmed.match(
					/-\s*filename:\s*"([^"]+)"(?:\s*url:\s*"([^"]+)")?(?:\s*category:\s*"([^"]+)")?/,
				);
				if (inlineMatch) {
					currentImage = {
						filename: inlineMatch[1],
						url: inlineMatch[2],
						category: inlineMatch[3],
					};
				}
			}

			// Filename line
			const filenameMatch = trimmed.match(/filename:\s*"([^"]+)"/);
			if (filenameMatch) {
				currentImage.filename = filenameMatch[1];
			}

			// URL line
			const urlMatch = trimmed.match(/url:\s*"([^"]+)"/);
			if (urlMatch) {
				currentImage.url = urlMatch[1];
			}

			// Category line
			const categoryMatch = trimmed.match(/category:\s*"([^"]+)"/);
			if (categoryMatch) {
				currentImage.category = categoryMatch[1];
			}
		}

		// Don't forget the last image
		if (currentImage.filename) {
			images.push(currentImage as LinkImage);
		}

		return images;
	} catch {
		return [];
	}
}

async function getProjectImages(): Promise<ImageWithLink[]> {
	const projectsDir = path.join(
		process.cwd(),
		"public",
		"images",
		"projects",
	);

	const linkImages = await parseLinksMDX();

	// Create lookup maps
	const urlMap = new Map(linkImages.map((img) => [img.filename, img.url]));
	const categoryMap = new Map(
		linkImages.map((img) => [img.filename, img.category]),
	);

	try {
		const files = await fs.readdir(projectsDir);

		// Filter only image files
		const imageFiles = files.filter((file) => {
			const ext = path.extname(file).toLowerCase();
			return (
				imageExtensions.includes(ext) ||
				imageExtensions.includes(path.extname(file))
			);
		});

		// Sort alphabetically for consistent ordering
		const sortedFiles = imageFiles.sort();

		// Add category metadata and URL from MDX (no default - undefined means "All" tab only)
		return sortedFiles.map((filename) => ({
			filename,
			category: categoryMap.get(filename),
			url: urlMap.get(filename),
		}));
	} catch (error) {
		console.error("Error reading projects directory:", error);
		return [];
	}
}

export default async function LinksPage() {
	const imagesWithData = await getProjectImages();

	return (
		<>
			<div className="mb-8 pt-4 sm:pt-6">
				<h1 className="mb-2 text-2xl font-extrabold text-black dark:text-white sm:text-3xl md:text-4xl">
					Links
				</h1>
				<p className="text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
					A collection of links to projects, people, and resources
					focused on mechanistic interpretability.
				</p>
			</div>

			{imagesWithData.length > 0 ? (
				<MasonryGrid images={imagesWithData} />
			) : (
				<div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-200 bg-neutral-100/50 dark:border-zinc-800 dark:bg-neutral-900/50">
					<p className="text-zinc-500 dark:text-zinc-400">
						No images found.
					</p>
				</div>
			)}
		</>
	);
}
