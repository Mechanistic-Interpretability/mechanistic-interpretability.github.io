import mergeMetadata from "@/lib/mergeMetadata";
import { notFound } from "next/navigation";
import CustomMDX from "@/components/CustomMDX";
import TableOfContents from "@/components/TableOfContents";
import { SkeuomorphicPanel } from "@/components/SkeuomorphicPanel";
import allPosts from "@/lib/posts";
import "./code.css";

export const generateStaticParams = () => {
	return allPosts.map((post) => ({ slug: post._meta.path }));
};

export default async function Post({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = allPosts.find((post) => post._meta.path === slug);
	if (!post) notFound();

	return (
		<>
			<TableOfContents />
			<SkeuomorphicPanel
				title={post.title}
				screws={false}
				className="w-full max-w-none"
			>
				<article className="prose prose-base prose-zinc mx-auto w-full max-w-none p-4 dark:prose-invert md:prose-lg prose-h1:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400 sm:p-8">
					<h1 className="text-balance text-2xl font-bold text-black dark:text-zinc-100">
						{post.title}
					</h1>
					<CustomMDX code={post.mdx} />
				</article>
			</SkeuomorphicPanel>
		</>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = allPosts.find((post) => post._meta.path === slug);

	if (!post) return mergeMetadata();

	return mergeMetadata({
		title: post.title,
		description: post.summary,
		image: post.cover,
		imageAlt: post.coverAlt,
	});
}
