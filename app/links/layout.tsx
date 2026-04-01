import mergeMetadata from "@/lib/mergeMetadata";

export const metadata = mergeMetadata({
	title: "Links",
	description:
		"A collection of links to projects, people, and resources focused on mechanistic interpretability.",
});

export default function LinksLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen w-full px-4 sm:px-6 lg:px-8">
			{children}
		</div>
	);
}
