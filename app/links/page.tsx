import { redirect } from "next/navigation";
import mergeMetadata from "@/lib/mergeMetadata";

export const metadata = mergeMetadata({
	title: "Links",
	description:
		"A curated collection of projects, people, and resources focused on mechanistic interpretability.",
});

export default function LinksPage() {
	redirect("/hub?view=resources");
}
