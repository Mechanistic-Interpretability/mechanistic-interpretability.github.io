import mergeMetadata from "@/lib/mergeMetadata";
import BlogClient from "./BlogClient";

export const metadata = mergeMetadata({
	title: "Blog and Notes",
	description: "My thoughts and writings",
});

export default function Page() {
	return <BlogClient />;
}
