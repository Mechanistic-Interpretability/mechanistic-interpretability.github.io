"use client";

import Link from "next/link";
import { Suspense } from "react";
import allPosts from "@/lib/posts";

export default function PostGrid() {
	const posts = allPosts.slice(0, 5);

	return (
		<Suspense>
			<div className="mx-auto grid grid-cols-2 gap-4 md:grid-cols-3">
				{posts.map((post) => (
					<Link
						href={"/blog/" + post._meta.path}
						className="group relative h-48 overflow-hidden rounded-[20px] first:col-span-2 only:col-span-full max-md:last:even:col-span-full md:h-64 md:first:col-span-2 md:[&:nth-child(5)]:col-span-1"
						aria-label={post.title}
						key={post._meta.path}
					>
						{/* ... rest of the PostGrid implementation ... */}
					</Link>
				))}
			</div>
		</Suspense>
	);
}
