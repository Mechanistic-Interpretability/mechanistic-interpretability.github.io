import { createContentCollectionPlugin } from "@content-collections/next";

const withContent = createContentCollectionPlugin({
	configPath: "./app/lib/content.ts",
});

export default withContent({
	images: {
		deviceSizes: [320, 448, 640, 768, 896],
		unoptimized: true,
	},
	output: "export",
	eslint: {
		ignoreDuringBuilds: true,
	},
	// Note: async headers() removed - not compatible with static export
	// If using custom domain: remove basePath
	// If using GitHub Pages with repo name: uncomment and set to your repo name
	// basePath: "/repo-name",
});
