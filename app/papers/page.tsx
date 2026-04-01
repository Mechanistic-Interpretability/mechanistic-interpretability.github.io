import mergeMetadata from "@/lib/mergeMetadata";
import { PapersContent } from "@/components/PapersContent";

export const metadata = mergeMetadata({
	title: "Research Papers",
	description: "Collection of research papers and academic readings",
});

export default function Page() {
	return <PapersContent />;
}
