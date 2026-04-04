import { Suspense } from "react";
import mergeMetadata from "@/lib/mergeMetadata";
import { PapersContent } from "@/components/PapersContent";

export const metadata = mergeMetadata({
	title: "MI Hub",
	description:
		"Collection of research papers, curated resources, and academic readings on mechanistic interpretability",
});

export default function Page() {
	return (
		<Suspense
			fallback={<div className="p-8 text-center">Loading MI Hub...</div>}
		>
			<PapersContent />
		</Suspense>
	);
}
