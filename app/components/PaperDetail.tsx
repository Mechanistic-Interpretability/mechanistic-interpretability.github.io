"use client";

import { useEffect, useRef } from "react";
import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import { highlight } from "sugar-high";
import React from "react";
import type { Paper } from "@/lib/papers";

// MDX Helper Components
function CustomImage(props: any) {
	return (
		// eslint-disable-next-line jsx-a11y/alt-text, jsx-a11y/img-redundant-alt
		<img {...props} className="rounded-lg drop-shadow-sm" alt={props.alt} />
	);
}

function CustomLink(props: any) {
	const href = props.href as string;

	if (href.startsWith("/")) {
		return (
			<Link
				{...props}
				className={"gradient-link " + (props.className || "")}
			/>
		);
	}

	if (href.startsWith("#")) {
		return (
			<a
				{...props}
				className={"gradient-link " + (props.className || "")}
			/>
		);
	}

	return (
		<a
			target="_blank"
			{...props}
			className={"gradient-link " + (props.className || "")}
		/>
	);
}

function CustomCode({ children, ...props }: any) {
	const html = highlight(children);
	return <code {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

function createHeadingComponent(level: number) {
	return function CustomHeading({
		children,
	}: React.HTMLAttributes<HTMLHeadingElement>) {
		const slug = (children || "")
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-");

		const Heading = `h${level}` as keyof React.JSX.IntrinsicElements;
		return (
			<Heading id={slug} className="relative w-fit">
				<a
					href={`#${slug}`}
					className="absolute ml-[-1em] h-full w-[calc(100%+1em)] no-underline before:inline-block before:scale-90 before:text-zinc-400 before:opacity-0 before:transition before:content-['#'] hover:before:scale-100 hover:before:opacity-100 before:dark:text-zinc-600"
					aria-hidden
				/>
				{children}
			</Heading>
		);
	};
}

interface PaperDetailProps {
	paper: Paper | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function PaperDetail({
	paper,
	isOpen,
	onClose,
}: PaperDetailProps) {
	const drawerRef = useRef<HTMLDivElement>(null);

	// Handle click outside to close
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				drawerRef.current &&
				!drawerRef.current.contains(e.target as Node)
			) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			// Prevent body scroll when drawer is open
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	if (!paper) return null;

	// Get venue badge color
	const getVenueColor = (venue: string) => {
		const venueColors: Record<string, string> = {
			NeurIPS:
				"bg-amber-500/20 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300",
			ICML: "bg-blue-500/20 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300",
			ICLR: "bg-purple-500/20 text-purple-700 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300",
			CVPR: "bg-pink-500/20 text-pink-700 border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-300",
			NAACL: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300",
			Nature: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300",
			Science:
				"bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300",
			arXiv: "bg-slate-500/20 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300",
		};
		return (
			venueColors[venue] ||
			"bg-violet-500/20 text-violet-700 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-300"
		);
	};

	return (
		<>
			{/* Backdrop overlay */}
			<div
				className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/80 ${
					isOpen ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>

			{/* Drawer panel - optimized for mobile */}
			<div
				ref={drawerRef}
				className={`fixed right-0 top-0 z-50 h-full w-full max-w-[100vw] transform transition-transform duration-300 ease-out sm:max-w-xl md:max-w-2xl ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Outer shell - full width on mobile */}
				<div className="h-full overflow-hidden rounded-l-xl border-l border-slate-500/35 bg-gradient-to-b from-[#f4f7fb] via-[#d7dee7] to-[#a7b3c0] p-1.5 shadow-[-8px_0_20px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(71,85,105,0.2)] dark:border-slate-500/60 dark:from-[#3b4450] dark:via-[#2a313b] dark:to-[#1a1f27] dark:shadow-[-12px_0_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-4px_10px_rgba(0,0,0,0.4)] sm:rounded-l-2xl sm:p-2 sm:shadow-[-12px_0_28px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(71,85,105,0.25)] md:rounded-l-[1.4rem] md:p-3">
					{/* Plastic grain */}
					<div className="plastic-grain pointer-events-none absolute inset-0 rounded-l-2xl sm:rounded-l-[1.4rem]" />

					{/* Close button - mobile optimized with better touch target */}
					<button
						onClick={onClose}
						className="absolute right-3 top-3 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-500/35 bg-gradient-to-b from-[#eef3f9] to-[#c3cdda] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,23,42,0.2)] transition-all active:scale-95 dark:border-slate-600/60 dark:from-[#252d38] dark:to-[#151b24] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_3px_6px_rgba(0,0,0,0.35)] sm:right-4 sm:top-4 sm:h-10 sm:w-10 sm:hover:scale-110"
					>
						<svg
							className="h-5 w-5 text-slate-700 dark:text-slate-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					{/* Inner bezel */}
					<div className="relative h-full overflow-hidden rounded-xl border border-slate-500/35 bg-gradient-to-b from-[#e8edf3] to-[#b9c4d1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(15,23,42,0.18)] dark:border-slate-600/60 dark:from-[#202833] dark:to-[#141b24] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),inset_0_-2px_6px_rgba(0,0,0,0.5)] sm:rounded-2xl sm:shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),inset_0_-3px_6px_rgba(15,23,42,0.22)]">
						{/* Content area with scroll */}
						<div className="relative h-full overflow-y-auto overflow-x-hidden bg-[#edf2f8] dark:bg-[#0a0a0a]">
							{/* Top shadow overlay for depth */}
							<div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/5 to-transparent dark:from-black/20 sm:h-24" />

							{/* Bottom shadow overlay for depth */}
							<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/5 to-transparent dark:from-black/20 sm:h-24" />

							<div className="relative z-0 p-4 sm:p-5 md:p-6">
								{/* Paper header */}
								<div className="mb-4 sm:mb-6">
									{/* Venue and year badges */}
									<div className="mb-2.5 flex items-center gap-2 sm:mb-3">
										<span
											className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider sm:px-3 sm:py-1 sm:text-xs ${getVenueColor(
												paper.venue,
											)}`}
										>
											{paper.venue}
										</span>
										<span className="font-mono text-[10px] text-violet-600 dark:text-violet-400 sm:text-xs">
											{paper.year}
										</span>
									</div>

									{/* Title - responsive sizing */}
									<h2 className="mb-3 text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:mb-4 sm:text-2xl md:text-3xl">
										{paper.title}
									</h2>

									{/* Authors - mobile optimized */}
									<div className="mb-3 sm:mb-4">
										<p className="text-xs font-medium text-violet-600 dark:text-violet-400 sm:text-sm">
											Authors
										</p>
										<p className="text-xs italic text-slate-600 dark:text-slate-400 sm:text-sm">
											{paper.authors.join(", ")}
										</p>
									</div>

									{/* Category */}
									<div className="flex items-center gap-1.5 sm:gap-2">
										<div className="h-1.5 w-1.5 rounded-full bg-violet-500 sm:h-2 sm:w-2" />
										<span className="text-[10px] font-medium uppercase tracking-wider text-violet-600 dark:text-violet-400 sm:text-xs">
											{paper.category}
										</span>
									</div>
								</div>

								{/* Abstract section - mobile optimized */}
								<div className="mb-4 rounded-lg border border-slate-400/25 bg-white/60 p-3 dark:border-slate-600/25 dark:bg-slate-800/40 sm:mb-6 sm:rounded-xl sm:p-4">
									<h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 sm:mb-2 sm:text-xs">
										Abstract
									</h3>
									<p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 sm:text-sm">
										{paper.abstract}
									</p>
								</div>

								{/* URL Section - mobile optimized */}
								<div className="mb-4 sm:mb-6">
									<h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 sm:mb-2 sm:text-xs">
										URL
									</h3>
									<div className="flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-400/40 bg-slate-100/80 px-2.5 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] dark:border-slate-600/40 dark:bg-slate-800/60 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] sm:px-3">
										<span className="font-mono text-xs text-violet-600 dark:text-violet-400">
											🔗
										</span>
										{paper.url ? (
											<a
												href={paper.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex-1 truncate font-mono text-[10px] text-slate-600 transition-colors hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 sm:text-xs"
											>
												{paper.url}
											</a>
										) : (
											<span className="flex-1 truncate font-mono text-[10px] text-slate-400 dark:text-slate-500 sm:text-xs">
												No URL available
											</span>
										)}
										{paper.url && (
											<a
												href={paper.url}
												target="_blank"
												rel="noopener noreferrer"
												className="ml-1 inline-flex min-h-[32px] items-center rounded-md border border-violet-400/35 bg-white px-2 py-1 text-[10px] font-medium text-violet-600 transition-all hover:border-violet-500/50 hover:bg-violet-50 active:scale-95 dark:border-violet-500/25 dark:bg-slate-700 dark:text-violet-400 dark:hover:border-violet-400/40 dark:hover:bg-violet-900/25 sm:ml-2 sm:px-2.5"
											>
												<svg
													className="mr-1 h-3 w-3"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
													/>
												</svg>
												<span className="hidden sm:inline">
													Open
												</span>
											</a>
										)}
									</div>
								</div>

								{/* MDX Content - mobile optimized prose */}
								{paper.mdx && (
									<div className="prose prose-sm prose-zinc max-w-none dark:prose-invert sm:prose">
										<MDXContent
											code={paper.mdx}
											components={{
												img: CustomImage,
												a: CustomLink,
												code: CustomCode,
												h1: createHeadingComponent(1),
												h2: createHeadingComponent(2),
												h3: createHeadingComponent(3),
												h4: createHeadingComponent(4),
												h5: createHeadingComponent(5),
												h6: createHeadingComponent(6),
											}}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
