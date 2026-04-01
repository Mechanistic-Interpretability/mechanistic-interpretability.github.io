import mergeMetadata from "@/lib/mergeMetadata";

export const metadata = mergeMetadata({
	title: "404: That page doesn't exist",
});

export default function NotFoundLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
} 