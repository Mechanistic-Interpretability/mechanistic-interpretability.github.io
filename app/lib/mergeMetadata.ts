import { Metadata } from "next";

export default function mergeMetadata({
	title,
	description,
	image,
	imageAlt,
}: {
	title?: string;
	description?: string;
	image?: string;
	imageAlt?: string;
} = {}) {
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL ||
		(process.env.VERCEL_PROJECT_PRODUCTION_URL
			? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
			: "http://localhost:3000");

	const metadata: Metadata = {
		title: title ? `${title} • MI` : "MI",
		icons: {
			icon: [
				{
					url: "/favicon-v2.ico",
					sizes: "16x16 32x32",
					type: "image/x-icon",
				},
			],
			shortcut: "/favicon-v2.ico",
			apple: "/favicon-v2.ico",
		},
		manifest: "/site.webmanifest",
		openGraph: {
			siteName: "MI",
			title: title ?? "MI",
			description: description ?? "MI Research and Engineering",
			images: {
				url: image
					? `${baseUrl}${image}`
					: `${baseUrl}/images/card-image.png`,
				alt:
					imageAlt ??
					"Text reading 'MI' on a blue to purple gradient background.",
			},
		},
		description: description ?? "MI Research and Engineering",
		twitter: {
			title: title ?? "MI",
			card: "summary_large_image",
			images: [
				{
					url: image
						? `${baseUrl}${image}`
						: `${baseUrl}/images/card-image.png`,
					alt:
						imageAlt ??
						"Text reading 'MI' on a blue to purple gradient background.",
				},
			],
			site: "@wartimecto",
		},
	};

	return metadata;
}
