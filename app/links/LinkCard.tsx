"use client";

import Image from "next/image";
import { useState } from "react";
import { IconExternalLink } from "@tabler/icons-react";

interface LinkCardProps {
	image: string;
	priority?: boolean;
	onClick?: () => void;
	hasUrl?: boolean;
}

export default function LinkCard({
	image,
	priority = false,
	onClick,
	hasUrl = false,
}: LinkCardProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const isGif = image.toLowerCase().endsWith(".gif");

	return (
		<div
			onClick={onClick}
			className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-500/45 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1 shadow-[0_8px_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-slate-500/70 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[0_10px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:shadow-[0_14px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.1)] sm:rounded-[1.2rem] ${
				isLoaded ? "opacity-100" : "opacity-0"
			} animate-fade-in`}
		>
			{/* Plastic grain texture */}
			<div className="plastic-grain pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.2rem]" />

			{/* Shell highlight */}
			<div className="dark:bg-white/8 pointer-events-none absolute inset-x-4 top-0.5 h-3 rounded-full bg-white/50 blur-md" />

			{/* Inner bezel */}
			<div className="relative overflow-hidden rounded-xl border border-slate-500/45 bg-[#edf2f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(15,23,42,0.15)] dark:border-slate-600/70 dark:bg-[#0a0a0a] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-2px_6px_rgba(0,0,0,0.5)] sm:rounded-[1rem]">
				<Image
					src={`/images/projects/${image}`}
					alt={`Link: ${image.split(".")[0]}`}
					width={800}
					height={600}
					className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
					priority={priority}
					unoptimized={isGif}
					onLoad={() => setIsLoaded(true)}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
				/>
			</div>

			{/* Subtle overlay on hover */}
			<div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/40 sm:rounded-[1.2rem]" />

			{/* Link indicator - subtle top-right corner */}
			{hasUrl && (
				<div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 opacity-80 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 dark:bg-black/80">
					<IconExternalLink
						size={14}
						className="text-violet-600 dark:text-violet-400"
					/>
				</div>
			)}

			{/* Click hint (now bottom-right) */}
			<div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 dark:bg-black/80">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={16}
					height={16}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-zinc-600 dark:text-zinc-300"
				>
					<path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
					<path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
				</svg>
			</div>
		</div>
	);
}
