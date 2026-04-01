"use client";

import Link from "next/link";
import { IconCat, IconHome, IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export const metadata = {
	title: "404: That page doesn't exist",
};

export default function NotFound() {
	const [src, setSrc] = useState("/images/blog/code.png");
	const [loading, setLoading] = useState(true);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 text-center text-lg md:text-xl">
			<h1 className="mb-2 text-2xl font-extrabold text-zinc-800 dark:text-zinc-200 md:text-3xl">
				404: That page doesn&apos;t exist.
			</h1>
			<p className="text-zinc-600 dark:text-zinc-400">
				Maybe you&apos;re looking for{" "}
				<Link
					href="/blog"
					className="text-blue-600 hover:underline dark:text-blue-400"
				>
					Blog
				</Link>
				?
			</p>

			<div className="relative mx-auto mt-6 w-fit overflow-hidden rounded-2xl border-zinc-400/50 bg-zinc-200 drop-shadow-sm dark:bg-zinc-800">
				{loading && (
					<IconLoader2
						className="absolute inset-0 m-auto animate-spin"
						size={48}
					/>
				)}

				<Image
					src={src}
					alt="A cat"
					className={clsx("relative z-10", {
						"opacity-0": loading && typeof window !== "undefined", // Don't hide image on server, allowing NoScript users to see it
					})}
					width={800}
					height={600}
					unoptimized
					onLoad={() => setLoading(false)}
				/>
			</div>

			<div className="mx-auto mt-4 flex w-full flex-row justify-center gap-4 md:w-fit">
				<Link
					href={"/"}
					className="inline-flex items-center gap-2 rounded-lg border border-slate-500/45 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] px-4 py-2 text-sm font-semibold text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_3px_rgba(15,23,42,0.2)] transition-all duration-200 hover:scale-105 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_6px_rgba(15,23,42,0.15)] focus:outline-none focus:ring-2 focus:ring-blue-400 active:shadow-[inset_0_2px_4px_rgba(15,23,42,0.2)] dark:border-slate-600/70 dark:from-[#252d38] dark:to-[#151b24] dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_3px_8px_rgba(0,0,0,0.4)] md:px-5 md:py-2.5 md:text-base"
				>
					<IconHome /> Home
				</Link>
			</div>
		</div>
	);
}
